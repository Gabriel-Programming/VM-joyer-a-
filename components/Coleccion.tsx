"use client";

import { useState } from "react";
import type { Metal, Producto } from "@/lib/productos";
import TarjetaProducto from "./TarjetaProducto";

type Filtro = "todo" | Metal;

const filtros: { valor: Filtro; texto: string }[] = [
  { valor: "todo", texto: "Todo" },
  { valor: "plata", texto: "Plata 950" },
  { valor: "oro", texto: "Oro 18K" },
];

export default function Coleccion({ productos }: { productos: Producto[] }) {
  const [filtro, setFiltro] = useState<Filtro>("todo");

  // "Todo" muestra los destacados; cada metal muestra su catálogo completo.
  const visibles =
    filtro === "todo"
      ? productos.filter((p) => p.destacado)
      : productos.filter((p) => p.metal === filtro);

  return (
    <section id="coleccion" className="border-t border-linea bg-papel">
      <div className="mx-auto flex max-w-7xl flex-col gap-9 px-5 pt-16 pb-16 sm:px-8 lg:gap-11 lg:pt-24 lg:pb-26">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <div className="flex flex-col gap-2.5">
            <span className="etiqueta text-oro-profundo">Del catálogo</span>
            <h2 className="titulo-seccion">Elige tu metal</h2>
          </div>

          <div
            role="group"
            aria-label="Filtrar por metal"
            className="flex flex-wrap gap-2"
          >
            {filtros.map((f) => (
              <button
                key={f.valor}
                type="button"
                aria-pressed={filtro === f.valor}
                onClick={() => setFiltro(f.valor)}
                className={`min-h-11 cursor-pointer border border-tinta px-5.5 text-[15px] tracking-[0.06em] transition-colors ${
                  filtro === f.valor
                    ? "bg-tinta text-marfil"
                    : "hover:bg-arena"
                }`}
              >
                {f.texto}
              </button>
            ))}
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4">
          {visibles.map((p) => (
            <li key={p.slug}>
              <TarjetaProducto producto={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
