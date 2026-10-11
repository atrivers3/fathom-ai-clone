import { Meeting } from '@/types/meeting';

export const INITIAL_MEETINGS: Meeting[] = [
  {
    "id": "meeting-8p-60m",
    "title": "Q3 Core Infrastructure & Real-Time AI Inference Architecture Review",
    "date": "October 10, 2026 \u2022 2:00 PM EST",
    "createdAt": "2026-10-10T14:00:00Z",
    "durationSeconds": 3600,
    "durationFormatted": "60m",
    "platform": "google-meet",
    "category": "Engineering",
    "participants": [
      {
        "id": "spk-1",
        "name": "Alex Vance",
        "email": "alex.vance@fathom-team.internal",
        "role": "VP of Product (Host)",
        "avatar": "AV",
        "color": "#3B82F6"
      },
      {
        "id": "spk-2",
        "name": "Dr. Maya Lin",
        "email": "maya.lin@fathom-team.internal",
        "role": "Principal AI Research Scientist",
        "avatar": "ML",
        "color": "#8B5CF6"
      },
      {
        "id": "spk-3",
        "name": "Marcus Thorne",
        "email": "marcus.thorne@fathom-team.internal",
        "role": "Staff Backend & Infrastructure Lead",
        "avatar": "MT",
        "color": "#10B981"
      },
      {
        "id": "spk-4",
        "name": "Elena Rostova",
        "email": "elena.rostova@fathom-team.internal",
        "role": "Principal Product Designer",
        "avatar": "ER",
        "color": "#EC4899"
      },
      {
        "id": "spk-5",
        "name": "David Kalu",
        "email": "david.kalu@fathom-team.internal",
        "role": "Site Reliability & Cloud Architect",
        "avatar": "DK",
        "color": "#F59E0B"
      },
      {
        "id": "spk-6",
        "name": "Priya Sharma",
        "email": "priya.sharma@fathom-team.internal",
        "role": "Head of Security & Compliance",
        "avatar": "PS",
        "color": "#6366F1"
      },
      {
        "id": "spk-7",
        "name": "Sam Chen",
        "email": "sam.chen@fathom-team.internal",
        "role": "Senior Data Platform Engineer",
        "avatar": "SC",
        "color": "#14B8A6"
      },
      {
        "id": "spk-8",
        "name": "Zoe Washington",
        "email": "zoe.washington@fathom-team.internal",
        "role": "Director of Customer Operations",
        "avatar": "ZW",
        "color": "#EF4444"
      }
    ],
    "summary": {
      "overview": "Comprehensive 60-minute technical sign-off with 8 cross-functional leads on the real-time AI inference pipeline. The team validated 42% latency reduction via 8-bit quantization and speculative decoding, multi-region failover (<1.4s recovery), strict zero-data retention in RAM, sub-second HLS share-clips, and confirmed the Thursday 4-phase canary rollout.",
      "keyDecisions": [
        "Approved Thursday 4-stage canary deployment schedule: 5% at 09:00 UTC, 25% at 11:00 UTC, 100% by 15:00 UTC with automated rollback if P99 > 600ms.",
        "Standardized on quantized 8-bit streaming diarization and 70B+3B speculative decoding over NVLink, achieving 48 tokens/sec at $0.09/meeting-hour.",
        "Enforced strict ephemeral tmpfs RAM buffering with 12s maximum lifecycle and automated memory scrubbing assertions in CI for SOC2 compliance.",
        "Adopted client-side structured JSON entity rendering for instantaneous template switching without extra LLM round-trips.",
        "Standardized sub-second CloudFront HLS byte-range manifests for public share clips with pre-sanitized PII redaction."
      ],
      "templates": {
        "executive-brief": {
          "title": "Executive Brief",
          "description": "High-level summary of strategic decisions, resource requirements, and organizational impact.",
          "sections": [
            {
              "title": "Strategic Outcomes",
              "items": [
                "Real-time AI inference latency cut by 42% (first-token under 18ms for diarization; P99 delivery under 450ms).",
                "Inference unit economics improved dramatically: reduced from $0.42 to $0.09 per meeting hour (86% gross margin at $29/seat tier).",
                "Commercial SLA established: 90-second turnaround guarantee for post-meeting executive briefs communicated to top 20 enterprise clients."
              ]
            },
            {
              "title": "Risk Mitigation & Compliance",
              "items": [
                "Zero critical or high findings in NCC Group third-party penetration test.",
                "Automated PII scrubbing eliminates credit cards, SSNs, API keys, and passwords before Kafka ingestion.",
                "Active-active multi-region failover between us-east-1 and us-west-2 verified with 1.4-second recovery in chaos testing."
              ]
            },
            {
              "title": "Rollout Schedule",
              "items": [
                "Thursday 09:00 UTC: 5% canary deployment with Datadog APM live tracing.",
                "Thursday 11:00 UTC: 25% scale; Thursday 15:00 UTC: 100% global traffic cutover.",
                "Dedicated SRE and Customer Operations war room live on Slack throughout deployment."
              ]
            }
          ]
        },
        "engineering-arch": {
          "title": "Engineering & Architecture",
          "description": "Technical deep-dive on pipelines, infrastructure sizing, latency budgets, and failover specs.",
          "sections": [
            {
              "title": "Inference Pipeline & Diarization",
              "items": [
                "Audio frames chunked in 250ms windows via WebRTC edge ingest proxy.",
                "Acoustic diarization embeddings extracted in <18ms per window with 98.4% attribution accuracy.",
                "VRAM footprint: 340 MB per stream; 50 concurrent streams packed per NVIDIA L4/A10G GPU.",
                "Speculative decoding: 3B draft model paired with 70B target model over NVLink, yielding 48 tokens/sec throughput."
              ]
            },
            {
              "title": "Resilience & Failover Specifications",
              "items": [
                "Cross-region Route53 latency routing triggers if 3 consecutive 500ms probes fail or error rate > 2%.",
                "Client IndexedDB audio cache guarantees zero dropped syllables during 1.4s reconnect.",
                "Automatic canary rollback triggered if P99 latency exceeds 600ms for >90s or error rate > 0.5%."
              ]
            },
            {
              "title": "Security Architecture & Data Privacy",
              "items": [
                "Raw PCM buffers stored solely in ephemeral tmpfs RAM disks, zeroed within 12 seconds.",
                "PII scrubbing runs on CPU worker nodes prior to Kafka topic persistence.",
                "Public clip sharing utilizes CloudFront HLS byte-range manifests with pre-masked transcript projections."
              ]
            }
          ]
        },
        "sales-discovery": {
          "title": "Sales & Enterprise Readiness",
          "description": "Value proposition, enterprise objection handling, and customer SLA commitments.",
          "sections": [
            {
              "title": "Enterprise Selling Points",
              "items": [
                "Guaranteed 90-second executive summary turnaround after meeting conclusion.",
                "Instantaneous view switching (Sales BANT, Executive, Jira Action Items) with zero delay.",
                "High-virality share-clips with sub-second generation and no-login required for external prospects."
              ]
            },
            {
              "title": "Security Objections Addressed",
              "items": [
                "Zero data retention for raw voice: audio never written to persistent disk or cloud storage.",
                "SOC2 Type II compliance ready, GDPR right-to-be-forgotten speaker tombstone supported within 24 hours.",
                "Complete tenant isolation via HMAC-signed webhooks and PostgreSQL row-level security."
              ]
            }
          ]
        },
        "one-on-one": {
          "title": "Team Alignment & Ownership",
          "description": "Cross-functional ownership matrix and operational handoffs.",
          "sections": [
            {
              "title": "Departmental Ownership",
              "items": [
                "Backend (Marcus): Staging canary deployment configs, Route53 thresholds, Prometheus alerts.",
                "AI Research (Maya): Grounding citation threshold verification, 8-bit model weights release.",
                "Product Design (Elena): Mobile breakpoints, keyboard accessibility (Space, J, L, C shortcuts).",
                "Infrastructure (David): Warm GPU pool provisioning, cross-region replication checks.",
                "Security (Priya): Terraform diff review, PII test validation, formal SOC2 sign-off.",
                "Data Platform (Sam): Kafka consumer lag monitoring, RAM zeroing assertions in CI.",
                "Customer Operations (Zoe): Enterprise customer communications, help center documentation."
              ]
            }
          ]
        },
        "customer-success": {
          "title": "Customer Success & Operations",
          "description": "Customer communication plans, support war-room staffing, and feedback tracking.",
          "sections": [
            {
              "title": "Customer Communications",
              "items": [
                "Notify top 20 pilot enterprise accounts about the 90-second SLA turnaround guarantee.",
                "Publish help center guide explaining the one-click template switcher.",
                "Support war room staffed on Slack from 08:30 UTC through Thursday rollout."
              ]
            },
            {
              "title": "Customer Satisfaction Telemetry",
              "items": [
                "Monitor copy-to-clipboard actions and public clip shares as primary value indicators.",
                "Track section-level thumbs up/down votes to identify prompt drift or edge-case hallucinations."
              ]
            }
          ]
        }
      }
    },
    "actionItems": [
      {
        "id": "act-8p-01",
        "text": "Finalize staging canary deployment configs, verify Route53 failover thresholds, and validate Prometheus alert rules",
        "assigneeId": "spk-3",
        "assigneeName": "Marcus Thorne",
        "dueDate": "Wednesday, Oct 14",
        "completed": false,
        "timestampSeconds": 2780,
        "formattedTime": "46:20"
      },
      {
        "id": "act-8p-02",
        "text": "Verify grounding citation confidence threshold on 70B model and publish quantized 8-bit weights to container registry",
        "assigneeId": "spk-2",
        "assigneeName": "Dr. Maya Lin",
        "dueDate": "Wednesday, Oct 14",
        "completed": false,
        "timestampSeconds": 2810,
        "formattedTime": "46:50"
      },
      {
        "id": "act-8p-03",
        "text": "Verify mobile responsive breakpoints, keyboard shortcut tooltips (Space, J, L, C), and polish scrubber animations",
        "assigneeId": "spk-4",
        "assigneeName": "Elena Rostova",
        "dueDate": "Wednesday, Oct 14",
        "completed": true,
        "timestampSeconds": 2840,
        "formattedTime": "47:20"
      },
      {
        "id": "act-8p-04",
        "text": "Provision warm idle GPU nodes in us-east-1 and us-west-2, verify database cross-region replication latency",
        "assigneeId": "spk-5",
        "assigneeName": "David Kalu",
        "dueDate": "Wednesday, Oct 14",
        "completed": false,
        "timestampSeconds": 2870,
        "formattedTime": "47:50"
      },
      {
        "id": "act-8p-05",
        "text": "Review edge proxy Terraform diffs, sign off on PII redaction test results, and issue formal SOC2 authorization",
        "assigneeId": "spk-6",
        "assigneeName": "Priya Sharma",
        "dueDate": "Wednesday, Oct 14",
        "completed": false,
        "timestampSeconds": 2900,
        "formattedTime": "48:20"
      },
      {
        "id": "act-8p-06",
        "text": "Monitor Kafka consumer lag and add automated memory-zeroing integration assertions in CI test suite",
        "assigneeId": "spk-7",
        "assigneeName": "Sam Chen",
        "dueDate": "Wednesday, Oct 14",
        "completed": false,
        "timestampSeconds": 2930,
        "formattedTime": "48:50"
      },
      {
        "id": "act-8p-07",
        "text": "Notify top 20 enterprise pilot clients of 90s turnaround SLA and staff the Slack release war room at 08:30 UTC",
        "assigneeId": "spk-8",
        "assigneeName": "Zoe Washington",
        "dueDate": "Thursday, Oct 15",
        "completed": false,
        "timestampSeconds": 2960,
        "formattedTime": "49:20"
      },
      {
        "id": "act-8p-08",
        "text": "Oversee Thursday canary traffic progression (5% -> 25% -> 100%) and verify executive telemetry dashboard",
        "assigneeId": "spk-1",
        "assigneeName": "Alex Vance",
        "dueDate": "Thursday, Oct 15",
        "completed": false,
        "timestampSeconds": 3020,
        "formattedTime": "50:20"
      }
    ],
    "highlights": [
      {
        "id": "hl-8p-01",
        "title": "42% Latency Drop with Quantized Model",
        "quote": "The latency reduction is significant\u2014almost 42% faster time-to-first-token\u2014without any measurable degradation on our evaluation benchmarks.",
        "speakerName": "Dr. Maya Lin",
        "startTime": 42,
        "formattedTime": "00:42",
        "category": "milestone"
      },
      {
        "id": "hl-8p-02",
        "title": "Instant Client-Side Template Switching",
        "quote": "When a user toggles templates in the UI, we don't need to re-run the entire LLM prompt. The client simply renders the structured entity graph through that template's specific presentation lens!",
        "speakerName": "Dr. Maya Lin",
        "startTime": 660,
        "formattedTime": "11:00",
        "category": "insight"
      },
      {
        "id": "hl-8p-03",
        "title": "Sub-Second HLS Share Clips Without Re-Encoding",
        "quote": "Under the hood, we don't re-encode the entire video file to create a clip. We generate an HLS byte-range manifest slice on CloudFront, so clip creation is sub-second.",
        "speakerName": "Marcus Thorne",
        "startTime": 1170,
        "formattedTime": "19:30",
        "category": "insight"
      },
      {
        "id": "hl-8p-04",
        "title": "Unit Economics: $0.09 per Meeting Hour",
        "quote": "With our quantized 8-bit models and speculative decoding, our inference cost per meeting hour is down from $0.42 to $0.09, giving us an 86% gross margin.",
        "speakerName": "Marcus Thorne",
        "startTime": 2020,
        "formattedTime": "33:40",
        "category": "milestone"
      },
      {
        "id": "hl-8p-05",
        "title": "Automated Canary Rollback Thresholds",
        "quote": "Automatic rollback triggers if P99 latency exceeds 600ms for more than 90 seconds, or if error rate surpasses 0.5% in any 60-second window.",
        "speakerName": "David Kalu",
        "startTime": 3080,
        "formattedTime": "51:20",
        "category": "decision"
      }
    ],
    "transcript": [
      {
        "id": "seg-8p-001",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 0,
        "endTime": 20,
        "formattedTime": "00:00",
        "text": "Good afternoon everyone. Thanks for jumping on. Today we have our mandatory sixty-minute architecture review for our real-time AI inference pipeline. We need full consensus across Product, AI, Backend, SRE, Security, Design, Data, and Ops before our canary rollout on Thursday.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-002",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 20,
        "endTime": 41,
        "formattedTime": "00:20",
        "text": "Thanks Alex. On the backend side, we've benchmarked the new streaming gateway. Our primary goal today is locking down the multi-region failover and agreeing on the P99 latency threshold for concurrent audio transcription and summarization.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-003",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 41,
        "endTime": 62,
        "formattedTime": "00:41",
        "text": "From the AI research perspective, we completed the evaluation of the quantized 8-bit model versus the full precision checkpoint. The latency reduction is significant\u2014almost 42% faster time-to-first-token\u2014without any measurable degradation on our evaluation benchmarks.",
        "highlighted": true,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-004",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 62,
        "endTime": 83,
        "formattedTime": "01:02",
        "text": "And from design, we want to make sure the UI reflects these latency improvements gracefully. When the transcription stream encounters jitter or packet loss, the user shouldn't see jittery jumps in the UI.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-005",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 83,
        "endTime": 104,
        "formattedTime": "01:23",
        "text": "From infrastructure and SRE, my primary concern is cold starts and GPU memory footprint during traffic spikes. If we fail over to our secondary US-East cluster, we must guarantee we don't breach our four-nines uptime target.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-006",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 104,
        "endTime": 125,
        "formattedTime": "01:44",
        "text": "Security and compliance also has three non-negotiables: end-to-end encryption in transit, strict zero-data retention agreements for customer audio buffers, and automated PII redaction before vector embeddings are stored.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-007",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 125,
        "endTime": 146,
        "formattedTime": "02:05",
        "text": "On the data platform side, our streaming Kafka connectors and vector pipeline are ready. We need to verify that the PII tokenization happens before the text chunks hit our Kafka topic, not after.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-008",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 146,
        "endTime": 167,
        "formattedTime": "02:26",
        "text": "And representing Customer Ops: enterprise clients have been asking for SLA commitments on meeting summary turnaround time. If a meeting ends, they expect the executive brief ready within ninety seconds.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-009",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 167,
        "endTime": 188,
        "formattedTime": "02:47",
        "text": "That ninety-second window is an explicit customer promise in our enterprise tier. Let's make sure today's architecture supports that consistently. Marcus, walk us through the current system diagram.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-010",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 188,
        "endTime": 209,
        "formattedTime": "03:08",
        "text": "Sure. The user's audio stream enters our WebRTC edge ingest proxy. Audio frames are chunked into 250-millisecond windows and sent to our streaming ASR workers.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-011",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 209,
        "endTime": 230,
        "formattedTime": "03:29",
        "text": "Those workers generate interim word hypotheses with confidence scores. Once an utterance boundary is detected, the normalized transcript segment is emitted to both the live client WebSocket and our internal event bus.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-012",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 230,
        "endTime": 251,
        "formattedTime": "03:50",
        "text": "The utterance boundary detection is key. In the previous build, we had issues with speaker overlap where two people talking at once created fragmented segments.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-013",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 251,
        "endTime": 272,
        "formattedTime": "04:11",
        "text": "We've now integrated our acoustic diarization model that computes speaker embeddings alongside the speech-to-text token stream. That gives us 98.4% speaker attribution accuracy.",
        "highlighted": true,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-014",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 272,
        "endTime": 293,
        "formattedTime": "04:32",
        "text": "That's huge Maya. In our user testing, users were frustrated when a speaker switch didn't register until five words into a sentence. Does the diarization happen in real time?",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-015",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 293,
        "endTime": 314,
        "formattedTime": "04:53",
        "text": "Yes, the embedding extraction takes under 18 milliseconds per window. So the UI gets the speaker identity simultaneously with the first word of the utterance.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-016",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 314,
        "endTime": 335,
        "formattedTime": "05:14",
        "text": "What does that look like in terms of GPU VRAM per concurrent stream, Maya?",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-017",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 335,
        "endTime": 356,
        "formattedTime": "05:35",
        "text": "Each stream allocates approximately 340 megabytes of VRAM. On an NVIDIA L4 or A10G instance with 24 gigabytes of VRAM, we can safely pack 50 concurrent streams per GPU with safety headroom.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-018",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 356,
        "endTime": 377,
        "formattedTime": "05:56",
        "text": "Fifty streams per GPU is acceptable, but during peak US business hours\u2014say 10 AM Eastern\u2014we anticipate up to 6,000 concurrent active calls. That requires at least 120 GPUs dedicated solely to diarization and ASR.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-019",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 377,
        "endTime": 398,
        "formattedTime": "06:17",
        "text": "We should also factor in our auto-scaling warm pool. If an enterprise starts a 500-person all-hands call, our Kubernetes cluster needs to scale pods in under 30 seconds.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-020",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 398,
        "endTime": 419,
        "formattedTime": "06:38",
        "text": "That's why we implemented the warm idle buffer in EKS. We always keep 15% spare capacity running so we don't hit cold start penalties when spinning up new node groups.",
        "highlighted": false,
        "topic": "Pipeline Overview & Streaming ASR"
      },
      {
        "id": "seg-8p-021",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 419,
        "endTime": 440,
        "formattedTime": "06:59",
        "text": "Before we go deeper into scaling, let's address the audio buffer retention in memory. David, where are the raw PCM audio buffers stored during transcription?",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-022",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 440,
        "endTime": 461,
        "formattedTime": "07:20",
        "text": "They exist in ephemeral tmpfs RAM disks mounted on the ingestion pod. No audio ever touches persistent disk or S3 buckets unless the customer explicitly enabled cloud audio recording.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-023",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 461,
        "endTime": 482,
        "formattedTime": "07:41",
        "text": "And what is the memory lifetime before the buffer is overwritten?",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-024",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 482,
        "endTime": 503,
        "formattedTime": "08:02",
        "text": "Immediately upon segment finalization and ACK from the summarization engine, the memory block is zeroed out. The maximum retention in RAM is 12 seconds in case of network retry.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-025",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 503,
        "endTime": 524,
        "formattedTime": "08:23",
        "text": "Good. Make sure we have an automated test asserting the memory scrub in our CI pipeline so we can show audit logs to SOC2 and ISO auditors.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-026",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 524,
        "endTime": 545,
        "formattedTime": "08:44",
        "text": "I will add an integration assertion in our data test suite that validates memory zeroing on worker termination.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-027",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 545,
        "endTime": 566,
        "formattedTime": "09:05",
        "text": "Excellent. Now let's talk about the summarization pipeline. Once the meeting reaches 15, 30, or 60 minutes, how are we generating the rolling summaries and the final executive brief?",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-028",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 566,
        "endTime": 587,
        "formattedTime": "09:26",
        "text": "We have a two-stage summarization engine. Stage one is a rolling map-reduce worker that creates semantic chapter summaries every five minutes.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-029",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 587,
        "endTime": 607,
        "formattedTime": "09:47",
        "text": "And stage two runs at meeting conclusion. It pulls all chapter summaries plus key flagged utterances and passes them to our fine-tuned 70B model with a specialized system prompt for meeting intelligence.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-030",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 607,
        "endTime": 628,
        "formattedTime": "10:07",
        "text": "How does the template switcher interact with that? For example, if a user switches from Executive Brief to Sales Discovery or Engineering Architecture?",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-031",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 628,
        "endTime": 649,
        "formattedTime": "10:28",
        "text": "That's the beauty of our structured output schema. We extract universal meeting entities\u2014decisions, blockers, numerical commitments, action items, and objections\u2014into an intermediate JSON representation.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-032",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 649,
        "endTime": 670,
        "formattedTime": "10:49",
        "text": "When a user toggles templates in the UI, we don't need to re-run the entire LLM prompt. The client simply renders the structured entity graph through that template's specific presentation lens!",
        "highlighted": true,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-033",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 670,
        "endTime": 691,
        "formattedTime": "11:10",
        "text": "That is brilliant! That means template switching is instantaneous in the UI. No loading spinner or extra API cost for the user.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-034",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 691,
        "endTime": 712,
        "formattedTime": "11:31",
        "text": "That is a massive UX differentiator against competing tools where switching views takes eight to ten seconds of re-generation.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-035",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 712,
        "endTime": 733,
        "formattedTime": "11:52",
        "text": "Our enterprise customers will love that. Sales reps especially want to switch to a BANT format for Salesforce sync, while engineering managers want the Action Item and Jira view.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-036",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 733,
        "endTime": 754,
        "formattedTime": "12:13",
        "text": "From the data storage standpoint, storing that structured JSON graph in PostgreSQL with JSONB is very lightweight\u2014typically under 45 kilobytes per one-hour meeting.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-037",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 754,
        "endTime": 775,
        "formattedTime": "12:34",
        "text": "What happens if the primary inference cluster in us-east-1 encounters a degradation or network partition?",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-038",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 775,
        "endTime": 796,
        "formattedTime": "12:55",
        "text": "We have an active-active fallback configured in us-west-2. The health check daemon probes the inference gateway every 500 milliseconds.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-039",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 796,
        "endTime": 817,
        "formattedTime": "13:16",
        "text": "If three consecutive heartbeat probes fail or error rate exceeds 2%, traffic dynamically reroutes to us-west-2 via AWS Route53 latency routing.",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-040",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 817,
        "endTime": 838,
        "formattedTime": "13:37",
        "text": "Have we tested the failover under simulated load? What is the client experience during the switch?",
        "highlighted": false,
        "topic": "GPU Memory & Template Engine"
      },
      {
        "id": "seg-8p-041",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 838,
        "endTime": 859,
        "formattedTime": "13:58",
        "text": "We ran a chaos test last Tuesday. In-flight WebSocket connections reconnected within 1.4 seconds. The frontend audio buffer held the packets in local IndexedDB so not a single syllable of transcript was lost.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-042",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 859,
        "endTime": 880,
        "formattedTime": "14:19",
        "text": "Did the user see any jarring flicker or disconnection banner in the client?",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-043",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 880,
        "endTime": 901,
        "formattedTime": "14:40",
        "text": "A subtle yellow reconnection dot appeared in the status bar for about two seconds, then switched back to green. No modal or interruption.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-044",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 901,
        "endTime": 922,
        "formattedTime": "15:01",
        "text": "That matches our design spec for resilient connection states. We want to avoid loud error alerts unless disconnection persists beyond five seconds.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-045",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 922,
        "endTime": 943,
        "formattedTime": "15:22",
        "text": "Let's discuss the PII masking layer. Where does the named entity recognition and redaction occur?",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-046",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 943,
        "endTime": 964,
        "formattedTime": "15:43",
        "text": "It runs directly in the stream processing pipeline right after diarization. We use a hybrid regex and fine-tuned BERT model running on CPU nodes.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-047",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 964,
        "endTime": 985,
        "formattedTime": "16:04",
        "text": "What entity types are masked by default?",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-048",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 985,
        "endTime": 1006,
        "formattedTime": "16:25",
        "text": "Credit card numbers, social security numbers, API tokens, passwords, and personal phone numbers. Names and company emails can be preserved or pseudonymized depending on enterprise organization policy.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-049",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 1006,
        "endTime": 1027,
        "formattedTime": "16:46",
        "text": "What about compliance with European GDPR requests for right-to-be-forgotten? If a participant requests their transcript deleted, how is that handled?",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-050",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 1027,
        "endTime": 1048,
        "formattedTime": "17:07",
        "text": "Because each transcript segment is tagged with a unique speakerId, we can execute a soft-tombstone or cryptographic purge on that speaker's dialogue across all indexed documents within 24 hours.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-051",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 1048,
        "endTime": 1069,
        "formattedTime": "17:28",
        "text": "That completely satisfies our legal commitments for EU enterprise expansion. Great design, Sam.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-052",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 1069,
        "endTime": 1090,
        "formattedTime": "17:49",
        "text": "I want to bring up the share-clip feature. In Fathom, one of our highest virality loops is when an executive or salesperson cuts a 30-second snippet of a meeting and shares it with external partners.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-053",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 1090,
        "endTime": 1111,
        "formattedTime": "18:10",
        "text": "How fast does clip generation happen, and can recipients view the video and interactive transcript without creating an account?",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-054",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 1111,
        "endTime": 1132,
        "formattedTime": "18:31",
        "text": "Yes! We designed the Share Clip modal to let users highlight any sentence in the transcript, adjust the start and end handles, and instantly preview the clip.",
        "highlighted": true,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-055",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 1132,
        "endTime": 1153,
        "formattedTime": "18:52",
        "text": "The generated public link has a secure token. Unauthenticated viewers get a clean, branded playback interface with synchronized transcript scrolling.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-056",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 1153,
        "endTime": 1174,
        "formattedTime": "19:13",
        "text": "Under the hood, we don't re-encode the entire video file to create a clip. We generate an HLS byte-range manifest slice on CloudFront, so clip creation is sub-second.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-057",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 1174,
        "endTime": 1195,
        "formattedTime": "19:34",
        "text": "That saves tremendous cloud compute and egress costs. We're serving clips directly from edge caches rather than triggering FFmpeg transcoding jobs.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-058",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 1195,
        "endTime": 1215,
        "formattedTime": "19:55",
        "text": "And the AI can auto-suggest clips! When the model detects an executive consensus or a critical product decision, it flags a 'Smart Moment' with recommended start and end timestamps.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-059",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 1215,
        "endTime": 1236,
        "formattedTime": "20:15",
        "text": "Let's ensure that in our UI, those Smart Highlights are prominently featured alongside the transcript with a one-click 'Share Clip' button.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-060",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 1236,
        "endTime": 1257,
        "formattedTime": "20:36",
        "text": "Already in the Figma components Alex. We have category badges for 'Decision', 'Risk', 'Insight', and 'Action'.",
        "highlighted": false,
        "topic": "Failover, Chaos Tests & PII Masking"
      },
      {
        "id": "seg-8p-061",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 1257,
        "endTime": 1278,
        "formattedTime": "20:57",
        "text": "Do public share clips respect PII redaction? If someone creates a clip of a section containing redacted info, is there any leak?",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-062",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 1278,
        "endTime": 1299,
        "formattedTime": "21:18",
        "text": "No, the share manifest reads from the sanitized transcript projection. The redacted tokens are permanently masked before any public URL token is minted.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-063",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 1299,
        "endTime": 1320,
        "formattedTime": "21:39",
        "text": "Perfect. Security approves that flow.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-064",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 1320,
        "endTime": 1341,
        "formattedTime": "22:00",
        "text": "Now let's examine our observability stack. How are we monitoring inference latency and error rates in production?",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-065",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 1341,
        "endTime": 1362,
        "formattedTime": "22:21",
        "text": "We have Datadog APM tracing every single request from the edge proxy to the transcription workers and LLM inference endpoints.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-066",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 1362,
        "endTime": 1383,
        "formattedTime": "22:42",
        "text": "Our key Prometheus metrics include audio_chunk_ingest_lag_ms, asr_time_to_first_token_ms, and summary_generation_duration_seconds.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-067",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 1383,
        "endTime": 1404,
        "formattedTime": "23:03",
        "text": "What are our P95 and P99 latency alerts set to?",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-068",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 1404,
        "endTime": 1425,
        "formattedTime": "23:24",
        "text": "For streaming transcript delivery, P95 is 280 milliseconds, and P99 is 450 milliseconds. If P99 exceeds 600 milliseconds over a 3-minute window, an automated PagerDuty alert fires to our on-call SRE.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-069",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 1425,
        "endTime": 1446,
        "formattedTime": "23:45",
        "text": "What happens if a Zoom or Google Meet API webhook delivers delayed metadata?",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-070",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 1446,
        "endTime": 1467,
        "formattedTime": "24:06",
        "text": "We have an idempotency deduplication key on every webhook payload. If Zoom delivers meeting metadata late, our reconciler attaches the metadata to the existing session without duplicate records.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-071",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 1467,
        "endTime": 1488,
        "formattedTime": "24:27",
        "text": "That resolves the duplicate meeting cards bug we saw two sprints ago. Fantastic work.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-072",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 1488,
        "endTime": 1509,
        "formattedTime": "24:48",
        "text": "Let's also review the speculative decoding engine we implemented for our summarization models.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-073",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 1509,
        "endTime": 1530,
        "formattedTime": "25:09",
        "text": "By running a compact 3B draft model alongside our 70B target model, we achieve a 2.4x speedup during summary generation without altering the output text by even one character.",
        "highlighted": true,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-074",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 1530,
        "endTime": 1551,
        "formattedTime": "25:30",
        "text": "Is the draft model co-located on the same GPU node, or does it run over NVLink?",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-075",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 1551,
        "endTime": 1572,
        "formattedTime": "25:51",
        "text": "It's co-located on the same node utilizing tensor parallelism over NVLink. Communication overhead is negligible\u2014under 3 milliseconds per batch.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-076",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 1572,
        "endTime": 1593,
        "formattedTime": "26:12",
        "text": "That explains why our batch inference throughput increased from 18 tokens per second to over 48 tokens per second in yesterday's benchmark!",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-077",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 1593,
        "endTime": 1614,
        "formattedTime": "26:33",
        "text": "That directly translates to meeting summaries arriving in under 40 seconds instead of 90 seconds. That is huge for user retention.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-078",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 1614,
        "endTime": 1635,
        "formattedTime": "26:54",
        "text": "From a design perspective, how should we show the summary generation progress to the user while they wait in the post-meeting workspace?",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-079",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 1635,
        "endTime": 1656,
        "formattedTime": "27:15",
        "text": "Should we display a step-by-step progress indicator like 'Transcribing audio... Extracting action items... Generating Executive Brief' or a pulsing shimmer skeleton?",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-080",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 1656,
        "endTime": 1677,
        "formattedTime": "27:36",
        "text": "Definitely step-by-step progress! Users feel much more confident when they see the exact milestones completing in real time rather than a generic spinner.",
        "highlighted": false,
        "topic": "Share Clips & Speculative Decoding"
      },
      {
        "id": "seg-8p-081",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 1677,
        "endTime": 1698,
        "formattedTime": "27:57",
        "text": "I agree with Zoe. Showing '4 of 4 participants identified', '12 action items parsed', and 'Executive Brief assembled' builds trust in the AI's accuracy.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-082",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 1698,
        "endTime": 1719,
        "formattedTime": "28:18",
        "text": "I'll make sure our workspace components include the interactive status stepper for newly processed calls.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-083",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 1719,
        "endTime": 1740,
        "formattedTime": "28:39",
        "text": "Let's discuss action item extraction. Sometimes speakers make tentative suggestions like 'Maybe we should consider updating the docs' versus firm commitments like 'I will update the docs by Friday'.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-084",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 1740,
        "endTime": 1761,
        "formattedTime": "29:00",
        "text": "We solved that by introducing a confidence classifier on modal verbs. Utterances with definitive modal verbs like 'will', 'going to', and explicit time anchors are tagged as high-confidence Action Items.",
        "highlighted": true,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-085",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 1761,
        "endTime": 1782,
        "formattedTime": "29:21",
        "text": "Tentative suggestions are categorized as 'Ideas / Discussion Points' rather than polluting the Action Items checklist.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-086",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 1782,
        "endTime": 1802,
        "formattedTime": "29:42",
        "text": "That is such an important distinction. Nobody wants their task list flooded with hypothetical brainstorming remarks.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-087",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 1802,
        "endTime": 1823,
        "formattedTime": "30:02",
        "text": "Can users check off action items directly in the Fathom UI, and do those checked states sync to integrations?",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-088",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 1823,
        "endTime": 1844,
        "formattedTime": "30:23",
        "text": "Yes, the action items have working checkboxes. When checked, the state toggles immediately with optimistic UI updates and can trigger a webhook to Slack, Asana, or Linear.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-089",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 1844,
        "endTime": 1865,
        "formattedTime": "30:44",
        "text": "We also store the assigneeId and the exact timestampSeconds of the transcript where the task was assigned. Clicking the action item jumps right to that moment in the recording!",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-090",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 1865,
        "endTime": 1886,
        "formattedTime": "31:05",
        "text": "That's one of my favorite features in the workspace. If someone asks 'Wait, did I really agree to take that on?', you just click the timestamp and hear the exact context.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-091",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 1886,
        "endTime": 1907,
        "formattedTime": "31:26",
        "text": "Are there any data isolation risks with multi-tenant action item synchronization?",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-092",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 1907,
        "endTime": 1928,
        "formattedTime": "31:47",
        "text": "For instance, if customer A connects to Slack, could a webhook payload inadvertently route to customer B's workspace?",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-093",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 1928,
        "endTime": 1949,
        "formattedTime": "32:08",
        "text": "No, each webhook is signed with an HMAC-SHA256 signature using a tenant-isolated secret key. Furthermore, our database uses row-level security with tenant_id partitioned tables.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-094",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 1949,
        "endTime": 1970,
        "formattedTime": "32:29",
        "text": "That satisfies our SOC2 tenant isolation requirements. Thank you Marcus.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-095",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 1970,
        "endTime": 1991,
        "formattedTime": "32:50",
        "text": "Let's review our cost modeling. At 50,000 meeting hours per month, what is our projected AWS and GPU inference bill?",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-096",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 1991,
        "endTime": 2012,
        "formattedTime": "33:11",
        "text": "With our quantized 8-bit models and speculative decoding, our inference cost per meeting hour is down from $0.42 to $0.09.",
        "highlighted": true,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-097",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2012,
        "endTime": 2033,
        "formattedTime": "33:32",
        "text": "Nine cents per hour?! That gives us an 86% gross margin on our $29/seat enterprise pricing tier!",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-098",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 2033,
        "endTime": 2054,
        "formattedTime": "33:53",
        "text": "That's phenomenal. It also gives us room to offer generous free tier limits to drive viral adoption.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-099",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 2054,
        "endTime": 2075,
        "formattedTime": "34:14",
        "text": "And if we switch our batch summary workloads to AWS Trainium or Inferentia2 instances next quarter, we can shave another 25% off that figure.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-100",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 2075,
        "endTime": 2096,
        "formattedTime": "34:35",
        "text": "I've already set up an Inferentia test cluster in staging. We can run a shadow benchmark alongside our NVIDIA nodes once this release stabilizes.",
        "highlighted": false,
        "topic": "Action Items Extraction & Costs"
      },
      {
        "id": "seg-8p-101",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 2096,
        "endTime": 2117,
        "formattedTime": "34:56",
        "text": "On the analytics side, how are we capturing user satisfaction with the summaries?",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-102",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 2117,
        "endTime": 2138,
        "formattedTime": "35:17",
        "text": "Do we have thumbs up/thumbs down telemetry, or copy/share tracking?",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-103",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 2138,
        "endTime": 2159,
        "formattedTime": "35:38",
        "text": "We have three primary telemetry signals: copy-to-clipboard actions, share-clip creations, and inline thumbs-up/down feedback buttons on each summary section.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-104",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 2159,
        "endTime": 2180,
        "formattedTime": "35:59",
        "text": "Our CS team will monitor those feedback signals weekly to flag any prompt drift or hallucination patterns.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-105",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2180,
        "endTime": 2201,
        "formattedTime": "36:20",
        "text": "Speaking of prompt drift, Maya, what is our guardrail against hallucinated action items or misattributed statements?",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-106",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 2201,
        "endTime": 2222,
        "formattedTime": "36:41",
        "text": "Every generated claim in the summary has a grounding citation pointing back to the transcript segment ID. If the model cannot provide a high-confidence citation span from the transcript, the claim is pruned.",
        "highlighted": true,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-107",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 2222,
        "endTime": 2243,
        "formattedTime": "37:02",
        "text": "That grounding verification happens in post-processing. It eliminates 99.7% of ungrounded hallucinations.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-108",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 2243,
        "endTime": 2264,
        "formattedTime": "37:23",
        "text": "Grounding citations are also essential for legal defensibility. In corporate disputes, having an immutable link to what was actually uttered protects our clients.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-109",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 2264,
        "endTime": 2285,
        "formattedTime": "37:44",
        "text": "What about disaster recovery? If an entire AWS region experiences a catastrophic outage, what is our RTO and RPO?",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-110",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 2285,
        "endTime": 2306,
        "formattedTime": "38:05",
        "text": "Recovery Time Objective is under five minutes via our automated DNS failover to the secondary region. Recovery Point Objective is zero for finalized meetings because records are synchronously replicated across regions.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-111",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 2306,
        "endTime": 2327,
        "formattedTime": "38:26",
        "text": "For in-flight live meetings during a mid-call regional failure, the local client buffer replays the last 15 seconds to the new region, yielding an RPO of less than 2 seconds of audio.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-112",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2327,
        "endTime": 2348,
        "formattedTime": "38:47",
        "text": "That is industry-leading resilience. Very proud of this engineering achievement.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-113",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 2348,
        "endTime": 2369,
        "formattedTime": "39:08",
        "text": "Let's touch on mobile responsiveness and keyboard accessibility for the workspace.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-114",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 2369,
        "endTime": 2390,
        "formattedTime": "39:29",
        "text": "Power users want to navigate transcripts with keyboard shortcuts: Space for Play/Pause, 'J' to jump back 10 seconds, 'L' to jump forward 10 seconds, and 'C' to open the Clip modal.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-115",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 2390,
        "endTime": 2410,
        "formattedTime": "39:50",
        "text": "All of those hotkeys are implemented on the window event listeners. We also ensured screen reader compatibility with ARIA live regions for streaming updates.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-116",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 2410,
        "endTime": 2431,
        "formattedTime": "40:10",
        "text": "And on mobile or tablet screens, how does the layout adapt?",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-117",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 2431,
        "endTime": 2452,
        "formattedTime": "40:31",
        "text": "The workspace transitions from a side-by-side two-column view into a clean tabbed view where users can easily toggle between 'Transcript', 'Summary', and 'Action Items' without horizontal scrolling.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-118",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 2452,
        "endTime": 2473,
        "formattedTime": "40:52",
        "text": "Does the transcript search support fuzzy matching or regex?",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-119",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 2473,
        "endTime": 2494,
        "formattedTime": "41:13",
        "text": "Or is it semantic search across vector embeddings?",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-120",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 2494,
        "endTime": 2515,
        "formattedTime": "41:34",
        "text": "In the client, we have instant sub-millisecond keyword and prefix search across all speaker names and utterance texts.",
        "highlighted": false,
        "topic": "Grounding Citations & Resilience"
      },
      {
        "id": "seg-8p-121",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 2515,
        "endTime": 2536,
        "formattedTime": "41:55",
        "text": "In the global dashboard, we combine that with hybrid BM25 and vector semantic search, so you can search 'What did Maya say about VRAM?' and find this exact conversation!",
        "highlighted": true,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-122",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2536,
        "endTime": 2557,
        "formattedTime": "42:16",
        "text": "That is pure magic. That makes past meetings as searchable as code in GitHub.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-123",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 2557,
        "endTime": 2578,
        "formattedTime": "42:37",
        "text": "Executives who miss meetings rely on that search constantly to catch up in three minutes instead of watching a 60-minute recording.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-124",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 2578,
        "endTime": 2599,
        "formattedTime": "42:58",
        "text": "Let's confirm the load testing numbers for Thursday's rollout. What was our peak simulated concurrent users?",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-125",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 2599,
        "endTime": 2620,
        "formattedTime": "43:19",
        "text": "We simulated 10,000 concurrent streaming connections with 250 requests per second to the API gateway over a 4-hour soak test.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-126",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 2620,
        "endTime": 2641,
        "formattedTime": "43:40",
        "text": "Memory leak tests showed flat RAM utilization across all worker pods. Zero zombie processes and garbage collection pauses stayed under 12 milliseconds.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-127",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 2641,
        "endTime": 2662,
        "formattedTime": "44:01",
        "text": "Did the penetration test surface any vulnerabilities in our authentication tokens or clip sharing endpoints?",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-128",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 2662,
        "endTime": 2683,
        "formattedTime": "44:22",
        "text": "We reviewed the third-party pentest report from NCC Group. They found zero critical or high severity findings. Two low-severity items regarding HTTP headers were remediated on Monday.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-129",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 2683,
        "endTime": 2704,
        "formattedTime": "44:43",
        "text": "We also verified rate limiting on the public clip endpoints to prevent automated scraping of customer video streams.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-130",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2704,
        "endTime": 2725,
        "formattedTime": "45:04",
        "text": "We are in an exceptionally strong position. Let's do a round-robin check on our final deliverables and action items before we conclude.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-131",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2725,
        "endTime": 2746,
        "formattedTime": "45:25",
        "text": "Marcus, what is backend's top priority before Thursday morning?",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-132",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 2746,
        "endTime": 2767,
        "formattedTime": "45:46",
        "text": "Backend will finalize the staging canary deployment configs, verify Route53 failover health check thresholds, and validate the Prometheus alert rules.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-133",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2767,
        "endTime": 2788,
        "formattedTime": "46:07",
        "text": "Maya, what is the AI team's deliverable?",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-134",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 2788,
        "endTime": 2809,
        "formattedTime": "46:28",
        "text": "AI team will verify the grounding citation confidence threshold on the 70B model and deploy the quantized 8-bit diarization weights to the production image repository.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-135",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2809,
        "endTime": 2830,
        "formattedTime": "46:49",
        "text": "Elena, for Product Design?",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-136",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 2830,
        "endTime": 2851,
        "formattedTime": "47:10",
        "text": "Design will do a final pass on mobile breakpoints, ensure keyboard navigation tooltips are visible, and polish the simulated playback scrubber animations.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-137",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2851,
        "endTime": 2872,
        "formattedTime": "47:31",
        "text": "David, from SRE?",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-138",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 2872,
        "endTime": 2893,
        "formattedTime": "47:52",
        "text": "SRE will provision the warm idle GPU nodes in us-east-1 and us-west-2, verify cross-region database replication latency, and stand by during the canary rollout.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-139",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2893,
        "endTime": 2914,
        "formattedTime": "48:13",
        "text": "Priya, from Security and Compliance?",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-140",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 2914,
        "endTime": 2935,
        "formattedTime": "48:34",
        "text": "Security will review the final Terraform diffs for edge proxies, sign off on the PII redaction test results, and issue the formal SOC2 deployment authorization.",
        "highlighted": false,
        "topic": "Observability & Team Deliverables"
      },
      {
        "id": "seg-8p-141",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2935,
        "endTime": 2956,
        "formattedTime": "48:55",
        "text": "Sam, for Data Platform?",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-142",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 2956,
        "endTime": 2977,
        "formattedTime": "49:16",
        "text": "Data team will monitor Kafka consumer lag during the canary ramp and verify that the automated memory zeroing assertions pass in all test suites.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-143",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 2977,
        "endTime": 2997,
        "formattedTime": "49:37",
        "text": "And Zoe, from Customer Operations?",
        "highlighted": true,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-144",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 2997,
        "endTime": 3018,
        "formattedTime": "49:57",
        "text": "Ops will notify our top twenty enterprise pilot customers about the new 90-second summary turnaround guarantee and prepare help center documentation for the template switcher.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-145",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 3018,
        "endTime": 3039,
        "formattedTime": "50:18",
        "text": "Alex, do we have an exact timeline for the canary progression on Thursday?",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-146",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 3039,
        "endTime": 3060,
        "formattedTime": "50:39",
        "text": "Yes: Thursday at 09:00 UTC, we route 5% of traffic to the new architecture. We monitor error rates and latency for two hours. At 11:00 UTC, we scale to 25%. By 15:00 UTC, if all metrics remain green, we complete the 100% rollout.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-147",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 3060,
        "endTime": 3081,
        "formattedTime": "51:00",
        "text": "What are our automatic rollback triggers?",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-148",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 3081,
        "endTime": 3102,
        "formattedTime": "51:21",
        "text": "Automatic rollback triggers if P99 latency exceeds 600ms for more than 90 seconds, or if error rate surpasses 0.5% in any 60-second window.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-149",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 3102,
        "endTime": 3123,
        "formattedTime": "51:42",
        "text": "If rollback occurs, does it disrupt active meetings or only new connections?",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-150",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 3123,
        "endTime": 3144,
        "formattedTime": "52:03",
        "text": "Active meetings stay pinned to their existing healthy nodes. New connections revert to the stable fallback cluster seamlessly.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-151",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 3144,
        "endTime": 3165,
        "formattedTime": "52:24",
        "text": "That is an exceptionally safe deployment strategy. I give my full security approval.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-152",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 3165,
        "endTime": 3186,
        "formattedTime": "52:45",
        "text": "Data integrity checks are also scheduled to run every 15 minutes during the ramp.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-153",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 3186,
        "endTime": 3207,
        "formattedTime": "53:06",
        "text": "Our support team will have dedicated engineers on call in our Slack war room from 08:30 UTC onward.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-154",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 3207,
        "endTime": 3228,
        "formattedTime": "53:27",
        "text": "Wonderful. We've covered every critical angle: performance, failover, security, UX, cost, and operational readiness.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-155",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 3228,
        "endTime": 3249,
        "formattedTime": "53:48",
        "text": "This has been one of the smoothest cross-functional architecture reviews we've run. Kudos to everyone for the thorough preparation.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-156",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 3249,
        "endTime": 3270,
        "formattedTime": "54:09",
        "text": "Excited to see these models perform in production at this scale. The latency drop will blow our users away.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-157",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 3270,
        "endTime": 3291,
        "formattedTime": "54:30",
        "text": "And the UX will finally feel as fast and effortless as real human conversation.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-158",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 3291,
        "endTime": 3312,
        "formattedTime": "54:51",
        "text": "Infrastructure is locked and ready. We have plenty of GPU capacity and resilient failovers.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-159",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 3312,
        "endTime": 3333,
        "formattedTime": "55:12",
        "text": "Compliance documentation is filed and signed. All green on my end.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-160",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 3333,
        "endTime": 3354,
        "formattedTime": "55:33",
        "text": "Data pipeline monitors are configured and armed.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-161",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 3354,
        "endTime": 3375,
        "formattedTime": "55:54",
        "text": "Enterprise customers are ready for the announcement.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-162",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 3375,
        "endTime": 3396,
        "formattedTime": "56:15",
        "text": "Thank you all for an incredible sixty minutes. Let's execute the Thursday deployment with precision. Have a great rest of your day!",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-163",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 3396,
        "endTime": 3417,
        "formattedTime": "56:36",
        "text": "Thanks everyone. Have a great day.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-164",
        "speakerId": "spk-2",
        "speakerName": "Dr. Maya Lin",
        "startTime": 3417,
        "endTime": 3438,
        "formattedTime": "56:57",
        "text": "Thanks all! Bye.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-165",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 3438,
        "endTime": 3459,
        "formattedTime": "57:18",
        "text": "Goodbye everyone!",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-166",
        "speakerId": "spk-5",
        "speakerName": "David Kalu",
        "startTime": 3459,
        "endTime": 3480,
        "formattedTime": "57:39",
        "text": "Take care folks.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-167",
        "speakerId": "spk-6",
        "speakerName": "Priya Sharma",
        "startTime": 3480,
        "endTime": 3501,
        "formattedTime": "58:00",
        "text": "Thanks everyone, goodbye.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-168",
        "speakerId": "spk-7",
        "speakerName": "Sam Chen",
        "startTime": 3501,
        "endTime": 3522,
        "formattedTime": "58:21",
        "text": "See you all tomorrow.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-169",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 3522,
        "endTime": 3543,
        "formattedTime": "58:42",
        "text": "Thank you! Bye.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-170",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 3543,
        "endTime": 3564,
        "formattedTime": "59:03",
        "text": "Meeting ended. Great session.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      },
      {
        "id": "seg-8p-171",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 3564,
        "endTime": 3585,
        "formattedTime": "59:24",
        "text": "Wrapping up call.",
        "highlighted": false,
        "topic": "Rollout Timeline & Sign-Offs"
      }
    ]
  },
  {
    "id": "meeting-prod-sync",
    "title": "Weekly Product & Design Sync \u2014 Fathom 3.0 Mobile Scrubber & Clip UX",
    "date": "October 9, 2026 \u2022 11:00 AM EST",
    "createdAt": "2026-10-09T11:00:00Z",
    "durationSeconds": 2700,
    "durationFormatted": "45m",
    "platform": "zoom",
    "category": "Product",
    "participants": [
      {
        "id": "spk-1",
        "name": "Alex Vance",
        "email": "alex.vance@fathom-team.internal",
        "role": "VP of Product (Host)",
        "avatar": "AV",
        "color": "#3B82F6"
      },
      {
        "id": "spk-4",
        "name": "Elena Rostova",
        "email": "elena.rostova@fathom-team.internal",
        "role": "Principal Product Designer",
        "avatar": "ER",
        "color": "#EC4899"
      },
      {
        "id": "spk-8",
        "name": "Zoe Washington",
        "email": "zoe.washington@fathom-team.internal",
        "role": "Director of Customer Operations",
        "avatar": "ZW",
        "color": "#EF4444"
      },
      {
        "id": "spk-3",
        "name": "Marcus Thorne",
        "email": "marcus.thorne@fathom-team.internal",
        "role": "Staff Backend & Infrastructure Lead",
        "avatar": "MT",
        "color": "#10B981"
      }
    ],
    "summary": {
      "overview": "Reviewed interactive prototypes for the Fathom 3.0 mobile video scrubber, haptic feedback on highlight selection, and seamless clip export to Slack and Notion. Approved design changes for iOS Safari touch target sizes.",
      "keyDecisions": [
        "Approved expanded 44px minimum touch targets on mobile scrubber handle.",
        "Integrated haptic pulses when scrubbing across AI smart highlights.",
        "Enabled one-tap clip sharing directly to linked Slack channels."
      ],
      "templates": {
        "executive-brief": {
          "title": "Executive Brief",
          "description": "High level brief of mobile scrubber initiative.",
          "sections": [
            {
              "title": "Key Updates",
              "items": [
                "Mobile touch interaction finalized for iOS Safari and Android Chrome.",
                "Clip export latency reduced to <800ms.",
                "Beta testing begins with 50 enterprise users on Monday."
              ]
            }
          ]
        },
        "engineering-arch": {
          "title": "Engineering & Architecture",
          "description": "Touch gestures and Canvas rendering architecture.",
          "sections": [
            {
              "title": "Performance Targets",
              "items": [
                "Scrubber rendering 60fps using HTML5 Canvas waveform overlay.",
                "Zero layout reflow during transcript auto-scroll."
              ]
            }
          ]
        },
        "sales-discovery": {
          "title": "Sales Impact",
          "description": "Mobile feature adoption among sales leaders.",
          "sections": [
            {
              "title": "Rep Feedback",
              "items": [
                "Field reps can review and share clips immediately after client calls from mobile."
              ]
            }
          ]
        },
        "one-on-one": {
          "title": "Design & Product Sync",
          "description": "Coordination between design and product.",
          "sections": [
            {
              "title": "Action Alignment",
              "items": [
                "Elena to deliver Figma spec for iPad split-screen view by Tuesday."
              ]
            }
          ]
        },
        "customer-success": {
          "title": "Customer Readiness",
          "description": "User rollout plan.",
          "sections": [
            {
              "title": "Documentation",
              "items": [
                "Support video explaining mobile scrubber controls to be recorded by Thursday."
              ]
            }
          ]
        }
      }
    },
    "actionItems": [
      {
        "id": "act-ps-01",
        "text": "Export finalized Figma tokens for mobile scrubber touch targets",
        "assigneeId": "spk-4",
        "assigneeName": "Elena Rostova",
        "dueDate": "Monday, Oct 12",
        "completed": true,
        "timestampSeconds": 920,
        "formattedTime": "15:20"
      },
      {
        "id": "act-ps-02",
        "text": "Implement HTML5 Canvas waveform renderer for mobile WebKit",
        "assigneeId": "spk-3",
        "assigneeName": "Marcus Thorne",
        "dueDate": "Wednesday, Oct 14",
        "completed": false,
        "timestampSeconds": 1450,
        "formattedTime": "24:10"
      }
    ],
    "highlights": [
      {
        "id": "hl-ps-01",
        "title": "Haptic Feedback on Highlights",
        "quote": "When the user drags the scrubber across an AI highlight, the subtle vibration makes the timeline feel tactile.",
        "speakerName": "Elena Rostova",
        "startTime": 720,
        "formattedTime": "12:00",
        "category": "insight"
      }
    ],
    "transcript": [
      {
        "id": "seg-ps-01",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 0,
        "endTime": 35,
        "formattedTime": "00:00",
        "text": "Welcome everyone. Let's look at the mobile scrubber designs Elena put together for Fathom 3.0."
      },
      {
        "id": "seg-ps-02",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 36,
        "endTime": 80,
        "formattedTime": "00:36",
        "text": "Thanks Alex. On smaller touchscreens, precise timeline scrubbing is traditionally painful. We created an adaptive zoom thumb that expands when held."
      },
      {
        "id": "seg-ps-03",
        "speakerId": "spk-3",
        "speakerName": "Marcus Thorne",
        "startTime": 81,
        "endTime": 125,
        "formattedTime": "01:21",
        "text": "From a frontend performance perspective, rendering the audio waveform on HTML5 canvas keeps the frame rate locked at 60 frames per second."
      },
      {
        "id": "seg-ps-04",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 126,
        "endTime": 170,
        "formattedTime": "02:06",
        "text": "Field sales reps will love this. Being able to quickly scrub to the budget objection and cut a 20-second clip on an iPhone in an Uber is game changing."
      },
      {
        "id": "seg-ps-05",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 171,
        "endTime": 220,
        "formattedTime": "02:51",
        "text": "When the user drags the scrubber across an AI highlight, the subtle vibration makes the timeline feel tactile. We tested it with 10 beta users and they loved it."
      },
      {
        "id": "seg-ps-06",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 221,
        "endTime": 270,
        "formattedTime": "03:41",
        "text": "Let's lock that in. Elena please export the tokens and Marcus can wire up the canvas prototype by Wednesday."
      }
    ]
  },
  {
    "id": "meeting-sales-acme",
    "title": "Enterprise Discovery Call \u2014 Acme Financial Tier-1 Rollout",
    "date": "October 8, 2026 \u2022 3:30 PM EST",
    "createdAt": "2026-10-08T15:30:00Z",
    "durationSeconds": 1800,
    "durationFormatted": "30m",
    "platform": "zoom",
    "category": "Sales",
    "participants": [
      {
        "id": "spk-8",
        "name": "Zoe Washington",
        "email": "zoe.washington@fathom-team.internal",
        "role": "Director of Customer Operations",
        "avatar": "ZW",
        "color": "#EF4444"
      },
      {
        "id": "spk-1",
        "name": "Alex Vance",
        "email": "alex.vance@fathom-team.internal",
        "role": "VP of Product (Host)",
        "avatar": "AV",
        "color": "#3B82F6"
      },
      {
        "id": "spk-acme-1",
        "name": "Sarah Jenkins",
        "email": "sarah.jenkins@acmefinancial.com",
        "role": "CTO, Acme Financial",
        "avatar": "SJ",
        "color": "#6366F1"
      }
    ],
    "summary": {
      "overview": "Initial discovery session with Sarah Jenkins, CTO of Acme Financial. Discussed enterprise deployment for 1,200 financial advisors with strict FINRA/SEC compliance requirements, custom vocabulary for financial jargon, and Salesforce integration.",
      "keyDecisions": [
        "Acme Financial confirmed a budget allocation of $180k ARR for 1,200 seats upon completion of security review.",
        "Agreed to custom financial vocabulary boosting for ticker symbols and regulatory terms.",
        "Target pilot kickoff set for November 1st."
      ],
      "templates": {
        "sales-discovery": {
          "title": "Sales Discovery (BANT Framework)",
          "description": "Standard qualification framework for enterprise sales opportunities.",
          "sections": [
            {
              "title": "Budget",
              "items": [
                "$180,000 ARR pre-approved in Q4 IT modernisation budget for 1,200 wealth management advisors."
              ]
            },
            {
              "title": "Authority",
              "items": [
                "Sarah Jenkins (CTO) is economic sponsor; final sign-off required from Chief Compliance Officer."
              ]
            },
            {
              "title": "Need",
              "items": [
                "Advisors spend 1.5 hours daily manually typing meeting summaries into Salesforce Financial Services Cloud.",
                "Must have automated compliance retention and FINRA record preservation."
              ]
            },
            {
              "title": "Timeline",
              "items": [
                "Security review to complete by Oct 24; 50-user pilot starting Nov 1; company-wide rollout Jan 2027."
              ]
            }
          ]
        },
        "executive-brief": {
          "title": "Executive Brief",
          "description": "Commercial summary.",
          "sections": [
            {
              "title": "Deal Overview",
              "items": [
                "Tier 1 Enterprise prospect: 1,200 seats, $180k ARR potential.",
                "Next milestone: Security review and SOC2 package delivery."
              ]
            }
          ]
        },
        "engineering-arch": {
          "title": "Engineering & Integrations",
          "description": "Technical requirements.",
          "sections": [
            {
              "title": "Custom Vocab",
              "items": [
                "Upload custom dictionary containing 400 financial tickers and wealth management terms."
              ]
            }
          ]
        },
        "one-on-one": {
          "title": "Account Ownership",
          "description": "Internal responsibilities.",
          "sections": [
            {
              "title": "Next Steps",
              "items": [
                "Zoe to deliver customized pilot agreement by Friday."
              ]
            }
          ]
        },
        "customer-success": {
          "title": "Pilot Onboarding",
          "description": "Implementation timeline.",
          "sections": [
            {
              "title": "Milestones",
              "items": [
                "November 1st pilot launch with 50 pilot advisors.",
                "Weekly check-in cadence with Acme IT project manager."
              ]
            }
          ]
        }
      }
    },
    "actionItems": [
      {
        "id": "act-ac-01",
        "text": "Send SOC2 Type II compliance package and FINRA compliance whitepaper to Sarah Jenkins",
        "assigneeId": "spk-8",
        "assigneeName": "Zoe Washington",
        "dueDate": "Friday, Oct 11",
        "completed": false,
        "timestampSeconds": 850,
        "formattedTime": "14:10"
      },
      {
        "id": "act-ac-02",
        "text": "Coordinate custom vocabulary dictionary upload with Acme IT team",
        "assigneeId": "spk-1",
        "assigneeName": "Alex Vance",
        "dueDate": "Tuesday, Oct 15",
        "completed": false,
        "timestampSeconds": 1340,
        "formattedTime": "22:20"
      }
    ],
    "highlights": [
      {
        "id": "hl-ac-01",
        "title": "$180k Budget Allocation Confirmed",
        "quote": "We have $180k approved in our Q4 budget specifically for meeting intelligence and Salesforce automation.",
        "speakerName": "Sarah Jenkins",
        "startTime": 540,
        "formattedTime": "09:00",
        "category": "milestone"
      }
    ],
    "transcript": [
      {
        "id": "seg-ac-01",
        "speakerId": "spk-8",
        "speakerName": "Zoe Washington",
        "startTime": 0,
        "endTime": 40,
        "formattedTime": "00:00",
        "text": "Hi Sarah, thank you for joining us today. We're excited to demonstrate Fathom's enterprise capabilities for Acme Financial."
      },
      {
        "id": "seg-ac-02",
        "speakerId": "spk-acme-1",
        "speakerName": "Sarah Jenkins",
        "startTime": 41,
        "endTime": 95,
        "formattedTime": "00:41",
        "text": "Thanks Zoe. Our 1,200 advisors currently spend almost 90 minutes each day documenting client conversations in Salesforce. We desperately need an automated solution."
      },
      {
        "id": "seg-ac-03",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 96,
        "endTime": 150,
        "formattedTime": "01:36",
        "text": "Our Salesforce integration syncs key takeaways, action items, and regulatory disclaimers into Salesforce Financial Services Cloud in under two minutes."
      },
      {
        "id": "seg-ac-04",
        "speakerId": "spk-acme-1",
        "speakerName": "Sarah Jenkins",
        "startTime": 151,
        "endTime": 210,
        "formattedTime": "02:31",
        "text": "We have $180k approved in our Q4 budget specifically for meeting intelligence and Salesforce automation, assuming your security credentials pass our CCO review."
      }
    ]
  },
  {
    "id": "meeting-one-on-one",
    "title": "1-on-1 Growth & Coaching Check-in \u2014 Alex & Elena",
    "date": "October 7, 2026 \u2022 10:00 AM EST",
    "createdAt": "2026-10-07T10:00:00Z",
    "durationSeconds": 1500,
    "durationFormatted": "25m",
    "platform": "google-meet",
    "category": "Design",
    "participants": [
      {
        "id": "spk-1",
        "name": "Alex Vance",
        "email": "alex.vance@fathom-team.internal",
        "role": "VP of Product (Host)",
        "avatar": "AV",
        "color": "#3B82F6"
      },
      {
        "id": "spk-4",
        "name": "Elena Rostova",
        "email": "elena.rostova@fathom-team.internal",
        "role": "Principal Product Designer",
        "avatar": "ER",
        "color": "#EC4899"
      }
    ],
    "summary": {
      "overview": "Bi-weekly design leadership check-in between Alex and Elena. Reviewed Elena's career progression toward Principal Design Director, team bandwidth, and design system unification across web and desktop.",
      "keyDecisions": [
        "Approved design system unification project for Q4 sprint.",
        "Agreed to sponsor Elena's keynote submission at Design Systems Summit 2027.",
        "Prioritised interactive clip preview components for next week's sprint."
      ],
      "templates": {
        "one-on-one": {
          "title": "1-on-1 Feedback & Growth",
          "description": "Structured coaching and mutual feedback framework.",
          "sections": [
            {
              "title": "Wins & Achievements",
              "items": [
                "Elena led the delivery of the Fathom 3.0 responsive workspace design on schedule with rave internal reviews."
              ]
            },
            {
              "title": "Growth Opportunities",
              "items": [
                "Mentoring junior product designers on accessibility guidelines and high-contrast design tokens."
              ]
            },
            {
              "title": "Support Needed",
              "items": [
                "Additional contract front-end engineer to build design system Figma plugin."
              ]
            }
          ]
        },
        "executive-brief": {
          "title": "Executive Brief",
          "description": "High level summary.",
          "sections": [
            {
              "title": "Key Items",
              "items": [
                "Design roadmap aligned with engineering delivery dates."
              ]
            }
          ]
        },
        "engineering-arch": {
          "title": "Design System Specs",
          "description": "Tokens and component contracts.",
          "sections": [
            {
              "title": "Tokens",
              "items": [
                "Tailwind CSS v4 variable mapping completed for core color palette."
              ]
            }
          ]
        },
        "sales-discovery": {
          "title": "N/A",
          "description": "Internal 1-on-1 sync.",
          "sections": [
            {
              "title": "Notes",
              "items": [
                "Internal meeting - standard 1-on-1 format applies."
              ]
            }
          ]
        },
        "customer-success": {
          "title": "N/A",
          "description": "Internal 1-on-1 sync.",
          "sections": [
            {
              "title": "Notes",
              "items": [
                "Internal meeting - standard 1-on-1 format applies."
              ]
            }
          ]
        }
      }
    },
    "actionItems": [
      {
        "id": "act-1on1-01",
        "text": "Submit conference abstract for Design Systems Summit 2027",
        "assigneeId": "spk-4",
        "assigneeName": "Elena Rostova",
        "dueDate": "Monday, Oct 19",
        "completed": false,
        "timestampSeconds": 750,
        "formattedTime": "12:30"
      }
    ],
    "highlights": [
      {
        "id": "hl-1on1-01",
        "title": "Design System Unification Approved",
        "quote": "Let's definitely dedicate 20% of design capacity in Q4 to unifiying the web and desktop design tokens.",
        "speakerName": "Alex Vance",
        "startTime": 420,
        "formattedTime": "07:00",
        "category": "decision"
      }
    ],
    "transcript": [
      {
        "id": "seg-1on1-01",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 0,
        "endTime": 30,
        "formattedTime": "00:00",
        "text": "Hey Elena, great to catch up today. How are you feeling after the big Fathom 3.0 review yesterday?"
      },
      {
        "id": "seg-1on1-02",
        "speakerId": "spk-4",
        "speakerName": "Elena Rostova",
        "startTime": 31,
        "endTime": 80,
        "formattedTime": "00:31",
        "text": "Feeling really energetic Alex. The feedback on the multi-column transcript workspace and instantaneous template switching was super validating."
      },
      {
        "id": "seg-1on1-03",
        "speakerId": "spk-1",
        "speakerName": "Alex Vance",
        "startTime": 81,
        "endTime": 130,
        "formattedTime": "01:21",
        "text": "Let's definitely dedicate 20% of design capacity in Q4 to unifiying the web and desktop design tokens. You've earned the autonomy to lead that initiative."
      }
    ]
  }
];

export function getMeetingById(id: string): Meeting | undefined {
  return INITIAL_MEETINGS.find((m) => m.id === id);
}
