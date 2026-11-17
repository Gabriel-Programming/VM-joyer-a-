"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ErrorMedusa, medusa, medusaConfigurado, obtenerRegionChile } from "@/lib/medusa";

export type LineaCarrito = {
  id: string;
  titulo: string;
  talla: string;
  slug: string;
  /** Ruta local de la foto (ej. /joyas/plata-m17.jpg) o null */
  imagen: string | null;
  precio: number;
  cantidad: number;
};

export type Carrito = { id: string; lineas: LineaCarrito[]; total: number };

type CarritoMedusa = {
  id: string;
  total: number;
  completed_at: string | null;
  items?: {
    id: string;
    product_title: string;
    variant_title: string;
    product_handle: string;
    thumbnail: string | null;
    unit_price: number;
    quantity: number;
  }[];
};

type Contexto = {
  carrito: Carrito | null;
  /** Número de piezas en el carrito */
  cantidad: number;
  /** true cuando ya se intentó recuperar el carrito guardado */
  listo: boolean;
  agregar: (variantId: string) => Promise<void>;
  quitar: (lineaId: string) => Promise<void>;
};

const CLAVE = "vm-carrito";
const ContextoCarrito = createContext<Contexto | null>(null);

function rutaLocal(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).pathname;
  } catch {
    return url.startsWith("/") ? url : null;
  }
}

function convertir(c: CarritoMedusa): Carrito {
  return {
    id: c.id,
    total: c.total,
    lineas: (c.items ?? []).map((i) => ({
      id: i.id,
      titulo: i.product_title,
      talla: i.variant_title,
      slug: i.product_handle,
      imagen: rutaLocal(i.thumbnail),
      precio: i.unit_price,
      cantidad: i.quantity,
    })),
  };
}

function idGuardado(): string | null {
  try {
    return window.localStorage.getItem(CLAVE);
  } catch {
    return null;
  }
}

function guardarId(id: string | null) {
  try {
    if (id) window.localStorage.setItem(CLAVE, id);
    else window.localStorage.removeItem(CLAVE);
  } catch {
    // Sin almacenamiento: el carrito dura mientras la pestaña esté abierta.
  }
}

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [carrito, setCarrito] = useState<Carrito | null>(null);
  const [listo, setListo] = useState(false);

  // Recupera el carrito de una visita anterior.
  useEffect(() => {
    let vigente = true;
    (async () => {
      const id = medusaConfigurado ? idGuardado() : null;
      if (id) {
        try {
          const { cart } = await medusa<{ cart: CarritoMedusa }>(
            `/store/carts/${id}`,
          );
          if (cart.completed_at) guardarId(null);
          else if (vigente) setCarrito(convertir(cart));
        } catch (error) {
          // 404: el carrito ya no existe. Otros errores: Medusa caído, se conserva el id.
          if (error instanceof ErrorMedusa && error.status === 404) {
            guardarId(null);
          }
        }
      }
      if (vigente) setListo(true);
    })();
    return () => {
      vigente = false;
    };
  }, []);

  const agregar = useCallback(
    async (variantId: string) => {
      let id = carrito?.id ?? idGuardado();
      if (!id) {
        const region_id = await obtenerRegionChile();
        const { cart } = await medusa<{ cart: CarritoMedusa }>("/store/carts", {
          method: "POST",
          body: { region_id },
        });
        id = cart.id;
        guardarId(id);
      }
      const { cart } = await medusa<{ cart: CarritoMedusa }>(
        `/store/carts/${id}/line-items`,
        { method: "POST", body: { variant_id: variantId, quantity: 1 } },
      );
      setCarrito(convertir(cart));
    },
    [carrito?.id],
  );

  const quitar = useCallback(
    async (lineaId: string) => {
      if (!carrito) return;
      const { parent } = await medusa<{ parent: CarritoMedusa }>(
        `/store/carts/${carrito.id}/line-items/${lineaId}`,
        { method: "DELETE" },
      );
      setCarrito(convertir(parent));
    },
    [carrito],
  );

  const valor = useMemo<Contexto>(
    () => ({
      carrito,
      cantidad: carrito?.lineas.reduce((n, l) => n + l.cantidad, 0) ?? 0,
      listo,
      agregar,
      quitar,
    }),
    [carrito, listo, agregar, quitar],
  );

  return (
    <ContextoCarrito.Provider value={valor}>{children}</ContextoCarrito.Provider>
  );
}

export function useCarrito(): Contexto {
  const contexto = useContext(ContextoCarrito);
  if (!contexto) {
    throw new Error("useCarrito debe usarse dentro de <CarritoProvider>.");
  }
  return contexto;
}
