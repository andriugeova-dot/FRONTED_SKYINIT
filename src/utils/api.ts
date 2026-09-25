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
    AceptoTerminos: boolean;
};

export type TerminosResponse = {
    terminos?: {
        version: string;
        fechaActualizacion: string;
        contenido: string;
    };
    error?: string;
};

/**Texto de terminos (publico) */
export async function obtenerTerminosRequest(): Promise<TerminosResponse> {
    const res = await fetch(`${API_BASE}/terminos`, {
        method: "GET",
        credentials: "same-origin",
    });
    return res.json();
}

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
      return "/buscar";
  }
}