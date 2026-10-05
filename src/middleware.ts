import { defineMiddleware } from "astro:middleware";
import { isAuthenticatedSSR, getTokenSSR, obtenerRolDesdeToken } from "./utils/auth";

const RUTAS_PROTEGIDAS = [
  "/buscar", "/mis-solicitudes", "/mantenimiento", "/admin", "/agente",
  "/constructora", "/superadmin", "/perfil", "/inmobiliaria", "/usuario",
];

const RUTA_SUPERADMIN = ["/superadmin"];
const RUTA_ADMINISTRADOR = ["/admin"];
const RUTA_AGENTE = ["/agente"];
const RUTA_CONSTRUCTORA = ["/constructora"];
const RUTA_INMOBILIARIA = ["/inmobiliaria"];

function empiezaCon(path: string, rutas: string[]): boolean {
  return rutas.some((r) => path === r || path.startsWith(r + "/"));
}

function rutaHomePorRol(rol: string | null): string {
  switch (rol) {
    case "Administrador":
      return "/admin";
    case "SuperAdmin":
      return "/superadmin";
    case "Agente":
      return "/agente";
    case "Constructora":
      return "/constructora";
    case "Usuario":
      return "/";
    default:
      return "/";
  }
}

export const onRequest = defineMiddleware(({ url, cookies, redirect }, next) => {
  const path = url.pathname;
  const autenticado = isAuthenticatedSSR(cookies);
  const token = getTokenSSR(cookies);
  const rol = obtenerRolDesdeToken(token);

  const esProtegida = empiezaCon(path, RUTAS_PROTEGIDAS);
  const esSuperAdmin = empiezaCon(path, RUTA_SUPERADMIN);
  const esAdmin = empiezaCon(path, RUTA_ADMINISTRADOR);
  const esAgente = empiezaCon(path, RUTA_AGENTE);
  const esConstructora = empiezaCon(path, RUTA_CONSTRUCTORA);
  const esInmobiliaria = empiezaCon(path, RUTA_INMOBILIARIA);

  if (esProtegida && !autenticado) {
    return redirect(`/login/login?redirect=${encodeURIComponent(path)}`);
  }
  if (esSuperAdmin && rol !== "SuperAdmin") return redirect(rutaHomePorRol(rol));
  if (esAdmin && rol !== "Administrador") return redirect(rutaHomePorRol(rol));
  if (esAgente && rol !== "Agente") return redirect(rutaHomePorRol(rol));
  if (esConstructora && rol !== "Constructora") return redirect(rutaHomePorRol(rol));
  if (esInmobiliaria) {
    if (rol !== "Administrador" && rol !== "SuperAdmin") {
      return redirect(rutaHomePorRol(rol));
    }
    return redirect("/admin/servicios");
  }
  if (
    autenticado &&
    (path === "/login" || path === "/login/login" || path === "/registro")
  ) {
    return redirect(rutaHomePorRol(rol));
  }

  return next();
});