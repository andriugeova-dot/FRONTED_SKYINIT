import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const DELETE: APIRoute = async ({ cookies, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }

    const id = url.searchParams.get("id");
    const imagenId = url.searchParams.get("imagenId");
    if (!id || !imagenId) {
        return new Response(JSON.stringify({ error: "Faltan id o imagenId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
        });
    }

    const res = await fetch(
        `${BACKEND}/panel/constructora/propiedades/${id}/imagenes/${imagenId}`,
        {
        method: "DELETE",
        headers: { Cookie: `${COOKIE_NAME}=${token}` },
        },
    );

    const text = await res.text();
    try {
        return new Response(JSON.stringify(JSON.parse(text)), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(JSON.stringify({ error: text.slice(0, 200) }), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
        });
    }
};