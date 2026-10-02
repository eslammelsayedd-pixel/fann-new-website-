# OpenAI conversion staging - October 2, 2026

Not approved for production deployment. No existing Google Ads, GTM, Meta or form delivery behavior is changed.

## Current findings
- No consent banner or CMP in the current source. Existing Google/Meta initialize directly.
- Privacy policy mentions Google/Meta and browser cookie controls, not OpenAI.
- Client success confirms Web3Forms acceptance or /api/lead email delivery. The server does not persist a durable lead record or return a durable submission ID.

## Staged behavior
- One local hook script near the top of the shared HTML head, including the quote route and navigation pages. ENABLED is false. It makes no OpenAI network request, does not initialize oaiq and emits no events, even if its consent hook is called.
- Future explicit visitor consent can be wired to fannOpenAIConversion.setConsent(true/false). There is no automatic or implied consent and no UI added by this PR.
- If a separately reviewed release enables it, SDK initialization queues consent(false) before init, then consent(true), and loads the supplied SDK once. Debug stays true as requested.
- Only the /api/lead response path can hand the hook persisted:true plus submissionId. It requires an opaque server-issued UUID. Existing success-only responses and Web3Forms responses emit nothing. The browser never creates a conversion ID or passes form fields to OpenAI.
- The lead_created event uses type:customer_action, event_id and opt_out:true. Per-page duplicate IDs are suppressed. Revoking consent stops further events.

## Release blockers
1. Owner decision on advanced matching and reviewed SDK privacy behavior. No matching arguments or manual personal information are staged. The SDK's automatic behavior has not been verified.
2. Reviewed affirmative-consent UI and privacy disclosure, including withdrawal. The hook alone is not a consent system.
3. Durable server persistence, issuing submissionId only after an actual committed record, with retries/idempotency and receipt-contract tests. Do not equate SMTP delivery or HTTP200 with persistence.
4. Review preview and enable flag, then explicit deployment approval. No production merge/deploy from this PR.

Tests: node scripts/test-openai-conversion.mjs. Tests use a fake document and no network. No test form submission or QA email is sent.

## Expanded staging
An OpenAI-only banner and a persistent settings button are staged. Existing Google/Meta loaders remain unchanged and the copy explicitly says they are not controlled by this setting. The privacy page contains a short staged disclosure; matching-approved wording must be finalized with the owner's decision before release.

SQL proposal: private public.fann_lead_receipts(submission_id uuid primary key, created_at timestamptz, event_name lead_created, submission jsonb). RLS enabled, anon/authenticated access revoked, service-role insert/select only. Includes a private JSON submission (sanitized form type/name/email/phone/company/message/details), so this is a durable form submission, not merely an event marker. No IP/referrer is stored. Personal fields are never sent to the pixel. Access and retention must be reviewed before applying. Retention proposal:30 days, implemented by a reviewed backend cleanup job before release. No migration or credentials have been applied.

Server persistence is separately disabled unless FANN_OPENAI_LEAD_RECEIPTS_ENABLED=true and FANN_LEADS_SUPABASE_URL plus FANN_LEADS_SUPABASE_SERVICE_KEY are configured. It returns persisted:true and submissionId only after a successful REST insert returns that exact ID. Persistence failure suppresses conversion but leaves current lead delivery intact. Browser Web3Forms bypass remains unmeasured; production path selection must be verified before activation.

WhatsApp custom event: only trusted, intentional clicks on HTTPS wa.me or api.whatsapp.com/send anchors, after consent. Uses a browser-generated click UUID (never a lead receipt), custom_event_name whatsapp_click, opt_out:true; no event on page view. Account label must remain WhatsApp click (not a lead). Account attribution30-day click/1-day view is outside this website PR.

Backend capability limit: source shows an existing Supabase project for private floor-plan storage, not a leads table. No authenticated Supabase dashboard/schema session was available in the inspected browser config. Migration stays a proposal, not a verified applied table.
