import type { APIRoute } from "astro";

const BACKEND = "http://localhost:8001/api/inmobiliaria/solicitudes";

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const body = await request.text();
    const res = await fetch(`${BACKEND}/${params.id}/estado`, {
      method: "PUT",
      headers: {
        Cookie: request.headers.get("cookie") || "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body,
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return new Response(
      JSON.stringify({ ok: false, message: "Error de conexión con el backend." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};