// Sign-up behind an SMS code (Kavenegar). Sign-in is unchanged and stays in the client.
//   POST { action: 'send', phone }                     → texts a 5-digit code
//   POST { action: 'verify', phone, code, name, meta } → creates the account if the code is right
// Secrets: KAVENEGAR_API_KEY, KAVENEGAR_SENDER (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are built in).
// Public sign-ups are turned off in Auth settings, so this is the only way to create an account.
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

// Same rules as the client: last 10 digits; name ignores case and ی/ک spelling.
const digits = (p: string) => String(p || '').replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d))).replace(/\D/g, '').slice(-10);
const canonName = (n: string) => String(n || '').replace(/\s+/g, ' ').trim().toLowerCase().replace(/[يى]/g, 'ی').replace(/ك/g, 'ک');
const sha = async (s: string) =>
  Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))))
    .map((b) => b.toString(16).padStart(2, '0')).join('');
const emailFor = (d: string) => `u${d}@fair-login.app`;

async function exists(d: string) {
  const { data } = await db.rpc('auth_email_exists', { p_email: emailFor(d) });
  return data === true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method' }, 405);
  const body = await req.json().catch(() => ({}));
  const d = digits(body.phone);
  if (d.length !== 10 || !d.startsWith('9')) return json({ error: 'bad_phone' }, 400);

  if (body.action === 'send') {
    if (await exists(d)) return json({ error: 'exists' }, 409);
    const { data: prev } = await db.from('signup_otps').select('sent_at').eq('phone', d).maybeSingle();
    if (prev && Date.now() - new Date(prev.sent_at).getTime() < 60_000) return json({ error: 'wait' }, 429);
    const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 90000 + 10000);
    await db.from('signup_otps').upsert({
      phone: d, code_hash: await sha(d + ':' + code), attempts: 0,
      sent_at: new Date().toISOString(), expires_at: new Date(Date.now() + 5 * 60_000).toISOString(),
    });
    const url = `https://api.kavenegar.com/v1/${Deno.env.get('KAVENEGAR_API_KEY')}/sms/send.json`;
    const form = new URLSearchParams({
      receptor: '0' + d, sender: Deno.env.get('KAVENEGAR_SENDER') || '',
      message: `کد تایید ثبت‌نام پارس گیم: ${code}`,
    });
    const r = await fetch(url, { method: 'POST', body: form }).then((x) => x.json()).catch(() => null);
    if (r?.return?.status !== 200) return json({ error: 'sms', detail: r?.return?.message }, 502);
    return json({ ok: true });
  }

  if (body.action === 'verify') {
    const { data: row } = await db.from('signup_otps').select('*').eq('phone', d).maybeSingle();
    if (!row || new Date(row.expires_at).getTime() < Date.now()) return json({ error: 'expired' }, 400);
    if (row.attempts >= 5) return json({ error: 'too_many' }, 429);
    if (row.code_hash !== await sha(d + ':' + String(body.code || '').replace(/[۰-۹]/g, (c: string) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(c))).trim())) {
      await db.from('signup_otps').update({ attempts: row.attempts + 1 }).eq('phone', d);
      return json({ error: 'wrong_code' }, 400);
    }
    const name = String(body.name || '').trim();
    if (!name) return json({ error: 'no_name' }, 400);
    const meta = typeof body.meta === 'object' && body.meta ? body.meta : {};
    const { error } = await db.auth.admin.createUser({
      email: emailFor(d), password: `${d}:${canonName(name)}`, email_confirm: true,
      user_metadata: { ...meta, name, phone: '0' + d },
    });
    if (error) return json({ error: /registered|exists/i.test(error.message) ? 'exists' : 'create', detail: error.message }, 400);
    await db.from('signup_otps').delete().eq('phone', d);
    return json({ ok: true });
  }
  return json({ error: 'action' }, 400);
});
