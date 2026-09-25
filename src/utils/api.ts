const API_BASE = "/api";

export type LoginBody = {
    Correo: string;
    Password: string;
};

export type RegistroBody = {
    Nombre: string;
    Correo: string;
    Password: string;
    Confirmar: string;
    Telefono?: string;
};

export type AuthUsuario = {
    usuarioID: number;
    nombre: string;
    correo: string;
    rol: string;
    fotoPerfil?: string | null;
};

export type AuthResponse = {
    success?: boolean;
    mensaje?: string;
    usuario?: AuthUsuario;
    error?: string;
}

/**Login POST /api/login */
export async function loginRequest(datos: LoginBody): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(datos),
        credentials: "same-origin",
    });
    return res.json();
}

/**Registro POST /api/registro */
export async function registroRequest(datos: RegistroBody): Promise<AuthResponse> {
    const res = await fetch (`${API_BASE}/registro`, {
        method: "POST",
        headers: {"Content-Type" : "application/json"},
        body: JSON.stringify(datos),
        credentials: "same-origin",
    });
    return res.json();
}

/**Logout POST /api/logout */
export async function logoutRequest(): Promise<{mensaje?: string; error?: string}> {
    const res = await fetch(`${API_BASE}/logout`, {
        method: "POST",
        credentials: "same-origin",
    });
    return res.json();
}

// ── Servicios de mantenimiento ──────────────────────────

export type ServicioMantenimiento = {
    servicioID: number;
    nombre: string;
    descripcion: string;
    precio: string;
    estado: string;
    imagen: string | null;
};

export type GrupoServiciosInmobiliaria = {
    inmobiliariaID: number | null;
    inmobiliaria: string;
    inmobiliariaLogo: string | null;
    servicios: ServicioMantenimiento[];
};

export type ServiciosResponse = {
    ok: boolean;
    data?: GrupoServiciosInmobiliaria[];
    message?: string;
};

export type SolicitudServicioBody = {
    servicioId: number;
    notas?: string;
    propiedadID?: number;
};

export type SolicitudServicioResponse = {
    ok?: boolean;
    success?: boolean;
    message?: string;
    error?: string;
};

/** Catalogo de servicios de mantenimiento, agrupado por inmobiliaria. GET /api/servicios */
export async function obtenerServiciosRequest(): Promise<ServiciosResponse> {
    const res = await fetch(`${API_BASE}/servicios`, {
        credentials: "same-origin",
    });
    return res.json();
}

/** Solicitar un servicio de mantenimiento. POST /api/servicios/solicitar */
export async function solicitarServicioRequest(
    datos: SolicitudServicioBody
): Promise<SolicitudServicioResponse> {
    const res = await fetch(`${API_BASE}/servicios/solicitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
        credentials: "same-origin",
    });
    return res.json();
}

export function rutaPorRol(rol: string | null | undefined): string {
    switch (rol) {
    case "Administrador":
        return "/admin";
    case "SuperAdmin":
        return "/superadmin"
    case "Agente":
      return "/agente";
    case "Constructora":
      return "/constructora";
    case "Usuario":
    default:
      return "/servicios";
  }
}