import json

def generate():
    with open('src/data/mockMeetings.ts', 'r', encoding='utf-8') as f:
        content = f.read()

    prefix = 'export const INITIAL_MEETINGS: Meeting[] = '
    start = content.find(prefix) + len(prefix)
    end = content.rfind('];') + 1
    raw_json = content[start:end].strip()

    meetings = json.loads(raw_json)

    def esc(val):
        if val is None:
            return 'NULL'
        s = str(val).replace("'", "''")
        return f"'{s}'"

    def json_esc(val):
        if val is None:
            return "'{}'::jsonb"
        s = json.dumps(val).replace("'", "''")
        return f"'{s}'::jsonb"

    lines = [
        '--',
        '-- seed.sql',
        '-- Seeds initial Fathom AI meetings including the 60m 8-person benchmark call.',
        '-- Run this in the Supabase SQL Editor after running schema.sql.',
        '--',
        ''
    ]

    for m in meetings:
        m_id = esc(m['id'])
        m_title = esc(m['title'])
        m_date = esc(m['date'])
        m_created_at = esc(m.get('createdAt', '2026-10-10T14:00:00Z'))
        m_dur_sec = m['durationSeconds']
        m_dur_fmt = esc(m['durationFormatted'])
        m_platform = esc(m['platform'])
        m_category = esc(m['category'])
        m_overview = esc(m['summary']['overview'])
        m_decisions = json_esc(m['summary']['keyDecisions'])
        m_templates = json_esc(m['summary']['templates'])
        m_media = esc(m.get('mediaUrl'))

        lines.append(f"INSERT INTO public.meetings (id, title, date, created_at, duration_seconds, duration_formatted, platform, category, overview, key_decisions, templates, media_url)")
        lines.append(f"VALUES ({m_id}, {m_title}, {m_date}, {m_created_at}, {m_dur_sec}, {m_dur_fmt}, {m_platform}, {m_category}, {m_overview}, {m_decisions}, {m_templates}, {m_media})")
        lines.append("ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, overview = EXCLUDED.overview, templates = EXCLUDED.templates;")
        lines.append("")

        for p in m.get('participants', []):
            p_id = esc(p['id'])
            p_name = esc(p['name'])
            p_email = esc(p.get('email', ''))
            p_role = esc(p.get('role', 'Participant'))
            p_avatar = esc(p.get('avatar', 'SP'))
            p_color = esc(p.get('color', '#3B82F6'))
            lines.append(f"INSERT INTO public.participants (id, meeting_id, name, email, role, avatar, color) VALUES ({p_id}, {m_id}, {p_name}, {p_email}, {p_role}, {p_avatar}, {p_color}) ON CONFLICT (meeting_id, id) DO NOTHING;")
        lines.append("")

        for a in m.get('actionItems', []):
            a_id = esc(a['id'])
            a_text = esc(a['text'])
            a_aid = esc(a.get('assigneeId', ''))
            a_aname = esc(a.get('assigneeName', ''))
            a_due = esc(a.get('dueDate', ''))
            a_comp = 'TRUE' if a.get('completed', False) else 'FALSE'
            a_sec = a.get('timestampSeconds', 0)
            a_fmt = esc(a.get('formattedTime', '00:00'))
            lines.append(f"INSERT INTO public.action_items (id, meeting_id, text, assignee_id, assignee_name, due_date, completed, timestamp_seconds, formatted_time) VALUES ({a_id}, {m_id}, {a_text}, {a_aid}, {a_aname}, {a_due}, {a_comp}, {a_sec}, {a_fmt}) ON CONFLICT (meeting_id, id) DO NOTHING;")
        lines.append("")

        for h in m.get('highlights', []):
            h_id = esc(h['id'])
            h_title = esc(h['title'])
            h_quote = esc(h['quote'])
            h_spk = esc(h.get('speakerName', ''))
            h_start = h.get('startTime', 0)
            h_fmt = esc(h.get('formattedTime', '00:00'))
            h_cat = esc(h.get('category', 'insight'))
            lines.append(f"INSERT INTO public.highlights (id, meeting_id, title, quote, speaker_name, start_time, formatted_time, category) VALUES ({h_id}, {m_id}, {h_title}, {h_quote}, {h_spk}, {h_start}, {h_fmt}, {h_cat}) ON CONFLICT (meeting_id, id) DO NOTHING;")
        lines.append("")

        for t in m.get('transcript', []):
            t_id = esc(t['id'])
            t_spk_id = esc(t.get('speakerId', ''))
            t_spk_name = esc(t.get('speakerName', ''))
            t_start = t.get('startTime', 0)
            t_end = t.get('endTime', 0)
            t_fmt = esc(t.get('formattedTime', '00:00'))
            t_text = esc(t.get('text', ''))
            t_hl = 'TRUE' if t.get('highlighted', False) else 'FALSE'
            t_top = esc(t.get('topic'))
            lines.append(f"INSERT INTO public.transcript_segments (id, meeting_id, speaker_id, speaker_name, start_time, end_time, formatted_time, text, highlighted, topic) VALUES ({t_id}, {m_id}, {t_spk_id}, {t_spk_name}, {t_start}, {t_end}, {t_fmt}, {t_text}, {t_hl}, {t_top}) ON CONFLICT (meeting_id, id) DO NOTHING;")
        lines.append("")

    with open('seed.sql', 'w', encoding='utf-8') as out:
        out.write('\n'.join(lines))

    print(f"seed.sql generated with {len(lines)} lines.")

if __name__ == '__main__':
    generate()
