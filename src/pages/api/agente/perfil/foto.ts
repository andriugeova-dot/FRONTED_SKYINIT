import type { APIRoute } from "astro";

const BACKEND = "http://localhost:8001/api/agente/panel/perfil/foto";

export const POST: APIRoute = async ({ request }) => {
  try {
    const contentType = request.headers.get("content-type") || "";
    const res = await fetch(BACKEND, {
      method: "POST",
      headers: {
        Cookie: request.headers.get("cookie") || "",
        Accept: "application/json",
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body: await request.arrayBuffer(),
    });
    const data = await res.json().catch(() => ({
      success: false,
      error: "Respuesta inválida del backend",
    }));
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: "Error de conexión al subir la foto." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};