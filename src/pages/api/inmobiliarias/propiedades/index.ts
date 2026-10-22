import type { APIRoute } from "astro";

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";
const URL_LISTADO = `${BACKEND}/api/propiedades/inmobiliaria/mis-propiedades`;
const URL_CREAR = `${BACKEND}/api/propiedades`; 
export const GET: APIRoute = async ({ request, url})=> {
    try {
        const cookieHeader = request.headers.get("cookie") || "";
        const queryString = url.search;

        const response = await fetch(`${URL_LISTADO}${queryString}`, {
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

        const response = await fetch(URL_CREAR, {
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