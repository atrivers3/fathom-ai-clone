# Agent Capture Guidelines

All interactions in this repository must be automatically captured in `.agent-logs/` following the format required by the 8x Assignment specification.

- All prompt and final response records are extracted from the Antigravity session transcript store into `.agent-logs/`.
- The background daemon `scripts/agent_capture.py --watch` continuously monitors and syncs session logs in real time.
- The logs must be committed to git alongside project changes and never added to `.gitignore`.
