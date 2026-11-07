-- 0002_backend.sql
-- Extends 0001_init.sql. Backward compatible: submit_score(text,int) and submit_survey(jsonb)
-- keep their signatures, so the current frontend keeps working.

------------------------------------------------------------------------------
-- Admins & profiles
------------------------------------------------------------------------------
-- Add an admin from the SQL editor:  insert into admins(user_id) values ('<uuid>');
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.admins enable row level security;  -- no policies: invisible to API clients

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;

create table if not exists public.profiles (
  user_id      uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 30),
  created_at   timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "own profile" on public.profiles;
create policy "own profile" on public.profiles for select using (auth.uid() = user_id);

-- New users get a neutral public name (never the e-mail, since the leaderboard is public).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (user_id, display_name)
  values (new.id, 'کاربر ' || substr(replace(new.id::text, '-', ''), 1, 6))
  on conflict do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill users that signed up before this migration.
insert into public.profiles (user_id, display_name)
select id, 'کاربر ' || substr(replace(id::text, '-', ''), 1, 6) from auth.users
on conflict do nothing;

create or replace function public.set_display_name(p_name text) returns text
language plpgsql security definer set search_path = public as $$
declare v_name text := btrim(p_name);
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if char_length(v_name) not between 2 and 30 then raise exception 'name must be 2-30 characters'; end if;
  update profiles set display_name = v_name where user_id = auth.uid();
  return v_name;
end $$;

------------------------------------------------------------------------------
-- Activity catalog (replaces the hard-coded list inside submit_score)
------------------------------------------------------------------------------
create table if not exists public.activities (
  id          text primary key,                         -- game:wheel, tour:3, survey, ...
  kind        text not null check (kind in ('game', 'test', 'tour', 'survey')),
  title       text not null,
  points_min  int  not null check (points_min >= 0),
  points_max  int  not null check (points_max >= points_min),
  -- Anti-cheat: if > 0 the client must call start_activity() first and wait this long before submitting.
  min_seconds int  not null default 0 check (min_seconds >= 0),
  active      boolean not null default true
);

insert into public.activities (id, kind, title, points_min, points_max) values
  ('game:wheel',     'game',   'گردونه شانس', 10, 20),
  ('game:match3',    'game',   'بازی ۳ تایی', 10, 20),
  ('test:knowledge', 'test',   'تست دانش',    10, 20),
  ('survey',         'survey', 'نظرسنجی',     20, 20)
on conflict (id) do nothing;

insert into public.activities (id, kind, title, points_min, points_max)
select 'tour:' || n, 'tour', 'تور اپ ' || n, 10, 10 from generate_series(1, 9) n
on conflict (id) do nothing;

alter table public.activities enable row level security;
drop policy if exists "read activities" on public.activities;
create policy "read activities" on public.activities for select to anon, authenticated using (true);

------------------------------------------------------------------------------
-- Editable content: apps (tours) and survey questions
------------------------------------------------------------------------------
create table if not exists public.apps (
  id        int primary key check (id between 1 and 9),
  name      text not null,
  tour_url  text,                                       -- mp4/webm path or YouTube/Aparat embed URL
  sort      int not null default 0,
  active    boolean not null default true
);
insert into public.apps (id, name, sort)
select n, 'اپ ' || n, n from generate_series(1, 9) n
on conflict (id) do nothing;

create table if not exists public.survey_questions (
  id       serial primary key,
  position int  not null unique,
  question text not null,
  options  jsonb not null check (jsonb_typeof(options) = 'array' and jsonb_array_length(options) >= 2),
  active   boolean not null default true
);
insert into public.survey_questions (position, question, options)
select n, 'سوال ' || n || ' درباره اپ‌ها؟', '["گزینه ۱","گزینه ۲","گزینه ۳","گزینه ۴"]'::jsonb
from generate_series(1, 4) n
on conflict (position) do nothing;

alter table public.apps enable row level security;
alter table public.survey_questions enable row level security;
drop policy if exists "read apps" on public.apps;
create policy "read apps" on public.apps for select to anon, authenticated using (active);
drop policy if exists "read survey questions" on public.survey_questions;
create policy "read survey questions" on public.survey_questions for select to authenticated using (active);

------------------------------------------------------------------------------
-- Anti-cheat: server-side start timestamps
------------------------------------------------------------------------------
create table if not exists public.activity_starts (
  user_id     uuid not null references auth.users(id) on delete cascade,
  activity_id text not null references public.activities(id) on delete cascade,
  started_at  timestamptz not null default now(),
  primary key (user_id, activity_id)
);
alter table public.activity_starts enable row level security;  -- no policies: RPC only

