-- League + admin. Run once in Supabase → SQL Editor (safe to re-run).

alter table public.profiles add column if not exists is_admin boolean not null default false;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from profiles where user_id = auth.uid()), false);
$$;

-- League: every player's total and rank. Only name, org and points are exposed (no phone).
create or replace function public.get_leaderboard()
returns table (rank bigint, user_id uuid, name text, org text, total bigint, is_me boolean)
language sql stable security definer set search_path = public as $$
  select rank() over (order by coalesce(sum(s.points), 0) desc) as rank,
         p.user_id, p.name, p.org, coalesce(sum(s.points), 0) as total, p.user_id = auth.uid() as is_me
  from profiles p left join scores s on s.user_id = p.user_id
  where not p.is_admin
  group by p.user_id, p.name, p.org
  order by total desc, p.name;
$$;

-- Admin: users with contact details and totals.
create or replace function public.admin_list_users()
returns table (user_id uuid, name text, org text, phone text, role text, wants_demo boolean,
               total bigint, plays bigint, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'not allowed'; end if;
  return query
    select p.user_id, p.name, p.org, p.phone, p.role, p.wants_demo,
           coalesce(sum(s.points), 0)::bigint, count(s.*)::bigint, u.created_at
    from profiles p join auth.users u on u.id = p.user_id
    left join scores s on s.user_id = p.user_id
    where not p.is_admin
    group by p.user_id, u.created_at
    order by u.created_at desc;
end $$;

-- Admin: survey answers with the user's org and job.
create or replace function public.admin_survey()
returns table (user_id uuid, name text, org text, role text, answers jsonb, created_at timestamptz)
language plpgsql stable security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'not allowed'; end if;
  return query
    select r.user_id, p.name, p.org, p.role, r.answers, r.created_at
    from survey_responses r left join profiles p on p.user_id = r.user_id
    order by r.created_at desc;
end $$;

-- Admin: wipe a user's scores (and survey, so they can earn it again).
create or replace function public.admin_reset_score(p_user uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not is_admin() then raise exception 'not allowed'; end if;
  delete from scores where user_id = p_user;
  delete from survey_responses where user_id = p_user;
end $$;

-- Admin: delete the account entirely (profile, scores and survey cascade).
create or replace function public.admin_delete_user(p_user uuid)
returns void language plpgsql security definer set search_path = public, auth as $$
begin
  if not is_admin() then raise exception 'not allowed'; end if;
  if p_user = auth.uid() then raise exception 'cannot delete yourself'; end if;
  delete from auth.users where id = p_user;
end $$;

revoke all on function public.get_leaderboard(), public.admin_list_users(), public.admin_survey(),
  public.admin_reset_score(uuid), public.admin_delete_user(uuid), public.is_admin() from public, anon;
grant execute on function public.get_leaderboard(), public.admin_list_users(), public.admin_survey(),
  public.admin_reset_score(uuid), public.admin_delete_user(uuid), public.is_admin() to authenticated;

-- Make an account admin (log in once on the site first, then run with the account's phone number):
-- (the account id is u + last 10 digits of the phone, e.g. 0912 345 6789 → u9123456789@fair-login.app)
-- update public.profiles set is_admin = true
--   where user_id = (select id from auth.users where email = 'u9123456789@fair-login.app');
