import type { Config } from "@netlify/functions";

const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbyhKiGC0ZzG2KpOc-TRoOih2qXUTsG2ckWi98Blyc1j0Fma_R0ec5QcAoysElUBvCo/exec";

export default async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders(),
    });
  }
  if (request.method !== "GET") {
    return json({ ok: false, error: "Método no permitido." }, 405);
  }

  try {
    const incoming = new URL(request.url);
    incoming.searchParams.delete("callback");
    incoming.searchParams.delete("_");
    const target = new URL(APPS_SCRIPT_URL);
    incoming.searchParams.forEach((value, key) => target.searchParams.set(key, value));

    const response = await fetch(target, {
      redirect: "follow",
      headers: { Accept: "application/json" },
    });
    const body = await response.text();
    if (!response.ok) throw new Error(`Google respondió ${response.status}`);
    JSON.parse(body);
    return new Response(body, {
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