-- Call when the user opens a game/test/tour. Keeps the FIRST start (replays can't reset the clock).
create or replace function public.start_activity(p_activity text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  if not exists (select 1 from activities where id = p_activity and active) then
    raise exception 'unknown activity %', p_activity;
  end if;
  insert into activity_starts (user_id, activity_id) values (auth.uid(), p_activity)
  on conflict do nothing;
end $$;

------------------------------------------------------------------------------
-- Scoring (same signature as before; now driven by the catalog)
------------------------------------------------------------------------------
create or replace function public.submit_score(p_activity text, p_percent int default null)
returns int
language plpgsql security definer set search_path = public as $$
declare
  v_uid    uuid := auth.uid();
  v_act    activities%rowtype;
  v_pct    int;
  v_points int;
  v_start  timestamptz;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;

  select * into v_act from activities where id = p_activity and active;
  if not found then raise exception 'unknown activity %', p_activity; end if;
  if v_act.kind = 'survey' then raise exception 'use submit_survey'; end if;

  -- Only the first play counts: if it already exists, return the stored points.
  select points into v_points from scores where user_id = v_uid and activity_id = p_activity;
  if found then return v_points; end if;

  if v_act.min_seconds > 0 then
    select started_at into v_start from activity_starts where user_id = v_uid and activity_id = p_activity;
    if v_start is null then raise exception 'activity not started'; end if;
    if now() - v_start < make_interval(secs => v_act.min_seconds) then
      raise exception 'finished too fast';
    end if;
  end if;

  if v_act.kind = 'tour' then
    v_points := v_act.points_min;
  else
    v_pct    := greatest(0, least(100, coalesce(p_percent, 0)));
    v_points := v_act.points_min + round(v_pct * (v_act.points_max - v_act.points_min) / 100.0)::int;
  end if;

  insert into scores (user_id, activity_id, percent, points)
  values (v_uid, p_activity, v_pct, v_points)
  on conflict (user_id, activity_id) do nothing;

  select points into v_points from scores where user_id = v_uid and activity_id = p_activity;
  return v_points;
end $$;

create or replace function public.submit_survey(p_answers jsonb)
returns int
language plpgsql security definer set search_path = public as $$
declare
  v_uid    uuid := auth.uid();
  v_points int;
  v_count  int;
begin
  if v_uid is null then raise exception 'not authenticated'; end if;
  select points_max into v_points from activities where id = 'survey' and active;
  if v_points is null then raise exception 'survey disabled'; end if;

  select count(*) into v_count from survey_questions where active;
  if jsonb_typeof(p_answers) <> 'array' or jsonb_array_length(p_answers) <> v_count then
    raise exception 'answers must be an array of % items', v_count;
  end if;

  insert into survey_responses (user_id, answers) values (v_uid, p_answers)
  on conflict (user_id) do nothing;
  insert into scores (user_id, activity_id, points) values (v_uid, 'survey', v_points)
  on conflict (user_id, activity_id) do nothing;
  return v_points;
end $$;

------------------------------------------------------------------------------
-- Leaderboard & my stats
------------------------------------------------------------------------------
create or replace function public.get_leaderboard(p_limit int default 20)
returns table (rank bigint, display_name text, total_points bigint, is_me boolean)
language sql stable security definer set search_path = public as $$
  with totals as (
    select s.user_id, sum(s.points) as total, min(s.created_at) as first_at
    from scores s group by s.user_id
  )
  select rank() over (order by t.total desc, t.first_at asc) as rank,
         p.display_name, t.total, (t.user_id = auth.uid()) as is_me
  from totals t join profiles p using (user_id)
  order by rank, p.display_name
  limit greatest(1, least(coalesce(p_limit, 20), 100));
$$;

create or replace function public.get_my_stats()
returns table (total_points bigint, rank bigint, players bigint, completed int, remaining int)
language sql stable security definer set search_path = public as $$
  with totals as (select user_id, sum(points) as total, min(created_at) as first_at from scores group by user_id),
       ranked as (select user_id, total, rank() over (order by total desc, first_at asc) as rk from totals)
  select coalesce((select total from ranked where user_id = auth.uid()), 0),
         (select rk from ranked where user_id = auth.uid()),
         (select count(*) from ranked),
         (select count(*)::int from scores where user_id = auth.uid()),
         (select count(*)::int from activities a where a.active
            and not exists (select 1 from scores s where s.user_id = auth.uid() and s.activity_id = a.id));
$$;

------------------------------------------------------------------------------
-- Admin
------------------------------------------------------------------------------
create or replace function public.admin_stats()
returns table (users bigint, active_players bigint, total_points bigint, survey_responses bigint, activity_id text, plays bigint, avg_percent numeric)
language plpgsql stable security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  return query
    select (select count(*) from auth.users),
           (select count(distinct user_id) from scores),
           (select coalesce(sum(points), 0) from scores),
           (select count(*) from survey_responses),
           a.id,
           count(s.user_id),
           round(avg(s.percent), 1)
    from activities a left join scores s on s.activity_id = a.id
    group by a.id order by a.id;
end $$;

-- Aggregated survey results: one row per (question, answer) with its count.
create or replace function public.admin_survey_results()
returns table (question text, answer text, votes bigint)
language plpgsql stable security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'forbidden'; end if;
  return query
    select e->>'q', e->>'a', count(*)
    from survey_responses r, jsonb_array_elements(r.answers) e
    group by 1, 2 order by 1, 3 desc;
end $$;

------------------------------------------------------------------------------
-- Grants
------------------------------------------------------------------------------
do $$
declare f text;
begin
  foreach f in array array[
    'is_admin()', 'set_display_name(text)', 'start_activity(text)', 'submit_score(text,int)',
    'submit_survey(jsonb)', 'get_leaderboard(int)', 'get_my_stats()', 'admin_stats()', 'admin_survey_results()'
  ] loop
    execute format('revoke all on function public.%s from public, anon', f);
    execute format('grant execute on function public.%s to authenticated', f);
  end loop;
end $$;
-- handle_new_user() is a trigger function; nobody should call it directly.
revoke all on function public.handle_new_user() from public, anon, authenticated;
