import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND_URL = "http://localhost:8001";

// Perfil publico de una inmobiliaria: no exige sesion (cualquiera puede
// consultar quien ofrece un servicio de mantenimiento).
export const GET: APIRoute = async ({ params, cookies }) => {
    const { id } = params;

    const token = getTokenSSR(cookies);
    const headers: Record<string, string> = {};
    if (token) {
        headers.Cookie = `${COOKIE_NAME}=${token}`;
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/inmobiliarias/${id}`, { headers });
        const data = await backendRes.json();

        return new Response(JSON.stringify(data), {
            status: backendRes.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("[proxy /api/inmobiliarias/:id] Error al contactar el backend:", error);
        return new Response(
            JSON.stringify({ ok: false, message: "No se pudo conectar con el servidor." }),
            { status: 502, headers: { "Content-Type": "application/json" } },
        );
    }
};
