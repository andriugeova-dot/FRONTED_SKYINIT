import type { APIRoute } from "astro";

const BACKEND_URL = "http://localhost:8001";

export const GET: APIRoute = async () => {
    try {
        const BackendRes = await fetch(`${BACKEND_URL}/terminos`);
        const data = await BackendRes.json();

        return new Response(JSON.stringify(data), {
            status: BackendRes.status,
            headers: {"Content-Type" : "application/json"},
        });
    } catch {
        return new Response(
            JSON.stringify({error: "Error al obtener los terminos"}),
            {status: 500, headers: {"Content-Type" : "application/json"}}
        );
    }
};