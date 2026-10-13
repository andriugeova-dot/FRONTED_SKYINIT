import type { APIRoute } from "astro";

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";

export const GET: APIRoute = async ({ request }) => {
    try {
        const res = await fetch(`${BACKEND}/admin/dashboard`, {
            headers: {
                Cookie: request.headers.get("cookie") || "",
                Accept: "application/json",
            },
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type" : "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Error de conexion con el backend" }),
            { status: 502, headers: { "Content-Type" : "application/json" }},
        );
    }
};