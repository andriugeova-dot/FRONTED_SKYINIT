import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

/** GET /api/usuario/favoritos — Lista los favoritos del usuario */
export const GET: APIRoute = async ({ cookies }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await fetch(`${BACKEND}/usuario/favoritos`, {
            headers: {
                Cookie: `${COOKIE_NAME}=${token}`,
                Authorization: `Bearer ${token}`,
            },
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

/** POST /api/usuario/favoritos — Agrega una propiedad a favoritos */
export const POST: APIRoute = async ({ cookies, request }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    let body: Record<string, unknown> = {};
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Body inválido" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await fetch(`${BACKEND}/usuario/favoritos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${COOKIE_NAME}=${token}`,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
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
