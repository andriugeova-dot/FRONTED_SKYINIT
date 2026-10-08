import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const GET: APIRoute = async ({ cookies }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await fetch(`${BACKEND}/inmobiliarias`, {
        headers: {
            Cookie: `${COOKIE_NAME}=${token}`,
            Authorization: `Bearer ${token}`,
        },
        });
        const text = await res.text();
        try {
        return new Response(JSON.stringify(JSON.parse(text)), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
        } catch {
        return new Response(
            JSON.stringify({ error: text.slice(0, 200) }),
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