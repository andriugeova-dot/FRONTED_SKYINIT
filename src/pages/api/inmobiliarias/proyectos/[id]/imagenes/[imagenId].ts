import type { APIRoute } from "astro";

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";

/** DELETE ELIMINA IMAGEN DE UN PROYECTO */

export const DELETE: APIRoute = async ({ params, request }) => {
    try {
        const res = await fetch(`${BACKEND}/proyectos/${params.id}/imagenes/${params.imagenId}`, {
            method: "DELETE",
            headers: {
                Cookie: request.headers.get("cookie") || "",
                Accept: "application/json",
            },
        });

        const data = await res.json().catch(() => ({}));
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Error de conexion al eliminar una imagen" }),
            { status: 502, headers: { "Content-Type": "application/json" }},
        );
    }
};