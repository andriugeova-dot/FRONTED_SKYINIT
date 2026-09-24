import type { APIRoute } from "astro";
import { COOKIE_NAME } from "../../utils/auth";

const BACKEND_URL = "http://localhost:8001";
const TOKEN_MAX_AGE = 60 * 60; // 1 hora

export const POST: APIRoute = async ({request}) => {
    try {
        const body = await request.json();
        const {Correo, Password} = body;

        if (!Correo || !Password) {
            return new Response (
                JSON.stringify({error: "Correo y contraseña son obligatorios"}),
                {status: 400, headers: {"Content-Type" : "application/json"}}
            );
        }

        const backendRes = await fetch(`${BACKEND_URL}/auth/login`, {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body: JSON.stringify({Correo, Password}),
        });

        const data = await backendRes.json();

        if (!backendRes.ok) {
            return new Response (
                JSON.stringify({error: data.error || "Credenciales incorrectas"}),
                {
                    status: backendRes.status,
                    headers: {"Content-Type" : "application/json"},
                }
            );
        }

        //Token, el backend devuelve en usuario.token
        const token = data.usuario?.token ?? data.token;

        if (!token) {
            return new Response (
                JSON.stringify ({error: "No se recibio token del servidor"}),
                {status: 500, headers: {"Content-Type" : "application/json"}}
            );
        }
        
        const cookieHeader = [
            `${COOKIE_NAME}=${token}`,
            "HttpOnly",
            "SameSite=Lax",
            "Path=/",
            `Max-Age=${TOKEN_MAX_AGE}`,
        ].join("; ");

        //No devuelve el token en body al cliente, se queda en cookie Httponly
        const {token: _t, ...usuarioSinToken} = data.usuario ?? {};

        return new Response (
            JSON.stringify({
                success: true,
                mensaje: data.mensaje || "Inicio de sesion exitoso",
                usuario: usuarioSinToken,
            }),
            {
                status: 200,
                headers: {
                    "Content-Type" : "application/json",
                    "Set-Cookie": cookieHeader,
                },
            }
        );
    } catch {
        return new Response (
            JSON.stringify({error: "Error al conectar con el servidor"}),
            {status: 500, headers: {"Content-Type" : "appiclation/json"}}
        );
    }
};