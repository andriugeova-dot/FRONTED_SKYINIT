import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

export const GET: APIRoute = async ({ cookies, url }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Reenviar parámetros de filtro al backend
    const params = new URLSearchParams();
    const ciudad = url.searchParams.get("ciudad");
    const tipoOperacionID = url.searchParams.get("tipoOperacionID");
    const habitaciones = url.searchParams.get("habitaciones");
    const precioMax = url.searchParams.get("precioMax");
    const orden = url.searchParams.get("orden");

    if (ciudad) params.set("ciudad", ciudad);
    if (tipoOperacionID) params.set("tipoOperacionID", tipoOperacionID);
    if (habitaciones) params.set("habitaciones", habitaciones);
    if (precioMax) params.set("precioMax", precioMax);
    if (orden) params.set("orden", orden);

    const query = params.toString() ? `?${params.toString()}` : "";

    try {
        const res = await fetch(`${BACKEND}/propiedades${query}`, {
            headers: {
                Cookie: `${COOKIE_NAME}=${token}`,
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await res.json();
        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch {
        return new Response(JSON.stringify({ error: "Error al conectar con el servidor" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
};
