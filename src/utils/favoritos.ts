import {
  listarFavoritosRequest,
  agregarFavoritoRequest,
  quitarFavoritoRequest,
  type FavoritoItem,
} from "./apiUsuario";

export type ToggleFavoritoResult =
  | { ok: true; activo: boolean; mensaje?: string }
  | { ok: false; status: number; error: string; requiereLogin?: boolean };

/** Extrae propiedadID de un ítem de favoritos */
export function idPropiedadDesdeFavorito(f: FavoritoItem): number | null {
  const id = f.propiedad?.propiedadID ?? f.propiedadID;
  return id != null ? Number(id) : null;
}

/** Set de IDs favoritos del usuario logueado */
export async function obtenerIdsFavoritos(): Promise<Set<number>> {
  const data = await listarFavoritosRequest();
  const set = new Set<number>();
  if (data.error || !data.favoritos) return set;
  for (const f of data.favoritos) {
    const id = idPropiedadDesdeFavorito(f);
    if (id != null) set.add(id);
  }
  return set;
}

/** Alterna favorito */
export async function toggleFavorito(
  propiedadID: number,
  actualmenteActivo: boolean,
): Promise<ToggleFavoritoResult> {
  try {
    if (actualmenteActivo) {
      const res = await quitarFavoritoRequest(propiedadID);
      if ((res as { error?: string }).error) {
        return {
          ok: false,
          status: 400,
          error: (res as { error: string }).error,
        };
      }
      return { ok: true, activo: false, mensaje: "Eliminado de favoritos" };
    }

    const res = await agregarFavoritoRequest(propiedadID);
    // 409 = ya estaba → tratar como activo
    if ((res as { error?: string }).error) {
      const err = (res as { error: string }).error;
      if (err.toLowerCase().includes("ya está")) {
        return { ok: true, activo: true, mensaje: err };
      }
      return { ok: false, status: 400, error: err };
    }
    return { ok: true, activo: true, mensaje: "Guardado en favoritos" };
  } catch {
    return { ok: false, status: 500, error: "Error de conexión" };
  }
}

export function enlazarBotonesFavorito(opciones?: {
  root?: ParentNode;
  onRequiereLogin?: () => void;
  onChange?: (propiedadID: number, activo: boolean) => void;
}): void {
  const root = opciones?.root ?? document;
  root.querySelectorAll<HTMLElement>(".btn-favorito").forEach((btn) => {
    if (btn.dataset.favoritoBound) return;
    btn.dataset.favoritoBound = "1";

    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = Number(btn.getAttribute("data-id"));
      if (!id) return;

      const activo = btn.classList.contains("favorito-activo");
      btn.setAttribute("disabled", "true");

      const result = await toggleFavorito(id, activo);

      btn.removeAttribute("disabled");

      if (!result.ok) {
        if (result.requiereLogin || result.status === 401) {
          opciones?.onRequiereLogin?.();
        }
        return;
      }

      btn.classList.toggle("favorito-activo", result.activo);
      btn.classList.toggle("favorito-inactivo", !result.activo);
      btn.setAttribute("aria-pressed", String(result.activo));
      opciones?.onChange?.(id, result.activo);
    });
  });
}

/** Marca botones según el set de favoritos del usuario */
export function pintarEstadoFavoritos(
  ids: Set<number>,
  root: ParentNode = document,
): void {
  root.querySelectorAll<HTMLElement>(".btn-favorito").forEach((btn) => {
    const id = Number(btn.getAttribute("data-id"));
    const activo = ids.has(id);
    btn.classList.toggle("favorito-activo", activo);
    btn.classList.toggle("favorito-inactivo", !activo);
    btn.setAttribute("aria-pressed", String(activo));
  });
}