-- STAGED ONLY. Inspect actual schema and extension state before applying.
-- Contact details are private and expire after 30 days (hourly deletion).
begin;
create table if not exists public.fann_lead_receipts (
  submission_id uuid not null,
  request_hash text primary key check (request_hash ~ '^[0-9a-f]{64}$'),
  submission jsonb not null,
  created_at timestamptz not null default now(),
  event_name text not null default 'lead_created' check (event_name = 'lead_created')
);
alter table public.fann_lead_receipts enable row level security;
revoke all on public.fann_lead_receipts from public, anon, authenticated;
grant insert, select on public.fann_lead_receipts to service_role;
create index if not exists fann_lead_receipts_created_at_idx on public.fann_lead_receipts(created_at);
-- Cleanup is performed by authenticated Vercel Cron /api/lead-receipts-cleanup.
commit;
