import type { APIRoute } from "astro";

const BACKEND_URL = "http://localhost:8001/api/inmobiliaria/solicitudes";

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const response = await fetch(`${BACKEND_URL}${url.search}`, {
      method: "GET",
      headers: {
        Cookie: request.headers.get("cookie") || "",
        Accept: "application/json",
      },
    });
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({
        ok: false,
        data: null,
        message: "Error de conexión con el servidor backend.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};