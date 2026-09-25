import { defineMiddleware } from "astro:middleware";
import { isAuthenticatedSSR, getTokenSSR, obtenerRolDesdeToken } from "./utils/auth";

/**Rutas que requeieren sesion activa */
const RUTAS_PROTEGIDAS = [
    "/buscar",
    "/propiedad",
    "/mis-solicitudes",
    "/mantenimiento",
    "/admin",
    "/agente",
    "/constructora",
    "/superadmin", // ← añadir
    "/perfil",
];

/**Solo SuoerAdmin */
const RUTA_SUPERADMIN = ["/superadmin"];

/** Solo Administrador */
const RUTA_ADMINISTRADOR = ["/admin"];

/**Solo Agente*/
const RUTA_AGENTE = ["/agente"];

/**Solo Constructora */
const RUTA_CONSTRUCTORA = ["/constructora"];

/**Publicas */
const RUTAS_PUBLICAS = ["/", "/login", "/registro"];

function empiezaCon(path: string, rutas: string[]): boolean {
    return rutas.some((r) => path === r || path.startsWith(r + "/"));
}

export const onRequest = defineMiddleware(({url, cookies, redirect}, next) => {
    const path = url.pathname;
    const autenticado = isAuthenticatedSSR(cookies);
    const token = getTokenSSR(cookies);
    const rol = obtenerRolDesdeToken(token);

    const esProtegida = empiezaCon(path, RUTAS_PROTEGIDAS);
    const esSuperAdmin = empiezaCon(path, RUTA_SUPERADMIN)
    const esAdmin = empiezaCon(path, RUTA_ADMINISTRADOR);
    const esAgente = empiezaCon(path, RUTA_AGENTE);
    const esConstructora = empiezaCon(path, RUTA_CONSTRUCTORA);
    const esPublica = RUTAS_PUBLICAS.includes(path);

    //Sin sesion en ruta protegida
    if (esProtegida && !autenticado) {
        return redirect("/login");
    }

    //Solo SuperAdmin
    if (esSuperAdmin && rol !== "SuperAdmin") {
        return redirect(rutaHomePorRol(rol));
    }

    //Solo Administrador
    if (esAdmin && rol !== "Administrador") {
        return redirect(rutaHomePorRol(rol));
    }

    // Agente: solo Agente
    if (esAgente && rol !== "Agente") {
        return redirect(rutaHomePorRol(rol));
    }

    // Constructora: solo Constructora
    if (esConstructora && rol !== "Constructora") {
        return redirect(rutaHomePorRol(rol));
    }

    // Ya autenticado en login/registro/home → ir a su panel
    if (esPublica && autenticado) {
        return redirect(rutaHomePorRol(rol));
    }

  return next();
});

function rutaHomePorRol (rol: string | null): string {
    switch (rol) {
    case "Administrador":
        return "/admin"
    case "SuperAdmin":
      return "/superadmin";
    case "Agente":
      return "/agente";
    case "Constructora":
      return "/constructora";
    case "Usuario":
    default:
      return "/buscar";
  }
}
