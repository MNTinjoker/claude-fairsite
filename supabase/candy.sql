-- Pars Candy: the game reports its raw score; the user gets score / 1000 points (rounded, capped at 100).
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
  elsif p_activity = 'game:candy' then
    v_points := least(100, round(greatest(0, coalesce(p_percent, 0)) / 1000.0)::int);
  else
    raise exception 'unknown activity %', p_activity;
  end if;

  insert into scores (user_id, activity_id, percent, points)
  values (v_uid, p_activity, v_pct, v_points)
  on conflict (user_id, activity_id) do nothing;

  select points into v_points from scores where user_id = v_uid and activity_id = p_activity;
  return v_points;
end $$;
