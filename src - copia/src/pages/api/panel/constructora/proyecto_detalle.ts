import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const GET: APIRoute = async ({ cookies, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }

    const id = url.searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ error: "Falta id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await fetch(`${BACKEND}/panel/constructora/proyectos/${id}`, {
        headers: { Cookie: `${COOKIE_NAME}=${token}` },
        });
        const text = await res.text();
        try {
        const data = JSON.parse(text);
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
        } catch {
        return new Response(
            JSON.stringify({ error: "Backend no JSON", detail: text.slice(0, 200) }),
            { status: 502, headers: { "Content-Type": "application/json" } },
        );
        }
    } catch {
        return new Response(JSON.stringify({ error: "Backend no disponible" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
        });
    }
    };