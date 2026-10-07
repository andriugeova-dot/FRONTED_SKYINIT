import type { APIRoute } from 'astro';

const BACKEND = import.meta.env.BACKEND_URL ?? "http://localhost:8001";

const json = (data: unknown, status: number) =>
    new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

/** POST: crear proyecto */
export const POST: APIRoute = async ({ request }) => {
    try {
        const res = await fetch(`${BACKEND}/proyectos`, {
            method: "POST",
            headers: {
                Cookie: request.headers.get("cookie") || "",
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: await request.text(),
        });
        return json(await res.json().catch(() => ({})), res.status);
    } catch {
        return json({ error: "Error de conexión al crear el proyecto" }, 502);
    }
};