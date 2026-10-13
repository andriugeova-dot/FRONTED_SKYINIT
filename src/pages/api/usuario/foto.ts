import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

/** POST /api/usuario/foto — Sube/actualiza la foto de perfil del usuario */
export const POST: APIRoute = async ({ cookies, request }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Reenviar el FormData tal cual al backend Deno
    const form = await request.formData();

    try {
        const res = await fetch(`${BACKEND}/usuario/perfil/foto`, {
            method: "POST",
            headers: {
                Cookie: `${COOKIE_NAME}=${token}`,
                // NO poner Content-Type: el boundary lo genera fetch automáticamente
            },
            body: form,
        });

        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(JSON.stringify({ error: "Error al conectar con el servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
