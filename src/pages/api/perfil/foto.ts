import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const POST: APIRoute = async ({ cookies, request }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const contentType = request.headers.get("content-type") ?? "";
        const body = await request.arrayBuffer();

        const res = await fetch(`${BACKEND}/auth/perfil/foto`, {
        method: "POST",
        headers: {
            Cookie: `${COOKIE_NAME}=${token}`,
            Authorization: `Bearer ${token}`,
            "Content-Type": contentType, // incluye boundary
        },
        body,
        });

        const data = await res.json().catch(() => ({ error: "Respuesta inválida" }));
        return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
        });
    } catch (e) {
        console.error(e);
        return new Response(JSON.stringify({ error: "Error al subir la foto" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }
};