-- Avatar picked at sign-up (1..10, files assets/avatars/a{n}.webp). Run after league_admin.sql.
alter table public.profiles add column if not exists avatar int;

create or replace function public.sync_profile()
returns trigger language plpgsql security definer set search_path = public as $$
declare m jsonb := new.raw_user_meta_data;
begin
  if m ? 'name' then
    insert into profiles (user_id, name, org, phone, role, wants_demo, avatar, updated_at)
    values (new.id, m->>'name', m->>'org', m->>'phone', m->>'role', (m->>'wants_demo')::boolean,
            nullif(m->>'avatar', '')::int, now())
    on conflict (user_id) do update set
      name = excluded.name, org = excluded.org, phone = excluded.phone, role = excluded.role,
      wants_demo = excluded.wants_demo, avatar = coalesce(excluded.avatar, profiles.avatar), updated_at = now();
  end if;
  return new;
end $$;

drop function if exists public.get_leaderboard();
create function public.get_leaderboard()
returns table (rank bigint, user_id uuid, name text, org text, avatar int, total bigint, is_me boolean)
language sql stable security definer set search_path = public as $$
  select rank() over (order by coalesce(sum(s.points), 0) desc) as rank,
         p.user_id, p.name, p.org, p.avatar, coalesce(sum(s.points), 0) as total, p.user_id = auth.uid() as is_me
  from profiles p left join scores s on s.user_id = p.user_id
  where not p.is_admin
  group by p.user_id, p.name, p.org, p.avatar
  order by total desc, p.name;
$$;
revoke all on function public.get_leaderboard() from public, anon;
grant execute on function public.get_leaderboard() to authenticated;
