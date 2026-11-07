import { PGlite } from '@electric-sql/pglite';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const repo = process.argv[2] || fileURLToPath(new URL('../..', import.meta.url));
const db = new PGlite();
await db.exec(`
 create role anon nologin; create role authenticated nologin;
 create schema auth; create table auth.users(id uuid primary key default gen_random_uuid(), email text);
 create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('test.uid', true),'')::uuid $$;
 grant usage on schema auth to anon, authenticated; grant usage on schema public to anon, authenticated;
 insert into auth.users(email) values ('old@x.com');`);   // pre-existing user -> backfill
for (const f of ['0001_init.sql','0002_backend.sql']) await db.exec(fs.readFileSync(`${repo}/supabase/migrations/${f}`,'utf8'));
await db.exec(fs.readFileSync(`${repo}/supabase/migrations/0002_backend.sql`,'utf8')); // idempotent re-run
await db.exec('grant all on all tables in schema public to anon, authenticated');
let pass=0, fail=0;
const ok=(n,c,x='')=>{ c?pass++:fail++; console.log((c?'PASS':'FAIL'),n,c?'':x); };
const as=async(uid,sql,p)=>{ await db.exec(`reset role; select set_config('test.uid','${uid||''}',false); set role authenticated;`); return db.query(sql,p); };
const err=async(uid,sql,p)=>{ try{ await as(uid,sql,p); return null;}catch(e){return e.message;} };

const a=(await db.query(`insert into auth.users(email) values ('a@x.com') returning id`)).rows[0].id;
const b=(await db.query(`insert into auth.users(email) values ('b@x.com') returning id`)).rows[0].id;
const old=(await db.query(`select id from auth.users where email='old@x.com'`)).rows[0].id;
ok('profile trigger', (await db.query(`select count(*)::int c from profiles`)).rows[0].c===3);
ok('profile name hides email', (await db.query(`select display_name from profiles where user_id=$1`,[a])).rows[0].display_name.startsWith('کاربر '));

ok('wheel 0% =10', (await as(a,`select submit_score('game:wheel',0) p`)).rows[0].p===10);
ok('replay returns first', (await as(a,`select submit_score('game:wheel',100) p`)).rows[0].p===10);
ok('quiz 100% =20', (await as(a,`select submit_score('test:knowledge',100) p`)).rows[0].p===20);
ok('match3 55% =16', (await as(a,`select submit_score('game:match3',55) p`)).rows[0].p===16);
ok('tour =10', (await as(a,`select submit_score('tour:3') p`)).rows[0].p===10);
ok('percent clamp', (await as(b,`select submit_score('game:wheel',999) p`)).rows[0].p===20);
ok('unknown activity rejected', /unknown/.test(await err(a,`select submit_score('tour:10')`)||''));
ok('unauth rejected', /not authenticated/.test(await err('',`select submit_score('tour:1')`)||''));
ok('survey via submit_score blocked', /submit_survey/.test(await err(a,`select submit_score('survey')`)||''));
ok('survey wrong length', /array of 4/.test(await err(a,`select submit_survey('[]'::jsonb)`)||''));
const ans=JSON.stringify([1,2,3,4].map(i=>({q:'سوال '+i+' درباره اپ‌ها؟',a:'گزینه ۱'})));
ok('survey 20', (await as(a,`select submit_survey($1::jsonb) p`,[ans])).rows[0].p===20);
ok('survey once', (await as(a,`select count(*)::int c from survey_responses`)).rows[0].c===1);
ok('direct insert denied', !!(await err(a,`insert into scores(user_id,activity_id,points) values ('${a}','tour:9',999)`)));
ok('RLS own scores only', (await as(a,`select count(*)::int c from scores`)).rows[0].c===5);
ok('admins table hidden', !!(await err(a,`select * from admins`)) || (await as(a,`select * from admins`)).rows.length===0);

// anti-cheat
await db.exec(`reset role; update activities set min_seconds=60 where id='tour:5'`);
ok('needs start', /not started/.test(await err(a,`select submit_score('tour:5')`)||''));
await as(a,`select start_activity('tour:5')`);
ok('too fast', /too fast/.test(await err(a,`select submit_score('tour:5')`)||''));
await db.exec(`reset role; update activity_starts set started_at = now()-interval '61 seconds'`);
ok('after wait ok', (await as(a,`select submit_score('tour:5') p`)).rows[0].p===10);

// leaderboard
const lb=(await as(a,`select * from get_leaderboard(10)`)).rows;
ok('leaderboard order', lb.length===2 && Number(lb[0].total_points)>=Number(lb[1].total_points) && lb[0].is_me===true, JSON.stringify(lb));
ok('my stats', Number((await as(a,`select * from get_my_stats()`)).rows[0].rank)===1);
await db.exec('reset role; set role anon'); ok('anon cannot call rpc', /permission denied/.test(await db.query('select * from get_leaderboard()').then(()=>'',e=>e.message)));
ok('display name', (await as(a,`select set_display_name('  Ali  ') n`)).rows[0].n==='Ali');
ok('short name rejected', /2-30/.test(await err(a,`select set_display_name('x')`)||''));

// admin
ok('admin forbidden', /forbidden/.test(await err(a,`select * from admin_stats()`)||''));
await db.exec(`reset role; insert into admins values ('${a}')`);
const st=(await as(a,`select * from admin_stats()`)).rows;
ok('admin stats', st.length===13 && Number(st[0].users)===3, JSON.stringify(st[0]));
ok('survey results', (await as(a,`select * from admin_survey_results()`)).rows.length===4);
ok('public content readable', (await as(a,`select count(*)::int c from apps`)).rows[0].c===9 && (await as(a,`select count(*)::int c from survey_questions`)).rows[0].c===4);
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail?1:0);
