import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const GET: APIRoute = async ({ cookies }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }

    const res = await fetch(`${BACKEND}/superadmin/inmobiliarias`, {
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
};