// Cliente mínimo para la API de tienda de Medusa (funciona en servidor y navegador).

export const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";
const CLAVE_PUBLICA = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "";

/** false mientras no se pegue la clave pública en .env.local */
export const medusaConfigurado = CLAVE_PUBLICA !== "";

export class ErrorMedusa extends Error {
  constructor(
    public status: number,
    mensaje: string,
  ) {
    super(mensaje);
  }
}

type Opciones = {
  method?: "GET" | "POST" | "DELETE";
  body?: unknown;
  query?: Record<string, string>;
};

export async function medusa<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const url = new URL(ruta, MEDUSA_URL);
  for (const [clave, valor] of Object.entries(opciones.query ?? {})) {
    url.searchParams.set(clave, valor);
  }

  const respuesta = await fetch(url, {
    method: opciones.method ?? "GET",
    headers: {
      "x-publishable-api-key": CLAVE_PUBLICA,
      ...(opciones.body ? { "content-type": "application/json" } : {}),
    },
    body: opciones.body ? JSON.stringify(opciones.body) : undefined,
    signal: AbortSignal.timeout(8000),
  });

  if (!respuesta.ok) {
    throw new ErrorMedusa(
      respuesta.status,
      `Medusa respondió ${respuesta.status} en ${ruta}`,
    );
  }
  return respuesta.json() as Promise<T>;
}

type Region = { id: string; countries?: { iso_2?: string }[] };
let regionChile: Promise<string> | null = null;

/** Id de la región Chile (precios en CLP). Se pide una sola vez por sesión. */
export function obtenerRegionChile(): Promise<string> {
  regionChile ??= medusa<{ regions: Region[] }>("/store/regions", {
    query: { fields: "id,countries.iso_2" },
  })
    .then(({ regions }) => {
      const chile = regions.find((r) =>
        r.countries?.some((p) => p.iso_2 === "cl"),
      );
      if (!chile) throw new Error("Medusa no tiene una región para Chile.");
      return chile.id;
    })
    .catch((error) => {
      regionChile = null; // permite reintentar más tarde
      throw error;
    });
  return regionChile;
}
