"use client";

import { useState } from "react";
import Link from "next/link";

// LARGOS Y DISPONIBILIDAD DE EJEMPLO: confirmar con el cliente. En Medusa cada
// combinación (largo × tamaño de dije) es una variante con su propio stock.
const LARGOS = [
  { cm: 40, cae: "Ceñida, en la base del cuello", control: 104.7, y: 92, lista: false },
  { cm: 45, cae: "Sobre la clavícula", control: 136.7, y: 116, lista: true },
  { cm: 50, cae: "Bajo la clavícula", control: 171.3, y: 142, lista: true },
  { cm: 60, cae: "A la altura del pecho", control: 230, y: 186, lista: false },
];

const DIJES = [
  { nombre: "Pequeño", px: 16, radio: 4 },
  { nombre: "Mediano", px: 24, radio: 6 },
  { nombre: "Grande", px: 32, radio: 8 },
];

const arco = (control: number) =>
  `M105 54 C105 ${control} 155 ${control} 155 54`;

export default function FichaColgante() {
  const [cm, setCm] = useState(45);
  const [nombreDije, setNombreDije] = useState("Mediano");

  const largo = LARGOS.find((l) => l.cm === cm) ?? LARGOS[1];
  const dije = DIJES.find((d) => d.nombre === nombreDije) ?? DIJES[1];

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-8 pt-7 pb-24">
      <nav aria-label="Ruta" className="flex flex-wrap gap-2 text-sm text-texto">
        <Link href="/" className="hover:text-oro-profundo">
          Inicio
        </Link>
        <span aria-hidden="true">/</span>
        <span className="text-tinta">Colgantes y cadenas</span>
      </nav>

      <div className="grid items-start gap-x-18 gap-y-12 lg:grid-cols-2">
        {/* PENDIENTE: foto, nombre, material y precio reales del colgante */}
        <div className="flex aspect-[4/5] w-full items-center justify-center border border-dashed border-plata-borde bg-plata text-sm tracking-[0.14em] text-plata-profunda uppercase">
          [Foto del colgante]
        </div>

        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-3">
            <span className="etiqueta text-plata-profunda">
              Colgantes y cadenas · [Material]
            </span>
            <h1 className="font-display text-[clamp(40px,4vw,56px)] leading-[1.04] font-medium">
              [Nombre del colgante]
            </h1>
            <div className="flex items-baseline gap-3.5">
              <span className="text-[28px] font-medium">[PRECIO]</span>
              <span className="text-[14.5px] text-texto">Precio final</span>
            </div>
          </div>

          {/* Largo de cadena */}
          <div className="flex flex-col gap-4 border-t border-linea pt-6">
            <span
              id="largo-rotulo"
              className="text-[15px] font-medium tracking-[0.08em] uppercase"
            >
              Largo de cadena · {largo.cm} cm
            </span>
            <div className="flex flex-wrap items-stretch gap-x-7 gap-y-5">
              <div
                role="group"
                aria-labelledby="largo-rotulo"
                className="flex flex-[1_1_260px] flex-col gap-2"
              >
                {LARGOS.map((l) => (
                  <button
                    key={l.cm}
                    type="button"
                    aria-pressed={l.cm === largo.cm}
                    onClick={() => setCm(l.cm)}
                    className={`flex min-h-16 cursor-pointer items-center justify-between gap-4 border px-4 py-2.5 text-left ${
                      l.cm === largo.cm
                        ? "border-tinta bg-papel"
                        : "border-linea hover:border-tinta"
                    }`}
                  >
                    <span className="flex flex-col">
                      <strong className="text-[17px] font-medium">
                        {l.cm} cm
                      </strong>
                      <span className="text-sm text-texto">{l.cae}</span>
                    </span>
                    <span
                      className={`flex-none text-[13px] font-medium ${
                        l.lista ? "text-[#1d4e6b]" : "text-texto"
                      }`}
                    >
                      {l.lista ? "Lista para despacho" : "A pedido"}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex min-h-[300px] flex-[1_1_220px] items-end justify-center bg-plata px-4 pt-4">
                <svg
                  role="img"
                  aria-label={`Dibujo de un busto con la cadena de ${largo.cm} centímetros destacada: ${largo.cae.toLowerCase()}`}
                  viewBox="0 0 260 300"
                  className="block w-full max-w-[260px]"
                >
                  <path
                    d="M104 0 V56 C104 86 44 88 16 116 V300 H244 V116 C216 88 156 86 156 56 V0 Z"
                    fill="#fffdf9"
                    stroke="#c9ccd3"
                    strokeWidth="1.5"
                  />
                  {LARGOS.map((l) => (
                    <path
                      key={l.cm}
                      d={arco(l.control)}
                      fill="none"
                      stroke="#9ba0aa"
                      strokeWidth="1"
                    />
                  ))}
                  <path
                    d={arco(largo.control)}
                    fill="none"
                    stroke="#7f5a16"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="130"
                    cy={largo.y + dije.radio}
                    r={dije.radio}
                    fill="#d9b36a"
                    stroke="#7f5a16"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Tamaño del dije */}
          <div className="flex flex-col gap-3.5">
            <span
              id="dije-rotulo"
              className="text-[15px] font-medium tracking-[0.08em] uppercase"
            >
              Tamaño del dije · {dije.nombre}
            </span>
            <div
              role="group"
              aria-labelledby="dije-rotulo"
              className="grid grid-cols-3 gap-2"
            >
              {DIJES.map((d) => (
                <button
                  key={d.nombre}
                  type="button"
                  aria-pressed={d.nombre === dije.nombre}
                  onClick={() => setNombreDije(d.nombre)}
                  className={`flex min-h-[92px] cursor-pointer flex-col items-center justify-end gap-2 border px-2 py-3 ${
                    d.nombre === dije.nombre
                      ? "border-tinta bg-papel"
                      : "border-linea hover:border-tinta"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="rounded-full border-[1.5px] border-oro-profundo"
                    style={{ width: d.px, height: d.px }}
                  />
                  <span className="text-[15px]">{d.nombre} · [X mm]</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-linea pt-6">
            <span aria-live="polite" className="text-base text-texto">
              Tu selección: cadena de{" "}
              <strong className="font-medium text-tinta">{largo.cm} cm</strong>,
              dije{" "}
              <strong className="font-medium text-tinta">
                {dije.nombre.toLowerCase()}
              </strong>
              . {largo.lista ? "Lista para despacho." : "Se fabrica a pedido."}
            </span>
            <button
              type="button"
              className="min-h-[58px] cursor-pointer bg-tinta px-8 text-[15px] font-medium tracking-[0.14em] text-marfil uppercase hover:bg-oro-profundo"
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
