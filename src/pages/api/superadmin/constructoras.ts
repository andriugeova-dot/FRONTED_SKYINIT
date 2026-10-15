import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

function authHeaders(token: string) {
    return {
        Cookie: `${COOKIE_NAME}=${token}`,
        Authorization: `Bearer ${token}`,
    };
}

export const GET: APIRoute = async ({ cookies }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
    const res = await fetch(`${BACKEND}/superadmin/constructoras`, {
        headers: authHeaders(token),
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
};

export const POST: APIRoute = async ({ cookies, request }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
    const body = await request.text();
    const res = await fetch(`${BACKEND}/superadmin/constructoras`, {
        method: "POST",
        headers: { ...authHeaders(token), "Content-Type": "application/json" },
        body,
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
    });
};

export const PUT: APIRoute = async ({ cookies, request, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), { status: 401 });
    }
    const id = url.searchParams.get("id");
    if (!id) {
        return new Response(JSON.stringify({ error: "ID requerido" }), { status: 400 });
    }
    const body = await request.text();
    const res = await fetch(`${BACKEND}/superadmin/constructoras/${id}`, {
        method: "PUT",
        headers: { ...authHeaders(token), "Content-Type": "application/json" },
        body,
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        status: res.status,
        headers: { "Content-Type": "application/json" },
  });
};