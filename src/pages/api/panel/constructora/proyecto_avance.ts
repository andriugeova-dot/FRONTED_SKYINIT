import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const GET: APIRoute = async ({ cookies, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    const id = url.searchParams.get("id");
    const res = await fetch(`${BACKEND}/panel/constructora/proyectos/${id}/avances`, {
        headers: { Cookie: `${COOKIE_NAME}=${token}` },
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
};

export const POST: APIRoute = async ({ cookies, request, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    const id = url.searchParams.get("id");
    const body = await request.text();
    const res = await fetch(`${BACKEND}/panel/constructora/proyectos/${id}/avances`, {
        method: "POST",
        headers: {
        Cookie: `${COOKIE_NAME}=${token}`,
        "Content-Type": "application/json",
        },
        body,
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: { "Content-Type": "application/json" } });
};