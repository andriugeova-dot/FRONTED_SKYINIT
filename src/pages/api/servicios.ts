import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../utils/auth";

const BACKEND_URL = "http://localhost:8001";

// El catalogo de servicios es publico: no debe exigir sesion.
// Si hay token lo reenviamos igual (por si el backend algun dia lo usa
// para personalizar la respuesta), pero su ausencia ya no bloquea la peticion.
export const GET: APIRoute = async ({ cookies }) => {
    const token = getTokenSSR(cookies);

    const headers: Record<string, string> = {};
    if (token) {
        headers.Cookie = `${COOKIE_NAME}=${token}`;
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/servicios`, { headers });
        const data = await backendRes.json();

        return new Response(JSON.stringify(data), {
            status: backendRes.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("[proxy /api/servicios] Error al contactar el backend:", error);
        return new Response(
            JSON.stringify({ ok: false, message: "No se pudo conectar con el servidor." }),
            { status: 502, headers: { "Content-Type": "application/json" } },
        );
    }
};
