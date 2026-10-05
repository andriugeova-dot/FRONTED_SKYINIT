import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../../utils/auth";

const BACKEND = "http://localhost:8001";

/** DELETE /api/usuario/favoritos/:propiedadID */
export const DELETE: APIRoute = async ({ cookies, params }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    const { propiedadID } = params;
    if (!propiedadID) {
        return new Response(JSON.stringify({ error: "propiedadID es requerido" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await fetch(`${BACKEND}/usuario/favoritos/${propiedadID}`, {
            method: "DELETE",
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
