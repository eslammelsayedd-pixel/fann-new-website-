-- STAGED ONLY. Review retention, permissions and existing schema before applying.
-- Private form submission. Contains contact details; review access/retention before apply.
create table if not exists public.fann_lead_receipts (
  submission_id uuid primary key,
  submission jsonb not null,
  created_at timestamptz not null default now(),
  event_name text not null default 'lead_created' check (event_name = 'lead_created')
);
alter table public.fann_lead_receipts enable row level security;
revoke all on public.fann_lead_receipts from anon, authenticated;
-- Server-only service_role credentials. No browser read/write policies.
grant insert, select on public.fann_lead_receipts to service_role;
