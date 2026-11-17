"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MATERIAL, formatoPrecio, type Producto } from "@/lib/productos";
import { TALLA_MAX, TALLA_MIN, useTallaGuardada } from "@/lib/tallas";
import { WHATSAPP_TEXTO, WHATSAPP_URL } from "@/lib/contacto";
import { medusa, medusaConfigurado } from "@/lib/medusa";
import { useCarrito } from "./CarritoProvider";

const TALLAS = Array.from(
  { length: TALLA_MAX - TALLA_MIN + 1 },
  (_, i) => TALLA_MIN + i,
);

/** Variante de Medusa de cada talla: su id y las unidades listas en el taller. */
type Variantes = Record<number, { id: string; disponibles: number }>;
type EstadoStock = "cargando" | "ok" | "sin-conexion";

type RespuestaStock = {
  products: {
    variants: {
      id: string;
      inventory_quantity?: number;
      options: { value: string }[];
    }[];
  }[];
};

export default function FichaAnillo({ producto }: { producto: Producto }) {
  const tallaGuardada = useTallaGuardada();
  const { agregar } = useCarrito();
  const [tallaElegida, setTallaElegida] = useState<number | null>(null);
  const [variantes, setVariantes] = useState<Variantes>({});
  const [estadoStock, setEstadoStock] = useState<EstadoStock>(
    medusaConfigurado ? "cargando" : "sin-conexion",
  );
  const [agregando, setAgregando] = useState(false);
  const [aviso, setAviso] = useState<
    { tipo: "ok"; talla: number; lista: boolean } | { tipo: "error" } | null
  >(null);

  // El stock se pide en vivo a Medusa cada vez que se abre la ficha: así nunca
  // se muestra una unidad que ya no está (adiós stock fantasma).
  useEffect(() => {
    if (!medusaConfigurado) return;
    let vigente = true;
    medusa<RespuestaStock>("/store/products", {
      query: {
        handle: producto.slug,
        fields: "variants.id,variants.options.value,+variants.inventory_quantity",
      },
    })
      .then(({ products }) => {
        if (!vigente) return;
        const mapa: Variantes = {};
        for (const v of products[0]?.variants ?? []) {
          const talla = Number(v.options[0]?.value);
          if (Number.isInteger(talla)) {
            mapa[talla] = {
              id: v.id,
              disponibles: Math.max(0, v.inventory_quantity ?? 0),
            };
          }
        }
        setVariantes(mapa);
        setEstadoStock("ok");
      })
      .catch(() => {
        if (vigente) setEstadoStock("sin-conexion");
      });
    return () => {
      vigente = false;
    };
  }, [producto.slug]);

  // Si el cliente ya se midió, su talla viene preseleccionada.
  const talla = tallaElegida ?? tallaGuardada;
  const disponiblesDe = (n: number) => variantes[n]?.disponibles ?? 0;
  const disponibles = talla === null ? 0 : disponiblesDe(talla);
  const variante = talla === null ? undefined : variantes[talla];

  const alAgregar = async () => {
    if (talla === null || !variante) return;
    setAgregando(true);
    setAviso(null);
    try {
      await agregar(variante.id);
      setAviso({ tipo: "ok", talla, lista: disponibles > 0 });
    } catch {
      setAviso({ tipo: "error" });
    } finally {
      setAgregando(false);
    }
  };

  const colorMetal =
    producto.metal === "oro" ? "text-oro-profundo" : "text-plata-profunda";

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-8 pt-7 pb-24">
      <nav aria-label="Ruta" className="flex flex-wrap gap-2 text-sm text-texto">
        <Link href="/" className="hover:text-oro-profundo">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/#coleccion" className="hover:text-oro-profundo">
          Colección
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-tinta">{producto.nombre}</span>
      </nav>

      <div className="grid items-start gap-x-18 gap-y-12 lg:grid-cols-2">
        {/* La galería con Swiper y el zoom con PhotoSwipe llegan en la fase 6 */}
        <Image
          src={producto.imagen}
          alt={producto.alt}
          width={producto.ancho}
          height={producto.alto}
          preload
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="aspect-[9/10] w-full object-cover"
        />

        <div className="flex flex-col gap-6.5">
          <div className="flex flex-col gap-3">
            <span className={`etiqueta ${colorMetal}`}>
              {MATERIAL[producto.metal]}
            </span>
            <h1 className="font-display text-[clamp(40px,4vw,56px)] leading-[1.04] font-medium">
              {producto.nombre}
            </h1>
            <div className="flex items-baseline gap-3.5">
              <span className="text-[28px] font-medium">
                {formatoPrecio(producto.precio)}
              </span>
              <span className="text-[14.5px] text-texto">Precio final</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-linea pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
              <span
                id="talla-rotulo"
                className="text-[15px] font-medium tracking-[0.08em] uppercase"
              >
                Talla · {talla ?? "sin elegir"}
              </span>
              <Link
                href="/medidor"
                className="border-b border-oro py-1 text-[15px] hover:text-oro-profundo"
              >
                ¿No conoces tu talla? Mídela en pantalla
              </Link>
            </div>

            <div
              role="group"
              aria-labelledby="talla-rotulo"
              className="flex flex-wrap gap-2"
            >
              {TALLAS.map((n) => {
                const elegida = n === talla;
                const lista = disponiblesDe(n) > 0;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={elegida}
                    aria-label={`Talla ${n}, ${lista ? "lista para despacho" : "se fabrica a pedido"}`}
                    onClick={() => setTallaElegida(n)}
                    className={`flex size-13.5 cursor-pointer flex-col items-center justify-center gap-0.5 border text-base ${
                      elegida
                        ? "border-tinta bg-tinta text-marfil"
                        : "border-linea bg-papel hover:border-tinta"
                    }`}
                  >
                    <span>{n}</span>
                    <span
                      aria-hidden="true"
                      className={`size-1.5 rounded-full ${
                        lista
                          ? elegida
                            ? "bg-marfil"
                            : "bg-tinta"
                          : "bg-transparent"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-[13.5px] text-texto">
              <span className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-tinta"
                />
                Con punto: lista para despacho
              </span>
              <span>Sin punto: se fabrica a pedido</span>
            </div>
          </div>

          {/* Disponibilidad de la talla elegida */}
          <div
            aria-live="polite"
            className="flex flex-col gap-0.5 border border-linea bg-papel px-5 py-4.5"
          >
            {talla === null ? (
              <>
                <strong className="font-medium">Elige tu talla</strong>
                <span className="text-[15px] text-texto">
                  Verás al instante si está lista para despacho o si se fabrica
                  para ti.
                </span>
              </>
            ) : estadoStock === "cargando" ? (
              <>
                <strong className="font-medium">Talla {talla}</strong>
                <span className="text-[15px] text-texto">
                  Consultando disponibilidad en el taller…
                </span>
              </>
            ) : disponibles > 0 ? (
              <>
                <strong className="font-medium text-[#1d4e6b]">
                  Talla {talla} · lista para despacho
                </strong>
                <span className="text-[15px] text-texto">
                  {disponibles === 1
                    ? "Queda 1 unidad"
                    : `Quedan ${disponibles} unidades`}{" "}
                  en el taller.
                </span>
              </>
            ) : (
              <>
                <strong className="font-medium text-[#9a4a12]">
                  Talla {talla} · se fabrica a pedido
                </strong>
                <span className="text-[15px] text-texto">
                  {/* PENDIENTE: plazo de fabricación que confirme el cliente */}
                  Lista en [PLAZO] días hábiles desde la confirmación del pago.
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={alAgregar}
              disabled={talla === null || !variante || agregando}
              className="min-h-[58px] cursor-pointer bg-tinta px-8 text-[15px] font-medium tracking-[0.14em] text-marfil uppercase hover:bg-oro-profundo disabled:cursor-not-allowed disabled:bg-linea disabled:text-texto"
            >
              {agregando ? "Agregando…" : "Agregar al carrito"}
            </button>

            {aviso?.tipo === "ok" && (
              <div
                role="status"
                className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 bg-tinta px-5 py-3.5 text-[15px] text-marfil"
              >
                <span>
                  Talla {aviso.talla} agregada.{" "}
                  {aviso.lista
                    ? "Está lista para despacho."
                    : "Entra a fabricación cuando se confirme el pago."}
                </span>
                <Link href="/carrito" className="border-b border-oro-claro text-oro-claro">
                  Ver carrito
                </Link>
              </div>
            )}
            {aviso?.tipo === "error" && (
              <p role="alert" className="text-[15px] text-[#9a4a12]">
                No pudimos agregarla al carrito. Intenta de nuevo en un momento.
              </p>
            )}
            {estadoStock === "sin-conexion" && (
              <p className="text-[15px] text-texto">
                El carrito no está disponible en este momento. Puedes pedir este
                modelo por{" "}
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-b border-oro text-tinta"
                >
                  WhatsApp
                </a>
                .
              </p>
            )}
          </div>

          <dl className="grid grid-cols-[150px_1fr] gap-x-3 gap-y-2.5 border-t border-linea pt-5 text-[15.5px] text-texto">
            <dt className="font-medium text-tinta">Región Metropolitana</dt>
            <dd>Entrega presencial coordinada o envío.</dd>
            <dt className="font-medium text-tinta">Regiones</dt>
            <dd>Starken, Blue Express o Chilexpress.</dd>
            <dt className="font-medium text-tinta">Medios de pago</dt>
            <dd>Transferencia bancaria, débito, crédito o efectivo.</dd>
            <dt className="font-medium text-tinta">Consultas</dt>
            <dd>WhatsApp {WHATSAPP_TEXTO}</dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
