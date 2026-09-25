import type { APIRoute } from "astro";
import { COOKIE_NAME } from "../../utils/auth";

const BACKEND_URL = "http://localhost:8001";
const TOKEN_MAX_AGE = 60 * 60 // 1 hora

export const POST: APIRoute = async ({request}) => {
    try {
        const body = await request.json();
        const {Nombre, Correo, Password, Confirmar, Telefono, AceptoTerminos} = body;

        if (!Nombre || !Correo || !Password || !Confirmar) {
            return new Response (
                JSON.stringify({error: "Todos los campos son obligatorios"}),
                {status: 400, headers: {"Content-Type" : "application/json"}}
            );
        }

        const backendRes = await fetch (`${BACKEND_URL}/auth/registro`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({Nombre, Correo, Password, Confirmar, Telefono: Telefono ?? null, AceptoTerminos})
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return new Response (
                JSON.stringify ({error: data.error || "No se pudo registrar"}),
                {
                    status: backendRes.status,
                    headers: {"Content-Type" : "application/json"},
                }
            );
        }

        // Backend hace login automático: puede venir token en data.usuario.token o en cookie del backend
        const token = data.usuario?.token ?? data.token;

        const headers: Record<string, string> = {
            "Content-Type" : "application/json",
        };

        if (token) {
            headers["Set-Cookie"] = [
                `${COOKIE_NAME}=${token}`,
                "HttpOnly",
                "SameSite=Lax",
                "Path=/",
                `Max-Age=${TOKEN_MAX_AGE}`,
            ].join("; ");
        }

        const usuario = data.usuario
        ? (({token: _t, ...rest}) => rest) (data.usuario) : undefined;

        return new Response (
            JSON.stringify ({
                success: true,
                mensaje: data.mensaje || "Usuario registrado correctamente",
                usuario,
            }),
            {status: 201, headers}
        );  
    } catch {
        return new Response (
            JSON.stringify ({error: "Error al conectar con el servidor"}),
            {status: 500, headers: {"Content-Type" : "application/json"}}
        );
    }
};