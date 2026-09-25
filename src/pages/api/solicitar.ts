import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../utils/auth";

const BACKEND_URL = "http://localhost:8001";

// POST /api/servicios/solicitar -> reenvia al backend POST /api/servicios/solicitar
// Requiere sesion activa (igual que hace falta estar logueado para ver el boton "Solicitar").
export const POST: APIRoute = async ({ request, cookies }) => {
    const token = getTokenSSR(cookies);

    if (!token) {
        return new Response(
            JSON.stringify({ ok: false, message: "Debes iniciar sesion para solicitar un servicio." }),
            { status: 401, headers: { "Content-Type": "application/json" } },
        );
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return new Response(
            JSON.stringify({ ok: false, message: "Cuerpo de la solicitud invalido." }),
            { status: 400, headers: { "Content-Type": "application/json" } },
        );
    }

    try {
        const backendRes = await fetch(`${BACKEND_URL}/api/servicios/solicitar`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${COOKIE_NAME}=${token}`,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await backendRes.json();

        return new Response(JSON.stringify(data), {
            status: backendRes.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("[proxy /api/servicios/solicitar] Error al contactar el backend:", error);
        return new Response(
            JSON.stringify({ ok: false, message: "No se pudo conectar con el servidor." }),
            { status: 502, headers: { "Content-Type": "application/json" } },
        );
    }
};
