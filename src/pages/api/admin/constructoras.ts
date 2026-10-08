import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

function authHeaders(token: string) {
    return {
        Cookie: `${COOKIE_NAME}=${token}`,
        Authorization: `Bearer ${token}`,
    };
}

async function proxyJson(res: Response) {
    const text = await res.text();
    try {
        return new Response(JSON.stringify(JSON.parse(text)), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(
        JSON.stringify({ success: false, error: text.slice(0, 300) }),
        {
            status: res.status >= 400 ? res.status : 502,
            headers: { "Content-Type": "application/json" },
        },
        );
    }
}

export const GET: APIRoute = async ({ cookies, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }
    const id = url.searchParams.get("id");
    const path = id ? `/constructoras/${id}` : `/constructoras`;
    try {
        const res = await fetch(`${BACKEND}${path}`, { headers: authHeaders(token) });
        return proxyJson(res);
    } catch {
        return new Response(JSON.stringify({ error: "Backend no disponible" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
        });
    }
};

export const POST: APIRoute = async ({ cookies, request }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const body = await request.text();
        const res = await fetch(`${BACKEND}/constructoras`, {
        method: "POST",
        headers: { ...authHeaders(token), "Content-Type": "application/json" },
        body,
        });
        return proxyJson(res);
    } catch {
        return new Response(JSON.stringify({ error: "Backend no disponible" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
        });
    }
};

export const PUT: APIRoute = async ({ cookies, request, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }
    const id = url.searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ error: "Falta id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const body = await request.text();
        const res = await fetch(`${BACKEND}/constructoras/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(token), "Content-Type": "application/json" },
        body,
        });
        return proxyJson(res);
    } catch {
        return new Response(JSON.stringify({ error: "Backend no disponible" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
        });
    }
};

export const DELETE: APIRoute = async ({ cookies, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
        });
    }
    const id = url.searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ error: "Falta id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const res = await fetch(`${BACKEND}/constructoras/${id}`, {
        method: "DELETE",
        headers: authHeaders(token),
        });
        return proxyJson(res);
    } catch {
        return new Response(JSON.stringify({ error: "Backend no disponible" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
        });
    }
};