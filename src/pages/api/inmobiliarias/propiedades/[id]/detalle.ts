import type { APIRoute } from "astro";

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";

export const GET: APIRoute = async ({ params, request }) => {
    try {
             const response = await fetch(`${BACKEND}/api/propiedades/${params.id}/detalle`, {
            headers: {
                Cookie: request.headers.get("cookie") || "",
                Accept: "application/json",
            },
        });

        const data = await response.json().catch(() => ({}));
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(
            JSON.stringify({ error: "Error de conexión al cargar el detalle" }),
            { status: 502, headers: { "Content-Type": "application/json" } },
        );
    }
};