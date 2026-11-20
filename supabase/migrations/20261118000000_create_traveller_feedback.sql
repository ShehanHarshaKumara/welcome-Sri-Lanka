create table public.traveller_feedback (
  id uuid primary key,
  display_name text not null check (
    char_length(display_name) <= 60 and char_length(btrim(display_name, E' \t\r\n')) >= 1
  ),
  rating smallint not null check (rating between 1 and 5),
  message text not null check (
    char_length(message) <= 600 and char_length(btrim(message, E' \t\r\n')) >= 10
  ),
  created_at timestamptz not null default now()
);

create index traveller_feedback_recent_idx on public.traveller_feedback (created_at desc, id desc);

alter table public.traveller_feedback enable row level security;

revoke all on table public.traveller_feedback from public, anon, authenticated;
grant select on table public.traveller_feedback to anon, authenticated;
grant insert (id, display_name, rating, message) on table public.traveller_feedback to anon, authenticated;

create policy "Visitors can read traveller feedback"
  on public.traveller_feedback for select to anon, authenticated using (true);

create policy "Visitors can post traveller feedback"
  on public.traveller_feedback for insert to anon, authenticated with check (true);
