import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND_URL = "http://localhost:8001/api/inmobiliaria/servicios/imagen";

export const POST: APIRoute = async ({ cookies, request }) => {
  const token = getTokenSSR(cookies);
  if (!token) {
    return new Response(JSON.stringify({ ok: false, message: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const contentType = request.headers.get("content-type") || "";
    const body = await request.arrayBuffer();

    const response = await fetch(BACKEND_URL, {
      method: "POST",
      headers: {
        Cookie: `${COOKIE_NAME}=${token}`,
        Accept: "application/json",
        "Content-Type": contentType,
      },
      body,
    });

    const text = await response.text();
    try {
      const data = JSON.parse(text);
      return new Response(JSON.stringify(data), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      return new Response(
        JSON.stringify({
          ok: false,
          message: "El backend no devolvió JSON al subir la imagen.",
          detail: text.slice(0, 400) || `HTTP ${response.status}`,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } },
      );
    }
  } catch (e) {
    return new Response(
      JSON.stringify({
        ok: false,
        message: "No se pudo conectar con Deno en el puerto 8001.",
        detail: e instanceof Error ? e.message : String(e),
      }),
      { status: 502, headers: { "Content-Type": "application/json" } },
    );
  }
};