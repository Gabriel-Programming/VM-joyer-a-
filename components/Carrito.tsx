"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatoPrecio } from "@/lib/productos";
import { WHATSAPP_URL } from "@/lib/contacto";
import { useCarrito } from "./CarritoProvider";

export default function Carrito() {
  const { carrito, listo, quitar } = useCarrito();
  const [quitando, setQuitando] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const lineas = carrito?.lineas ?? [];

  const alQuitar = async (id: string) => {
    setQuitando(id);
    setError(false);
    try {
      await quitar(id);
    } catch {
      setError(true);
    } finally {
      setQuitando(null);
    }
  };

  // Mientras no haya pago en línea, el pedido se cierra por WhatsApp.
  const mensaje = [
    "Hola, quiero hacer este pedido:",
    ...lineas.map(
      (l) => `- ${l.titulo}, ${l.talla.toLowerCase()}: ${formatoPrecio(l.precio)}`,
    ),
    `Total: ${formatoPrecio(carrito?.total ?? 0)}`,
  ].join("\n");

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-10 px-8 pt-14 pb-24">
      <h1 className="font-display text-[clamp(40px,4.2vw,60px)] leading-[1.03] font-medium">
        Tu carrito
      </h1>

      {!listo ? (
        <p className="text-texto">Cargando tu carrito…</p>
      ) : lineas.length === 0 ? (
        <div className="flex flex-col items-start gap-6 border-t border-linea pt-8">
          <p className="text-lg text-texto">Todavía no has agregado joyas.</p>
          <Link
            href="/#coleccion"
            className="inline-flex min-h-[54px] items-center bg-tinta px-8 text-[15px] font-medium tracking-[0.14em] text-marfil uppercase hover:bg-oro-profundo"
          >
            Ver la colección
          </Link>
        </div>
      ) : (
        <>
          <ul className="flex flex-col border-t border-linea">
            {lineas.map((l) => (
              <li
                key={l.id}
                className="flex flex-wrap items-center gap-x-6 gap-y-4 border-b border-linea py-6"
              >
                {l.imagen && (
                  <Image
                    src={l.imagen}
                    alt=""
                    width={112}
                    height={112}
                    className="size-28 flex-none object-cover"
                  />
                )}
                <div className="flex min-w-40 flex-1 flex-col gap-1">
                  <Link
                    href={`/producto/${l.slug}`}
                    className="font-display text-[28px] leading-tight hover:text-oro-profundo"
                  >
                    {l.titulo}
                  </Link>
                  <span className="text-[15px] text-texto">{l.talla}</span>
                </div>
                <span className="text-lg font-medium">
                  {formatoPrecio(l.precio)}
                </span>
                <button
                  type="button"
                  onClick={() => alQuitar(l.id)}
                  disabled={quitando === l.id}
                  className="min-h-11 cursor-pointer border-b border-oro text-[15px] hover:text-oro-profundo disabled:cursor-wait disabled:text-texto"
                >
                  {quitando === l.id ? "Quitando…" : "Quitar"}
                </button>
              </li>
            ))}
          </ul>

          {error && (
            <p role="alert" className="text-[15px] text-[#9a4a12]">
              No pudimos actualizar el carrito. Intenta de nuevo en un momento.
            </p>
          )}

          <div className="flex flex-col gap-6 sm:items-end">
            <div className="flex items-baseline gap-6">
              <span className="etiqueta font-normal text-texto">Total</span>
              <span className="font-display text-5xl leading-none tabular-nums">
                {formatoPrecio(carrito?.total ?? 0)}
              </span>
            </div>
            <a
              href={`${WHATSAPP_URL}?text=${encodeURIComponent(mensaje)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[58px] items-center bg-[#1f6b45] px-8 text-[15px] font-medium tracking-[0.14em] text-white uppercase hover:bg-[#17553a]"
            >
              Coordinar pago por WhatsApp
            </a>
            <p className="max-w-[26em] text-[15px] text-texto sm:text-right">
              Te confirmamos disponibilidad, medio de pago y entrega. El pago
              en línea llegará en una próxima etapa.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
