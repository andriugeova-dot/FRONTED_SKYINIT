import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const GET: APIRoute = async ({ cookies }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await fetch(`${BACKEND}/panel/constructora/proyectos`, {
        headers: { Cookie: `${COOKIE_NAME}=${token}` },
        });

        const text = await res.text();
        let data: unknown;
        try {
        data = JSON.parse(text);
        } catch {
        // Deno devolvió texto (ej. Internal Server Error)
        console.error("Backend no-JSON:", res.status, text.slice(0, 300));
        return new Response(
            JSON.stringify({
            success: false,
            error: "Error del backend",
            detail: text.slice(0, 200),
            }),
            {
            status: res.status >= 400 ? res.status : 502,
            headers: { "Content-Type": "application/json" },
            },
        );
        }

        return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error("No se pudo conectar a Deno:", e);
        return new Response(
        JSON.stringify({ error: "Backend no disponible (¿Deno en :8001?)" }),
        { status: 502, headers: { "Content-Type": "application/json" } },
        );
    }
};