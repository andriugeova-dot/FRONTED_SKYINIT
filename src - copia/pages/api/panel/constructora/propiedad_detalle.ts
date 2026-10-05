import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const GET: APIRoute = async ({ cookies, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
    const id = url.searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ error: "Falta id" }), { status: 400 });
    }
    const res = await fetch(`${BACKEND}/panel/constructora/propiedades/${id}`, {
        headers: { Cookie: `${COOKIE_NAME}=${token}` },
    });
    const text = await res.text();
    try {
        return new Response(JSON.stringify(JSON.parse(text)), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(JSON.stringify({ error: text.slice(0, 200) }), { status: 502 });
    }
    };