# Fair web app

Static site (HTML/JS) + Supabase.

1. Supabase → SQL Editor → run `supabase/schema.sql`.
2. Put your project URL + anon key in `config.js`.
3. Deploy the folder to any static host (Vercel, Netlify, GitHub Pages).

- Games/test: put code in `games/wheel`, `games/match3`, `games/quiz` (`index.html`). On finish call
  `parent.postMessage({ type: 'game-result', percent: 0-100 }, '*')`. Points = 10 + percent/10 (10..20).
- Tours: put videos in `tours/` and set `tour` for each app in `config.js`. Watching to the end = 10 points.
- Survey (4 questions, `config.js`) shows after the first finished segment = 20 points.
- Only the first play of each activity is stored (DB primary key + `on conflict do nothing`).
