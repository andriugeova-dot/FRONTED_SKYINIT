import type { APIRoute } from "astro";

const BACKEND = "http://localhost:8001";

/** POST: subir imagen a una propiedad */
export const POST: APIRoute = async ({ params, request }) => {
    const { id } = params;
    try {
        const cookieHeader = request.headers.get("cookie") || "";
        const form = await request.formData();

        const response = await fetch(`${BACKEND}/api/propiedades/${id}/imagenes`, {
            method: "POST",
            headers: {
                Cookie: cookieHeader,
            },
            body: form,
        });

        const data = await response.json().catch(() => ({}));
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(
            JSON.stringify({ error: "Error de conexión al subir la imagen" }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
};