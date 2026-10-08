import type { APIRoute } from "astro";

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";

const json = (data: unknown, status: number) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

/** PUT: editar proyecto */
export const PUT: APIRoute = async ({ params, request }) => {
    try {
        const res = await fetch(`${BACKEND}/proyectos/${params.id}`, {
            method: "PUT",
            headers: {
                Cookie: request.headers.get("cookie") || "",
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: await request.text(),
        });
        return json(await res.json().catch(() => ({})), res.status);
    } catch {
        return json({ error: "Error de conexión al actualizar el proyecto" }, 502);
    }
};

/** DELETE: eliminar proyecto */
export const DELETE: APIRoute = async ({ params, request }) => {
    try {
        const res = await fetch(`${BACKEND}/proyectos/${params.id}`, {
            method: "DELETE",
            headers: {
                Cookie: request.headers.get("cookie") || "",
                Accept: "application/json",
            },
        });
        return json(await res.json().catch(() => ({})), res.status);
    } catch {
        return json({ error: "Error de conexión al eliminar el proyecto" }, 502);
    }
};