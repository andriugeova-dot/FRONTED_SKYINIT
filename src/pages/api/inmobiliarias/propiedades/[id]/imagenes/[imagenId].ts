import type { APIRoute } from "astro";

const BACKEND = "http://localhost:8001";

/** DELETE: eliminar una imagen de la propiedad */
export const DELETE: APIRoute = async ({ params, request }) => {
    const { id, imagenId } = params;
    try {
        const cookieHeader = request.headers.get("cookie") || "";

        const response = await fetch(
            `${BACKEND}/api/propiedades/${id}/imagenes/${imagenId}`,
            {
                method: "DELETE",
                headers: {
                    Cookie: cookieHeader,
                    Accept: "application/json",
                },
            },
        );

        const data = await response.json().catch(() => ({}));
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(
            JSON.stringify({ error: "Error de conexión al eliminar la imagen" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};