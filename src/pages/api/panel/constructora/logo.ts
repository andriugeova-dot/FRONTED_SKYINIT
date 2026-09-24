import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND = "http://localhost:8001";

    export const POST: APIRoute = async ({ cookies, request }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }

    // Reenviar el FormData tal cual a Deno
    const form = await request.formData();

    const res = await fetch(`${BACKEND}/panel/constructora/perfil/logo`, {
        method: "POST",
        headers: {
        Cookie: `${COOKIE_NAME}=${token}`,
        // NO pongas Content-Type: el boundary lo pone fetch solo
        },
        body: form,
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
};