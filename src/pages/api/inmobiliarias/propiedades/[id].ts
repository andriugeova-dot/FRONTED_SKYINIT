import type { APIRoute } from "astro";

const BACKEND_URL = "http://localhost:8001/api/propiedades";

export const PUT: APIRoute = async ({ params, request }) => {
    const { id } = params;
    try {
        const cookieHeader = request.headers.get("cookie") || "";
        const body = await request.text();

        const response = await fetch(`${BACKEND_URL}/${id}`, {
            method: "PUT",
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
            JSON.stringify({ ok: false, message: "Error de conexión al actualizar la propiedad." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};

export const DELETE: APIRoute = async ({ params, request }) => {
    const { id } = params;
    try {
        const cookieHeader = request.headers.get("cookie") || "";

        const response = await fetch(`${BACKEND_URL}/${id}`, {
            method: "DELETE",
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
            JSON.stringify({ ok: false, message: "Error de conexión al eliminar la propiedad." }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};