/**
 * Funciones adicionales de API para el menú de usuario.
 * Importar junto con api.ts donde se necesiten.
 */

const API_BASE = "/api";

// ─── Tipos ────────────────────────────────────────────────────

export type PropiedadItem = {
    propiedadID:       number;
    titulo:            string;
    descripcion?:      string | null;
    precio:            string;
    ciudad?:           string | null;
    estado?:           string;
    habitaciones?:     number | null;
    tipoOperacion?:    string;
    imagenes?:         string[];
    agenteNombre?:     string | null;
    constructoraNombre?: string | null;
};

export type PropiedadesResponse = {
    ok?:          boolean;
    propiedades?: PropiedadItem[];
    error?:       string;
};

export type FavoritoItem = {
    favoritoID?:   number;
    fechaAgregado?: string;
    propiedad?:    PropiedadItem;
    // Compatibilidad si el backend retorna plano
    propiedadID?:  number;
    titulo?:       string;
    precio?:       string;
    ciudad?:       string;
    imagenes?:     string[];
};

export type FavoritosResponse = {
    favoritos?: FavoritoItem[];
    error?:     string;
};

export type SolicitudItem = {
    solicitudID?:      number;
    nombreServicio?:   string;
    servicio?:         string;
    inmobiliaria?:     string;
    nombreInmobiliaria?: string;
    notas?:            string | null;
    estadoReparacion?: string;
    estado?:           string;
    fechaSolicitud?:   string;
};

export type SolicitudesResponse = {
    solicitudes?: SolicitudItem[];
    error?:       string;
};

export type ActualizarPerfilBody = {
    Nombre:          string;
    Telefono?:       string;
    PasswordActual?: string;
    PasswordNuevo?:  string;
};

export type ActualizarPerfilResponse = {
    mensaje?: string;
    error?:   string;
};

// ─── Peticiones ──────────────────────────────────────────────

/** Propiedades disponibles con filtros opcionales */
export async function obtenerPropiedadesUsuario(
    filtros: {
        ciudad?: string;
        tipoOperacionID?: string;
        habitaciones?: string;
        precioMax?: string;
        orden?: string;
    } = {},
): Promise<PropiedadesResponse> {
    const params = new URLSearchParams();
    if (filtros.ciudad)          params.set("ciudad",          filtros.ciudad);
    if (filtros.tipoOperacionID) params.set("tipoOperacionID", filtros.tipoOperacionID);
    if (filtros.habitaciones)    params.set("habitaciones",    filtros.habitaciones);
    if (filtros.precioMax)       params.set("precioMax",       filtros.precioMax);
    if (filtros.orden)           params.set("orden",           filtros.orden);

    const query = params.toString() ? `?${params.toString()}` : "";
    const res = await fetch(`${API_BASE}/usuario/propiedades${query}`, {
        credentials: "same-origin",
    });
    return res.json();
}

/** Lista de favoritos del usuario */
export async function obtenerFavoritosRequest(): Promise<FavoritosResponse> {
    const res = await fetch(`${API_BASE}/usuario/favoritos`, {
        credentials: "same-origin",
    });
    return res.json();
}

/** Agregar propiedad a favoritos */
export async function agregarFavoritoRequest(
    propiedadID: number,
): Promise<{ mensaje?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/usuario/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ propiedadID }),
    });
    return res.json();
}

/** Quitar propiedad de favoritos */
export async function quitarFavoritoRequest(
    propiedadID: number,
): Promise<{ mensaje?: string; error?: string }> {
    const res = await fetch(`${API_BASE}/usuario/favoritos/${propiedadID}`, {
        method: "DELETE",
        credentials: "same-origin",
    });
    return res.json();
}

/** Lista de solicitudes del usuario */
export async function obtenerSolicitudesRequest(): Promise<SolicitudesResponse> {
    const res = await fetch(`${API_BASE}/usuario/solicitudes`, {
        credentials: "same-origin",
    });
    return res.json();
}

/** Actualizar perfil del usuario */
export async function actualizarPerfilRequest(
    data: ActualizarPerfilBody,
): Promise<ActualizarPerfilResponse> {
    const res = await fetch(`${API_BASE}/usuario/perfil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(data),
    });
    return res.json();
}
