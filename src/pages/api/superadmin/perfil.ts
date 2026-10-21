import type { APIRoute } from "astro";

const BACKEND = "http://localhost:8001/superadmin/perfil";

async function reenviar(request: Request, method: string, body?: string): Promise<Response> {
  try {
    const res = await fetch(BACKEND, {
      method,
      headers: {
        Cookie: request.headers.get("cookie") || "",
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body,
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
      JSON.stringify({ success: false, error: "Error de conexión con el backend." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}

export const GET: APIRoute = ({ request }) => reenviar(request, "GET");
export const PUT: APIRoute = async ({ request }) => reenviar(request, "PUT", await request.text());