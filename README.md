# Fair web app

Static site (HTML/JS) + Supabase backend (Postgres, Auth, RLS, RPC).

## Setup
1. Supabase → SQL Editor → run, in order, every file in `supabase/migrations/` (`0001_init.sql`, `0002_backend.sql`). Both are idempotent.
   Or with the CLI: `supabase link --project-ref <ref> && supabase db push`.
2. Put your project URL + anon key in `config.js`.
3. Deploy the folder to any static host (Vercel, Netlify, GitHub Pages).
4. Make yourself admin: `insert into admins(user_id) values ('<your auth.users id>');`

## Backend overview
| Table | Purpose | Client access |
|---|---|---|
| `scores` | One row per (user, activity) – first play only | read own |
| `survey_responses` | One survey per user | read own |
| `profiles` | Public display name (auto-created on sign-up, never the e-mail) | read own |
| `activities` | Catalog: points range, `min_seconds` anti-cheat, on/off | read |
| `apps` | The 9 apps + tour URL (editable without redeploy) | read |
| `survey_questions` | Survey content (editable) | read (signed-in) |
| `activity_starts`, `admins` | Internal | none |

All writes go through `security definer` RPCs (signed-in users only):

| RPC | What it does |
|---|---|
| `submit_score(activity, percent)` | Points computed server-side from `activities`; replays return the stored value |
| `submit_survey(answers)` | Validates answer count, stores once, awards the survey points |
| `start_activity(activity)` | Records a start time. Enforced only when an activity has `min_seconds > 0` (default 0, so the current frontend works unchanged) |
| `set_display_name(name)` | 2–30 chars |
| `get_leaderboard(limit)` / `get_my_stats()` | Ranking (ties broken by who scored first) |
| `admin_stats()` / `admin_survey_results()` | Admins only |

Frontend usage: `await sb.rpc('get_leaderboard', { p_limit: 20 })`, `await sb.from('apps').select('*').order('sort')`.

## Tests
`cd supabase/tests && npm i @electric-sql/pglite && node migrations.test.mjs` runs both migrations on in-memory Postgres (stubbed `auth` schema) and checks scoring, RLS, anti-cheat, leaderboard and admin rules.

## Content
- Games/test: put code in `games/wheel`, `games/match3`, `games/quiz` (`index.html`). On finish call
  `parent.postMessage({ type: 'game-result', percent: 0-100 }, '*')`. Points = 10 + percent/10 (10..20).
- Tours: put videos in `tours/` and set `tour` in `config.js` (or `apps.tour_url` in the DB). Watching to the end = 10 points.
- Survey (4 questions) shows after the first finished segment = 20 points.
- Only the first play of each activity is stored (DB primary key + `on conflict do nothing`).
