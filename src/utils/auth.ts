const COOKIE_NAME = "skyinit_token";

type CookieLike = {
    get: (key: string) => {value: string} | undefined;
};

/**¿Hay sesion activa? (existe cookie con token) */
export function isAuthenticatedSSR(cookies: CookieLike): boolean {
    return !!cookies.get(COOKIE_NAME)?.value;
}

/**Obtiene el Jwt desde la cokkie (SSR) */
export function getTokenSSR(cookies: CookieLike): string | null {
    return cookies.get(COOKIE_NAME)?.value ?? null;
}

/**Decodifica el payload, la firma la valida en backend, retorna el rol */
export function obtenerRolDesdeToken(token: string | null): string | null {
    if (!token) return null;

    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const payloadJson = atob (payloadBase64);
        const payload = JSON.parse(payloadJson) as {rol?: string};

        return payload.rol ?? null;
    } catch {
        return null;
    }
}

/**ID  de usuario (sub) desde el token, o null */
export function obtenerUsuarioIdDesdeToken(token: string | null): number | null {
    if (!token) return null;

    try {
        const parts = token.split(".");
        if (parts.length < 2) return null;

        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/-/g, "/");
        const payloadJson = atob (payloadBase64);
        const payload = JSON.parse(payloadJson) as {sub?: string};

        const id = Number(payload.sub);
        return Number.isFinite(id) ? id : null;
    } catch {
        return null;
    }
}

export {COOKIE_NAME};