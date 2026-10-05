import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const POST: APIRoute = async ({ cookies, request, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }

    const id = url.searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ error: "Falta id del proyecto" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const form = await request.formData();

        const res = await fetch(
        `${BACKEND}/panel/constructora/proyectos/${id}/imagenes`,
        {
            method: "POST",
            headers: {
            Cookie: `${COOKIE_NAME}=${token}`,
            },
            body: form,
        },
        );

        const text = await res.text();
        let data: unknown;
        try {
        data = JSON.parse(text);
        } catch {
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
        console.error("proyecto_imagen proxy:", e);
        return new Response(
        JSON.stringify({ error: "No se pudo conectar con el backend" }),
        { status: 502, headers: { "Content-Type": "application/json" } },
        );
    }
};