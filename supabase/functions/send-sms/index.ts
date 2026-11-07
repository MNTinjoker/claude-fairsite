// Supabase Auth "Send SMS" hook -> Kavenegar.
// Secrets (Supabase -> Edge Functions -> Secrets, never commit them):
//   KAVENEGAR_API_KEY, KAVENEGAR_SENDER, SEND_SMS_HOOK_SECRET (the "v1,whsec_..." value from the hook settings)
// Optional: KAVENEGAR_BASE_URL (default https://api.kavenegar.com/v1)
import { Webhook } from "https://esm.sh/standardwebhooks@1.0.0";

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// Supabase stores phones as E.164 without "+", e.g. 989121234567 -> Kavenegar wants 09121234567.
const toLocal = (p: string) => {
  const d = p.replace(/\D/g, "");
  return d.startsWith("98") ? "0" + d.slice(2) : d;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: { http_code: 405, message: "method not allowed" } });

  const apiKey = Deno.env.get("KAVENEGAR_API_KEY");
  const sender = Deno.env.get("KAVENEGAR_SENDER");
  const hookSecret = (Deno.env.get("SEND_SMS_HOOK_SECRET") ?? "").replace("v1,whsec_", "");
  if (!apiKey || !sender || !hookSecret) {
    console.error("missing secrets");
    return json(500, { error: { http_code: 500, message: "SMS server not configured" } });
  }

  // Only Supabase Auth (holder of the hook secret) may trigger an SMS.
  const payload = await req.text();
  let data: { user: { phone: string }; sms: { otp: string } };
  try {
    data = new Webhook(hookSecret).verify(payload, Object.fromEntries(req.headers)) as typeof data;
  } catch {
    return json(401, { error: { http_code: 401, message: "invalid signature" } });
  }

  const receptor = toLocal(data.user.phone);
  if (!/^09\d{9}$/.test(receptor)) {
    return json(400, { error: { http_code: 400, message: "only Iranian mobile numbers are supported" } });
  }

  const base = Deno.env.get("KAVENEGAR_BASE_URL") ?? "https://api.kavenegar.com/v1";
  const res = await fetch(`${base}/${apiKey}/sms/send.json`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ receptor, sender, message: `کد ورود شما: ${data.sms.otp}` }),
  });
  const out = await res.json().catch(() => null);
  if (!res.ok || out?.return?.status !== 200) {
    console.error("kavenegar error", res.status, out?.return); // never log the key or the OTP
    return json(502, { error: { http_code: 502, message: "SMS provider error" } });
  }
  return json(200, {});
});
