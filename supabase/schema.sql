-- Run this once in Supabase → SQL Editor

-- One row per (user, activity). Primary key = only the FIRST play is ever stored.
create table if not exists public.scores (
  user_id     uuid not null references auth.users(id) on delete cascade,
  activity_id text not null,           -- e.g. game:wheel, game:match3, test:knowledge, tour:1..9, survey
  percent     int,
  points      int  not null,
  created_at  timestamptz not null default now(),
  primary key (user_id, activity_id)
);

create table if not exists public.survey_responses (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  answers    jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.scores enable row level security;
alter table public.survey_responses enable row level security;

-- Users can only read their own rows. No direct insert/update: writes go through the functions below.
drop policy if exists "own scores" on public.scores;
create policy "own scores" on public.scores for select using (auth.uid() = user_id);
drop policy if exists "own survey" on public.survey_responses;
create policy "own survey" on public.survey_responses for select using (auth.uid() = user_id);

-- Record a play. Points are computed on the server:
--   tour:*            → 10
--   game:* / test:*   → 10..20 based on percent (0% = 10, 100% = 20)
-- Replays are ignored (on conflict do nothing). Returns the stored points for that activity.
create or replace function public.submit_score(p_activity text, p_percent int default null)
returns int
language plpgsql security definer set search_path = public as $$
declare
  v_uid uuid := auth.uid();
  v_pct int;
  v_points int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  if p_activity ~ '^tour:[1-9]$' then
    v_points := 10;
  elsif p_activity in ('game:wheel', 'game:match3', 'test:knowledge') then
    v_pct := greatest(0, least(100, coalesce(p_percent, 0)));
    v_points := 10 + round(v_pct / 10.0)::int;
  else
    raise exception 'unknown activity %', p_activity;
  end if;

  insert into scores (user_id, activity_id, percent, points)
  values (v_uid, p_activity, v_pct, v_points)
  on conflict (user_id, activity_id) do nothing;

  select points into v_points from scores where user_id = v_uid and activity_id = p_activity;
  return v_points;
end $$;

-- Survey: 20 points, once.
create or replace function public.submit_survey(p_answers jsonb)
returns int
language plpgsql security definer set search_path = public as $$
declare v_uid uuid := auth.uid();
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  insert into survey_responses (user_id, answers) values (v_uid, p_answers)
  on conflict (user_id) do nothing;
  insert into scores (user_id, activity_id, points) values (v_uid, 'survey', 20)
  on conflict (user_id, activity_id) do nothing;
  return 20;
end $$;

revoke all on function public.submit_score(text, int) from public, anon;
revoke all on function public.submit_survey(jsonb) from public, anon;
grant execute on function public.submit_score(text, int) to authenticated;
grant execute on function public.submit_survey(jsonb) to authenticated;

-- Profile answered at sign-up (name, organization, phone, role, wants a demo call).
-- The client stores it in auth user_metadata; this trigger keeps public.profiles in sync.
create table if not exists public.profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  name       text,
  org        text,
  phone      text,
  role       text,
  wants_demo boolean,
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using (auth.uid() = user_id);

create or replace function public.sync_profile()
returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := new.raw_user_meta_data;
begin
  if m ? 'name' then
    insert into profiles (user_id, name, org, phone, role, wants_demo, updated_at)
    values (new.id, m->>'name', m->>'org', m->>'phone', m->>'role', (m->>'wants_demo')::boolean, now())
    on conflict (user_id) do update set
      name = excluded.name, org = excluded.org, phone = excluded.phone,
      role = excluded.role, wants_demo = excluded.wants_demo, updated_at = now();
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_profile on auth.users;
create trigger on_auth_user_profile
  after insert or update of raw_user_meta_data on auth.users
  for each row execute function public.sync_profile();
