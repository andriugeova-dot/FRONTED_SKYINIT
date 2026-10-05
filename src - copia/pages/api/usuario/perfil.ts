import type { APIRoute } from "astro";
import { COOKIE_NAME, getTokenSSR } from "../../../utils/auth";

const BACKEND = "http://localhost:8001";

/** PUT /api/usuario/perfil — Actualiza nombre, teléfono y/o contraseña */
export const PUT: APIRoute = async ({ cookies, request }) => {
    const token = getTokenSSR(cookies);
    if (!token) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }

    let body: Record<string, string> = {};
    try {
        body = await request.json();
    } catch {
        return new Response(JSON.stringify({ error: "Body inválido" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    // Validaciones mínimas en el proxy
    if (!body.Nombre?.trim()) {
        return new Response(JSON.stringify({ error: "El nombre es obligatorio" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    if (body.PasswordNuevo && body.PasswordNuevo !== body.PasswordConfirmar) {
        return new Response(JSON.stringify({ error: "Las contraseñas no coinciden" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const res = await fetch(`${BACKEND}/auth/perfil`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Cookie: `${COOKIE_NAME}=${token}`,
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
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
