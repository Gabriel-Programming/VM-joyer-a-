import { cacheLife } from "next/cache";
import { medusa, medusaConfigurado, obtenerRegionChile } from "./medusa";
import {
  productos as catalogoLocal,
  type Metal,
  type Producto,
} from "./productos";

type ProductoMedusa = {
  handle: string;
  title: string;
  metadata: {
    metal?: Metal;
    imagen?: string;
    ancho?: number;
    alto?: number;
    alt?: string;
    destacado?: boolean;
  } | null;
  variants: { calculated_price?: { calculated_amount?: number } }[] | null;
};

// Se guarda en caché unos minutos: nombres, fotos y precios cambian poco.
// El stock NO pasa por aquí: la ficha lo pide en vivo desde el navegador.
// Devuelve null si Medusa no responde (un error lanzado aquí rompería el
// prerenderizado); ese null se vuelve a intentar al minuto.
async function catalogoMedusa(): Promise<Producto[] | null> {
  "use cache";
  cacheLife("minutes");

  let products: ProductoMedusa[];
  try {
    const region_id = await obtenerRegionChile();
    ({ products } = await medusa<{ products: ProductoMedusa[] }>(
      "/store/products",
      {
        query: {
          region_id,
          limit: "100",
          fields: "handle,title,metadata,*variants.calculated_price",
        },
      },
    ));
  } catch (error) {
    console.warn(
      "[catálogo] Medusa no respondió; se muestra el catálogo de respaldo.",
      error instanceof Error ? error.message : error,
    );
    return null;
  }

  const orden = (slug: string) => {
    const i = catalogoLocal.findIndex((p) => p.slug === slug);
    return i === -1 ? Number.MAX_SAFE_INTEGER : i;
  };

  return products
    .filter((p) => p.metadata?.imagen && p.metadata.metal)
    .map((p) => ({
      slug: p.handle,
      nombre: p.title,
      metal: p.metadata!.metal!,
      precio: p.variants?.[0]?.calculated_price?.calculated_amount ?? 0,
      imagen: p.metadata!.imagen!,
      ancho: p.metadata!.ancho ?? 1000,
      alto: p.metadata!.alto ?? 1000,
      alt: p.metadata!.alt ?? p.title,
      destacado: p.metadata!.destacado === true,
    }))
    .sort((a, b) => orden(a.slug) - orden(b.slug));
}

/** Catálogo desde Medusa; si no responde, el catálogo de respaldo local. */
export async function obtenerCatalogo(): Promise<Producto[]> {
  if (!medusaConfigurado) return catalogoLocal;
  const productos = await catalogoMedusa();
  return productos && productos.length > 0 ? productos : catalogoLocal;
}

export async function obtenerProducto(slug: string) {
  return (await obtenerCatalogo()).find((p) => p.slug === slug);
}
