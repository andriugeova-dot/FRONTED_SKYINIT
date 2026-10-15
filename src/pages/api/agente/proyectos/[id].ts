import type { APIRoute } from "astro";

const BACKEND = "http://localhost:8001/api/agente/panel/proyectos";

export const GET: APIRoute = async ({ request, params }) => {
  try {
    const res = await fetch(`${BACKEND}/${params.id}`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
        Accept: "application/json",
      },
    });
    const data = await res.json();
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
};

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const res = await fetch(`${BACKEND}/${params.id}`, {
      method: "PUT",
      headers: {
        Cookie: request.headers.get("cookie") || "",
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: await request.text(),
    });
    const data = await res.json();
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
};