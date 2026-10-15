import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

function authHeaders(token: string) {
    return {
        Cookie: `${COOKIE_NAME}=${token}`,
        Authorization: `Bearer ${token}`,
    };
}

async function safeJson(res: Response, fallback: object = {}) {
    const text = await res.text();
    if (!text || !text.trim()) return fallback;
    try {
        return JSON.parse(text);
    } catch {
        console.error("[inmobiliariasAdmin] Respuesta no-JSON:", text.slice(0, 300));
        return fallback;
    }
}

// GET /api/superadmin/inmobiliariasAdmin               → lista con usuarios asignados
// GET /api/superadmin/inmobiliariasAdmin?disponibles=1&inmobiliariaID=X
// GET /api/superadmin/inmobiliariasAdmin?lite=1        → solo id/nombre/ciudad
export const GET: APIRoute = async ({ cookies, url }) => {
    const token = getTokenSSR(cookies);
    if (!token)
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });

    const params = url.searchParams.toString();
    const path = params
        ? `/superadmin/inmobiliarias?${params}`
        : `/superadmin/inmobiliarias`;

    let res: Response;
    try {
        res = await fetch(`${BACKEND}${path}`, { headers: authHeaders(token) });
    } catch {
        return new Response(
            JSON.stringify({ success: false, data: [], message: "Backend no disponible" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    const data = await safeJson(res, { success: false, data: [] });
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
};

// POST /api/superadmin/inmobiliariasAdmin → crear
export const POST: APIRoute = async ({ cookies, request }) => {
    const token = getTokenSSR(cookies);
    if (!token)
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });

    const body = await request.text();
    let res: Response;
    try {
        res = await fetch(`${BACKEND}/superadmin/inmobiliarias`, {
            method: "POST",
            headers: { ...authHeaders(token), "Content-Type": "application/json" },
            body,
        });
    } catch {
        return new Response(
            JSON.stringify({ success: false, message: "Backend no disponible" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    const data = await safeJson(res, { success: false, message: "Sin respuesta" });
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
};

// PUT /api/superadmin/inmobiliariasAdmin?id=X → editar
export const PUT: APIRoute = async ({ cookies, request, url }) => {
    const token = getTokenSSR(cookies);
    if (!token)
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });

    const id = url.searchParams.get("id");
    if (!id)
        return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });

    const body = await request.text();
    let res: Response;
    try {
        res = await fetch(`${BACKEND}/superadmin/inmobiliarias/${id}`, {
            method: "PUT",
            headers: { ...authHeaders(token), "Content-Type": "application/json" },
            body,
        });
    } catch {
        return new Response(
            JSON.stringify({ success: false, message: "Backend no disponible" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    const data = await safeJson(res, { success: false, message: "Sin respuesta" });
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
};

// PATCH /api/superadmin/inmobiliariasAdmin?id=X → asignar/quitar usuarios
export const PATCH: APIRoute = async ({ cookies, request, url }) => {
    const token = getTokenSSR(cookies);
    if (!token)
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });

    const id = url.searchParams.get("id");
    if (!id)
        return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });

    const body = await request.text();
    let res: Response;
    try {
        res = await fetch(`${BACKEND}/superadmin/inmobiliarias/${id}/asignar`, {
            method: "PATCH",
            headers: { ...authHeaders(token), "Content-Type": "application/json" },
            body,
        });
    } catch {
        return new Response(
            JSON.stringify({ success: false, message: "Backend no disponible" }),
            { status: 503, headers: { "Content-Type": "application/json" } }
        );
    }

    const data = await safeJson(res, { success: false, message: "Sin respuesta" });
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
};
