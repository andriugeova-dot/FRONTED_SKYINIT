import type { APIRoute } from "astro";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    return new Response(JSON.stringify({ mensaje: "Proyecto creado" }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error al crear proyecto" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};