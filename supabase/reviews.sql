-- Review of a finished game (quiz answers, wheel placements), saved once per user and game.
create table if not exists public.game_reviews (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  activity_id text not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, activity_id)
);
alter table public.game_reviews enable row level security;
drop policy if exists "own reviews read" on public.game_reviews;
drop policy if exists "own reviews insert" on public.game_reviews;
create policy "own reviews read" on public.game_reviews for select using (auth.uid() = user_id);
create policy "own reviews insert" on public.game_reviews for insert with check (auth.uid() = user_id);
grant select, insert on public.game_reviews to authenticated;
