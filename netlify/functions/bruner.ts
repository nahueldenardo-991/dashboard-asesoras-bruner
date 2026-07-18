import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyhKiGC0ZzG2KpOc-TRoOih2qXUTsG2ckWi98Blyc1j0Fma_R0ec5QcAoysElUBvCo/exec";

export default async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  if (request.method === "POST") {
    try {
      const payload = await request.json();
      if (payload.action !== "setWorkingDays") return json({ ok: false, error: "Acción inválida." }, 400);
      const month = String(payload.month || "");
      const days = Number(payload.days);
      if (!/^\d{4}-\d{2}$/.test(month) || !Number.isInteger(days) || days < 1 || days > 31)
        return json({ ok: false, error: "Cantidad de días inválida." }, 400);
      const verify = new URL(APPS_SCRIPT_URL);
      verify.search = new URLSearchParams({ action: "adminDashboard", token: String(payload.token || ""), month }).toString();
      const auth = await fetch(verify).then((r) => r.json());
      if (!auth.ok) return json({ ok: false, error: "La sesión de supervisor venció." }, 401);
      await getStore({ name: "bruner-settings", consistency: "strong" }).setJSON("working-days/" + month, { days });
      return json({ ok: true, days });
    } catch {
      return json({ ok: false, error: "No se pudo guardar la cantidad de días." }, 500);
    }
  }
  if (request.method !== "GET") {
    return json({ ok: false, error: "Método no permitido." }, 405);
  }

  try {
    const incoming = new URL(request.url);
    incoming.searchParams.delete("callback");
    incoming.searchParams.delete("_");
    const action = incoming.searchParams.get("action") || "";
    const sharedStore = getStore({ name: "bruner-settings", consistency: "strong" });
    if (action === "partnerDashboard" && incoming.searchParams.get("refresh") !== "1") {
      const token = incoming.searchParams.get("token") || "";
      const month = incoming.searchParams.get("month") || "";
      const session = token ? await sharedStore.get("management-sessions/" + token, { type: "json" }) as { expiresAt?: number } | null : null;
      const cached = month && Number(session?.expiresAt) > Date.now()
        ? await sharedStore.get("management-dashboard/" + month, { type: "json" }) as { savedAt?: number; data?: Record<string, unknown> } | null
        : null;
      if (cached?.data && Date.now() - Number(cached.savedAt || 0) < 120000) {
        const setting = await sharedStore.get("working-days/" + month, { type: "json" }) as { days?: number } | null;
        return json({ ...cached.data, workingDaysOverride: setting?.days || 0 });
      }
    }
    const target = new URL(APPS_SCRIPT_URL);
    incoming.searchParams.forEach((value, key) => target.searchParams.set(key, value));

    const response = await fetch(target, {
      redirect: "follow",
      headers: { Accept: "application/json" },
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`Google respondió ${response.status}`);
    const parsed = JSON.parse(body);
    if (parsed.ok && action === "adminLogin" && parsed.token) {
      await sharedStore.setJSON("management-sessions/" + parsed.token, { expiresAt: Date.now() + 21600000 });
    }
    if (parsed.ok && action === "partnerDashboard" && parsed.month) {
      await sharedStore.setJSON("management-dashboard/" + parsed.month, { savedAt: Date.now(), data: parsed });
    }
    if (parsed.ok && ["myDashboard", "adminDashboard", "partnerDashboard"].includes(incoming.searchParams.get("action") || "")) {
      const month = String(parsed.month || incoming.searchParams.get("month") || "");
      const setting = month ? await getStore({ name: "bruner-settings", consistency: "strong" }).get("working-days/" + month, { type: "json" }) as { days?: number } | null : null;
      parsed.workingDaysOverride = setting?.days || 0;
    }
    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders(), "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error) {
    return json(
      { ok: false, error: "No se pudo consultar el backend de Bruner." },
      502,
    );
  }
};

export const config: Config = { path: "/api/bruner" };

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
  };
}

function json(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...corsHeaders(), "Content-Type": "application/json; charset=utf-8" },
  });
}
