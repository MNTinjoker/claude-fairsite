-- One-time sign-up codes sent by SMS. Only the signup-otp edge function (service role) reads or writes this.
create table if not exists public.signup_otps (
  phone text primary key,            -- last 10 digits
  code_hash text not null,
  expires_at timestamptz not null,
  attempts int not null default 0,
  sent_at timestamptz not null default now()
);
alter table public.signup_otps enable row level security;  -- no policies: closed to anon/authenticated

-- Lets the edge function check whether a phone already has an account.
create or replace function public.auth_email_exists(p_email text)
returns boolean language sql security definer set search_path = public, auth as $$
  select exists (select 1 from auth.users where email = lower(p_email));
$$;
revoke all on function public.auth_email_exists(text) from public, anon, authenticated;
grant execute on function public.auth_email_exists(text) to service_role;
