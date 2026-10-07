import type { APIRoute } from "astro";

const BACKEND_URL = "http://localhost:8001/api/propiedades";

export const GET: APIRoute = async ({ request, url})=> {
    try {
        const cookieHeader = request.headers.get("cookie") || "";
        const queryString = url.search;

        const response = await fetch(`${BACKEND_URL}${queryString}`, {
            method: "GET",
            headers: {
                Cookie: cookieHeader,
                Accept: "application/json",
            },
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(
            JSON.stringify({ ok: false, message: "Error de conexión con el servidor backend." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const cookieHeader = request.headers.get("cookie") || "";
        const body = await request.text();

        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                Cookie: cookieHeader,
                "Content-Type": request.headers.get("content-type") || "application/json",
                Accept: "application/json",
            },
            body,
        });

        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(
            JSON.stringify({ ok: false, message: "Error de conexión al crear la propiedad." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};