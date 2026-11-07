# Fair web app

Static site (HTML/JS) + Supabase (Postgres, Auth, RLS, RPC) + one Edge Function for SMS sign-up.
The database and function match the "Pars Game" app deployed on `paydar.parspmi.ir`.

## Backend setup
1. Supabase → SQL Editor → run these files **in this order** (each is safe to re-run):
   `supabase/schema.sql`, `otp.sql`, `league_admin.sql`, `avatar.sql`, `reviews.sql`, `candy.sql`
2. Deploy the Edge Function `supabase/functions/signup-otp` with **JWT verification off**
   (the client calls it with only an `apikey` header).
3. Edge Functions → Secrets: `KAVENEGAR_API_KEY`, `KAVENEGAR_SENDER`.
4. Authentication → Sign In / Providers → Email: **turn off "Allow new users to sign up"**.
   Accounts are created only by `signup-otp` after an SMS code (phone `9123456789` → `u9123456789@fair-login.app`).
5. Put the project URL + anon key in `config.js`.
6. Make an admin after they sign up once:
   `update public.profiles set is_admin = true where user_id = (select id from auth.users where email = 'u9123456789@fair-login.app');`

## Data model
| Object | Purpose |
|---|---|
| `scores` | One row per (user, activity); only the first play counts |
| `survey_responses` | One survey per user |
| `profiles` | Name, org, phone, role, avatar, `is_admin` (kept in sync from auth metadata) |
| `game_reviews` | Saved review of a finished game |
| `signup_otps` | SMS codes (hashed); only the edge function can touch it |
| RPC `submit_score`, `submit_survey` | Server-side points; replays ignored |
| RPC `get_leaderboard`, `is_admin`, `admin_*` | League and admin tools |

Note: `supabase/functions/signup-otp` and the SQL files are the source of truth that was copied to
the live project's branch; keep them in sync with it.
