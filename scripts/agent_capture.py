import os
import sys
import json
import time
import re
from datetime import datetime

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
LOGS_DIR = os.path.join(WORKSPACE_DIR, ".agent-logs")
BRAIN_DIR = os.path.expanduser(r"~\.gemini\antigravity\brain")
PROJECT_NAME = "fanthom-ai"
AUTHOR = "atrivers3"
DEFAULT_MODEL = "gemini-3.7-flash"
TOOL_NAME = "antigravity"

os.makedirs(LOGS_DIR, exist_ok=True)

def clean_prompt(raw_text):
    text = raw_text
    if "<USER_REQUEST>" in text and "</USER_REQUEST>" in text:
        m = re.search(r"<USER_REQUEST>\s*(.*?)\s*</USER_REQUEST>", text, re.DOTALL)
        if m:
            text = m.group(1)
    # Remove metadata tags if present
    text = re.sub(r"<ADDITIONAL_METADATA>.*?</ADDITIONAL_METADATA>", "", text, flags=re.DOTALL)
    text = re.sub(r"<USER_SETTINGS_CHANGE>.*?</USER_SETTINGS_CHANGE>", "", text, flags=re.DOTALL)
    return text.strip()

def parse_transcript(transcript_path):
    exchanges = []
    current_prompt = None
    last_response = None
    first_prompt_time = None
    last_prompt_time = None
    
    if not os.path.exists(transcript_path):
        return None

    with open(transcript_path, "r", encoding="utf-8") as f:
        for line in f:
            if not line.strip():
                continue
            try:
                step = json.loads(line)
            except Exception:
                continue

            stype = step.get("type")
            source = step.get("source")
            content = step.get("content", "")
            timestamp = step.get("created_at", "")

            if stype == "USER_INPUT" and source == "USER_EXPLICIT":
                if current_prompt is not None:
                    exchanges.append({
                        "prompt": current_prompt,
                        "response": last_response
                    })
                    current_prompt = None
                    last_response = None

                prompt_text = clean_prompt(content)
                if not first_prompt_time:
                    first_prompt_time = timestamp
                last_prompt_time = timestamp

                current_prompt = {
                    "text": prompt_text,
                    "timestamp": timestamp,
                    "step": step.get("step_index")
                }
            elif source == "MODEL" and stype == "PLANNER_RESPONSE":
                # Check if it has user-facing response content and no tool calls
                if content and not step.get("tool_calls"):
                    last_response = {
                        "text": content.strip(),
                        "timestamp": timestamp,
                        "step": step.get("step_index")
                    }

        if current_prompt is not None:
            exchanges.append({
                "prompt": current_prompt,
                "response": last_response
            })

    return {
        "exchanges": exchanges,
        "first_prompt_time": first_prompt_time,
        "last_prompt_time": last_prompt_time
    }

def format_session_log(session_id, parse_data):
    exchanges = parse_data["exchanges"]
    first_time = parse_data["first_prompt_time"] or datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.000Z")
    last_time = parse_data["last_prompt_time"] or first_time
    
    # Parse date
    date_str = first_time[:10]
    short_session = session_id[:8]

    # Count complete or total exchanges
    valid_exchanges = [e for e in exchanges if e.get("prompt")]
    total_count = len(valid_exchanges)

    lines = [
        "---",
        f"session_id: {session_id}",
        f"date: {date_str}",
        f"author: {AUTHOR}",
        f"model: {DEFAULT_MODEL}",
        f"tool: {TOOL_NAME}",
        f"project: {PROJECT_NAME}",
        f"total_exchanges: {total_count}",
        f"first_prompt_time: {first_time}",
        f"last_prompt_time: {last_time}",
        "---",
        "",
        f"# Session Log - {date_str}",
        "",
        f"Session: `{short_session}` | Project: `{PROJECT_NAME}` | Author: `{AUTHOR}`",
        "",
        "---",
        ""
    ]

    for idx, ex in enumerate(valid_exchanges, 1):
        p = ex["prompt"]
        r = ex.get("response")

        lines.append(f"[LOG_ENTRY type=PROMPT num={idx} session={short_session}]")
        lines.append(f"timestamp: {p['timestamp']}")
        lines.append(f"model: {DEFAULT_MODEL}")
        lines.append("")
        lines.append(p["text"])
        lines.append("")
        lines.append("")

        if r:
            lines.append(f"[LOG_ENTRY type=RESPONSE num={idx} session={short_session}]")
            lines.append(f"timestamp: {r['timestamp']}")
            lines.append(f"model: {DEFAULT_MODEL}")
            lines.append("")
            lines.append(r["text"])
            lines.append("")
            lines.append("")

    return "\n".join(lines).rstrip() + "\n"

def sync_session(session_id, session_dir):
    transcript_full = os.path.join(session_dir, ".system_generated", "logs", "transcript_full.jsonl")
    if not os.path.exists(transcript_full):
        return False

    parsed = parse_transcript(transcript_full)
    if not parsed or not parsed["exchanges"]:
        return False

    # Check if this session pertains to this project
    # We check if WORKSPACE_DIR or 'Fanthom ai' appears in transcript
    belongs_to_workspace = False
    with open(transcript_full, "r", encoding="utf-8") as f:
        content_sample = f.read(50000)
        if "Fanthom ai" in content_sample or "fanthom ai" in content_sample:
            belongs_to_workspace = True

    if not belongs_to_workspace:
        return False

    first_time = parsed["first_prompt_time"] or datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
    # File name format: YYYY-MM-DD_HH-MM-SS_<session-id>.md
    try:
        dt = datetime.strptime(first_time.replace("Z", "+0000"), "%Y-%m-%dT%H:%M:%S%z")
        time_part = dt.strftime("%Y-%m-%d_%H-%M-%S")
    except Exception:
        clean_ts = first_time.replace(":", "-").replace("T", "_")[:19]
        time_part = clean_ts

    target_filename = f"{time_part}_{session_id}.md"
    target_path = os.path.join(LOGS_DIR, target_filename)

    formatted_md = format_session_log(session_id, parsed)

    # Only write if changed
    if os.path.exists(target_path):
        with open(target_path, "r", encoding="utf-8") as f:
            existing = f.read()
        if existing == formatted_md:
            return False

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(formatted_md)

    print(f"[CAPTURE] Synced session {session_id} -> {target_filename}", flush=True)
    return True

def scan_and_sync():
    if not os.path.exists(BRAIN_DIR):
        return
    for item in os.listdir(BRAIN_DIR):
        session_dir = os.path.join(BRAIN_DIR, item)
        if os.path.isdir(session_dir):
            sync_session(item, session_dir)

def watch_loop():
    print(f"[CAPTURE] Watching sessions in {BRAIN_DIR}...", flush=True)
    while True:
        try:
            scan_and_sync()
        except Exception as e:
            print(f"[CAPTURE] Error during sync: {e}", file=sys.stderr, flush=True)
        time.sleep(2)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--watch":
        watch_loop()
    else:
        scan_and_sync()
