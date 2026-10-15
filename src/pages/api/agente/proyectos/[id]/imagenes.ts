import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../../utils/auth";

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";
const json = (d: unknown, s: number) =>
    new Response(JSON.stringify(d), { status: s, headers: {"Content-Type" : "application/json" }});

export const POST: APIRoute = async ({ cookies, params, request }) => {
    const token = getTokenSSR(cookies);
    if (!token) return json({ error: "No autorizado"}, 401);
    try {
        const res = await fetch(`${BACKEND}/api/agente/panel/proyectos/${params.id}/imagenes`, {
            method: "POST",
            headers: { Cookie: `${COOKIE_NAME}=${token}`},
            body: await request.formData(),
        });
        return json(await res.json(), res.status);
    } catch  {
        return json({ error: "Error de servidor"}, 502);
    }
};

export const DELETE: APIRoute = async ({ cookies, params, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) return json({ error: "No autorizado" }, 401);
    const imagenId = url.searchParams.get("imagenId");
    if (!imagenId) return json({ error: "Falta imagenId" }, 400);
    try {
        const res = await fetch(`${BACKEND}/api/agente/panel/proyectos/${params.id}/imagenes/${imagenId}`, {
            method: "DELETE",
            headers: { Cookie: `${COOKIE_NAME}=${token}`},
        });
        return json(await res.json(), res.status);
    } catch  {
        return json({ error: "Error de servidor" }, 502);
    }
};