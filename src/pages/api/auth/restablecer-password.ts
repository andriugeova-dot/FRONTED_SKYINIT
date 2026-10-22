import type { APIRoute } from "astro";

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.text();
    const res = await fetch(`${BACKEND}/auth/restablecer-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
    const data = await res.text();
    return new Response(data, {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Error de conexión con el backend" }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
};