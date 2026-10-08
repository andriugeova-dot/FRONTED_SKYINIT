import type { APIRoute } from "astro";

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";

/** POST: SUBIR IMAGEN A UN PROYECTO */
export const POST: APIRoute = async ({ params, request }) => {
    try {
        const res = await fetch(`${BACKEND}/proyectos/${params.id}/imagenes`, {
            method: "POST",
            headers: { Cookie: request.headers.get("cookie") || "" },
            body: await request.formData(),
        });

        const data = await res.json().catch(() => ({}));
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Error de conexion al subir la imagen" }),
            { status: 502, headers: { "Content-Type": "application/json" }},
        );
    }
};