import type { APIRoute } from "astro";
import { COOKIE_NAME } from "../../../utils/auth";
import { obtenerRolDesdeToken } from "../../../utils/auth";

const RUTAS: Record<string, string> = {
  SuperAdmin:    "/superadmin",
  Administrador: "/admin",
  Agente:        "/agente",
  Constructora:  "/constructora",
  Usuario:       "/",   // el menú público es el home del usuario
};

export const GET: APIRoute = ({ url, cookies, redirect }) => {
  const token = url.searchParams.get("token");
  const nuevo = url.searchParams.get("nuevo") === "true";

  if (!token) return redirect("/login?error=token_invalido");

  // Setear la cookie HttpOnly desde Astro
  cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  if (nuevo) return redirect("/terminos?nuevo=true");

  const rol = obtenerRolDesdeToken(token);
  return redirect(RUTAS[rol ?? ""] ?? "/servicios");
};