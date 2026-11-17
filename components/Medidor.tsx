"use client";

import { useState } from "react";
import Link from "next/link";
import { decimal, guardarTalla, tallaDesdeContorno } from "@/lib/tallas";

type Metodo = "anillo" | "tira";

// Cédula chilena y tarjetas bancarias: formato ID-1 (85,6 × 53,98 mm).
const TARJETA = { ancho: 53.98, alto: 85.6, radio: 3.18 };
const REGLA_MM = 80;
const limitar = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const claseMasMenos =
  "flex size-12 flex-none cursor-pointer items-center justify-center border border-tinta bg-papel text-2xl leading-none hover:bg-arena";
const claseRotulo = "text-sm font-medium tracking-[0.1em] uppercase";

export default function Medidor() {
  const [paso, setPaso] = useState<1 | 2>(1);
  // Píxeles CSS por milímetro. 3,78 corresponde a 96 ppp; el paso 1 lo corrige.
  const [pxMm, setPxMm] = useState(3.78);
  const [metodo, setMetodo] = useState<Metodo>("anillo");
  const [diametro, setDiametro] = useState(17.2);
  const [contornoTira, setContornoTira] = useState(54);
  const [guardada, setGuardada] = useState<number | null>(null);

  const contorno = metodo === "anillo" ? Math.PI * diametro : contornoTira;
  const { talla, europea, diametro: diametroFinal } =
    tallaDesdeContorno(contorno);

  const cambiarDiametro = (v: number) => {
    setDiametro(limitar(Number(v.toFixed(1)), 14, 23.5));
    setGuardada(null);
  };
  const cambiarTira = (v: number) => {
    setContornoTira(limitar(v, 44, 74));
    setGuardada(null);
  };
  const usarTalla = () => {
    guardarTalla(talla);
    setGuardada(talla);
  };

  const rayas = (color: string, periodo: number) =>
    `repeating-linear-gradient(to bottom, ${color} 0px, ${color} 1px, transparent 1px, transparent ${periodo.toFixed(3)}px)`;

  const tituloEscena =
    paso === 1
      ? "Paso 1 · calibración"
      : metodo === "anillo"
        ? "Paso 2 · tamaño real"
        : "Paso 2 · regla a tamaño real";
  const pieEscena =
    paso === 1
      ? "El borde exterior del rectángulo debe coincidir con el borde de tu tarjeta."
      : metodo === "anillo"
        ? "El círculo dorado debe llenar el interior del anillo: ni sobresalir ni dejar borde oscuro."
        : "Apoya el extremo de la tira en la línea superior de la regla.";

  return (
    <div className="mx-auto grid max-w-7xl items-start gap-x-16 gap-y-12 px-8 pt-14 pb-24 lg:grid-cols-2">
      {/* Controles */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-3.5">
          <span className="etiqueta text-oro-profundo">
            Toma de medida virtual
          </span>
          <h1 className="font-display text-[clamp(40px,4.2vw,60px)] leading-[1.03] font-medium">
            Mide tu talla en pantalla
          </h1>
          <p className="max-w-[30em] text-lg font-light text-texto">
            Dos pasos, sin imprimir ni recortar. Primero ajustamos la pantalla
            a tamaño real; después mides.
          </p>
        </div>

        <div role="group" aria-label="Pasos" className="flex flex-wrap gap-2">
          {(
            [
              [1, "Calibrar pantalla"],
              [2, "Medir"],
            ] as const
          ).map(([n, texto]) => (
            <button
              key={n}
              type="button"
              aria-pressed={paso === n}
              onClick={() => setPaso(n)}
              className={`flex min-h-12 cursor-pointer items-center gap-3 border border-tinta px-5 text-[15px] ${
                paso === n ? "bg-tinta text-marfil" : "hover:bg-arena"
              }`}
            >
              <span className="font-display text-2xl leading-none italic">
                {n}
              </span>
              {texto}
            </button>
          ))}
        </div>

        {paso === 1 ? (
          <div className="flex flex-col gap-6">
            <p className="text-lg">
              Apoya tu{" "}
              <strong className="font-medium">
                cédula de identidad o una tarjeta bancaria
              </strong>{" "}
              en vertical sobre el rectángulo dorado y mueve el control hasta
              que tengan exactamente el mismo tamaño.
            </p>
            <div className="flex flex-col gap-2">
              <label htmlFor="ctl-px" className={claseRotulo}>
                Tamaño del rectángulo
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Achicar el rectángulo"
                  onClick={() => setPxMm(limitar(pxMm - 0.02, 2.6, 6.5))}
                  className={claseMasMenos}
                >
                  −
                </button>
                <input
                  id="ctl-px"
                  type="range"
                  min={2.6}
                  max={6.5}
                  step={0.01}
                  value={pxMm}
                  onChange={(e) => setPxMm(Number(e.target.value))}
                  className="h-11 min-w-0 flex-1"
                />
                <button
                  type="button"
                  aria-label="Agrandar el rectángulo"
                  onClick={() => setPxMm(limitar(pxMm + 0.02, 2.6, 6.5))}
                  className={claseMasMenos}
                >
                  +
                </button>
              </div>
            </div>
            <div className="flex">
              <button
                type="button"
                onClick={() => setPaso(2)}
                className="min-h-14 cursor-pointer bg-tinta px-8 text-[15px] font-medium tracking-[0.14em] text-marfil uppercase hover:bg-oro-profundo"
              >
                Mi tarjeta calza, continuar
              </button>
            </div>
            <p className="text-[15px] text-texto">
              La cédula chilena y las tarjetas bancarias miden lo mismo: 85,6 ×
              54 mm. Mantén el zoom del navegador sin cambios mientras mides.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <div
              role="group"
              aria-label="Método de medida"
              className="grid grid-cols-2 gap-2"
            >
              {(
                [
                  ["anillo", "Tengo un anillo", "Uno que me quede bien"],
                  ["tira", "Tira de papel", "Mido mi dedo directamente"],
                ] as const
              ).map(([valor, titulo, detalle]) => (
                <button
                  key={valor}
                  type="button"
                  aria-pressed={metodo === valor}
                  onClick={() => {
                    setMetodo(valor);
                    setGuardada(null);
                  }}
                  className={`flex min-h-16 cursor-pointer flex-col gap-0.5 border px-4 py-2.5 text-left ${
                    metodo === valor
                      ? "border-tinta bg-papel"
                      : "border-linea hover:border-tinta"
                  }`}
                >
                  <strong className="text-base font-medium">{titulo}</strong>
                  <span className="text-[13.5px] text-texto">{detalle}</span>
                </button>
              ))}
            </div>

            {metodo === "anillo" ? (
              <div className="flex flex-col gap-4">
                <p className="text-lg">
                  Apoya el anillo sobre la pantalla y ajusta hasta que el
                  círculo dorado{" "}
                  <strong className="font-medium">
                    llene justo el interior
                  </strong>{" "}
                  del anillo, sin sobresalir ni dejar borde oscuro.
                </p>
                <div className="flex flex-col gap-2">
                  <label htmlFor="ctl-d" className={claseRotulo}>
                    Diámetro interior · {decimal(diametro)} mm
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Reducir diámetro 0,1 milímetros"
                      onClick={() => cambiarDiametro(diametro - 0.1)}
                      className={claseMasMenos}
                    >
                      −
                    </button>
                    <input
                      id="ctl-d"
                      type="range"
                      min={14}
                      max={23.5}
                      step={0.1}
                      value={diametro}
                      onChange={(e) => cambiarDiametro(Number(e.target.value))}
                      className="h-11 min-w-0 flex-1"
                    />
                    <button
                      type="button"
                      aria-label="Aumentar diámetro 0,1 milímetros"
                      onClick={() => cambiarDiametro(diametro + 0.1)}
                      className={claseMasMenos}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-lg">
                  Envuelve una tira de papel en tu dedo sin apretar y marca
                  donde se superpone. Apoya la tira sobre la regla, con el
                  extremo en el 0, y lleva la{" "}
                  <strong className="font-medium">línea dorada</strong> hasta
                  tu marca.
                </p>
                <div className="flex flex-col gap-2">
                  <label htmlFor="ctl-t" className={claseRotulo}>
                    Contorno del dedo · {decimal(contornoTira)} mm
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label="Reducir contorno medio milímetro"
                      onClick={() => cambiarTira(contornoTira - 0.5)}
                      className={claseMasMenos}
                    >
                      −
                    </button>
                    <input
                      id="ctl-t"
                      type="range"
                      min={44}
                      max={74}
                      step={0.5}
                      value={contornoTira}
                      onChange={(e) => cambiarTira(Number(e.target.value))}
                      className="h-11 min-w-0 flex-1"
                    />
                    <button
                      type="button"
                      aria-label="Aumentar contorno medio milímetro"
                      onClick={() => cambiarTira(contornoTira + 0.5)}
                      className={claseMasMenos}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Resultado */}
            <div
              aria-live="polite"
              className="flex flex-wrap items-center gap-x-9 gap-y-4 border border-t-2 border-linea border-t-oro bg-papel px-7 py-6"
            >
              <div className="flex flex-col gap-0.5">
                <span className="etiqueta font-normal text-texto">Tu talla</span>
                <span className="font-display text-[104px] leading-[0.9] text-oro-profundo tabular-nums">
                  {talla}
                </span>
              </div>
              <dl className="grid grid-cols-[auto_auto] gap-x-5 gap-y-1.5 text-base">
                <dt className="text-texto">Diámetro interior</dt>
                <dd className="font-medium">{decimal(diametroFinal)} mm</dd>
                <dt className="text-texto">Contorno</dt>
                <dd className="font-medium">{decimal(contorno)} mm</dd>
                <dt className="text-texto">Talla europea</dt>
                <dd className="font-medium">{europea}</dd>
              </dl>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3.5">
              <button
                type="button"
                onClick={usarTalla}
                className="min-h-14 cursor-pointer bg-tinta px-8 text-[15px] font-medium tracking-[0.14em] text-marfil uppercase hover:bg-oro-profundo"
              >
                Usar talla {talla} en mi pedido
              </button>
              {guardada !== null && (
                <span role="status" className="text-[15.5px] font-medium text-[#1d4e6b]">
                  Talla {guardada} guardada.{" "}
                  <Link href="/#coleccion" className="border-b border-oro text-tinta">
                    Ver la colección
                  </Link>
                </span>
              )}
            </div>

            <ul className="flex flex-col gap-2 border-t border-linea pt-5 text-[15.5px] text-texto">
              <li>Si quedas entre dos tallas, elige la mayor.</li>
              <li>
                Las argollas anchas se sienten más ajustadas que las delgadas
                de la misma talla.
              </li>
              <li>
                Mide con las manos a temperatura normal: con frío el dedo se
                achica.
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Escenario a tamaño real */}
      <div className="flex min-h-[680px] flex-col items-center justify-between gap-8 overflow-hidden bg-tinta p-8 text-marfil">
        <span className="etiqueta self-start font-normal text-[#b9b2a6]">
          {tituloEscena}
        </span>

        {paso === 1 && (
          <div
            role="img"
            aria-label="Rectángulo del tamaño de una tarjeta, ajustable"
            className="flex flex-none items-center justify-center border-2 border-oro-claro bg-[#2a241d] p-4 text-center text-sm tracking-[0.08em] text-[#b9b2a6]"
            style={{
              width: TARJETA.ancho * pxMm,
              height: TARJETA.alto * pxMm,
              borderRadius: TARJETA.radio * pxMm,
            }}
          >
            Tu cédula o tarjeta, en vertical
          </div>
        )}

        {paso === 2 && metodo === "anillo" && (
          <div className="flex flex-col items-center gap-9">
            <div
              role="img"
              aria-label={`Círculo de ${decimal(diametro)} milímetros de diámetro a tamaño real`}
              className="flex-none rounded-full bg-oro-claro"
              style={{ width: diametro * pxMm, height: diametro * pxMm }}
            />
            <span className="font-display text-3xl leading-none tabular-nums">
              {decimal(diametro)} mm
            </span>
          </div>
        )}

        {paso === 2 && metodo === "tira" && (
          <div
            role="img"
            aria-label={`Regla vertical a tamaño real de 0 a ${REGLA_MM} milímetros, con la marca en ${decimal(contornoTira)}`}
            className="relative w-[190px] flex-none border-t-2 border-l-2 border-marfil"
            style={{ height: REGLA_MM * pxMm }}
          >
            <div
              className="absolute top-0 left-0 h-full w-3"
              style={{ backgroundImage: rayas("#8c857a", pxMm) }}
            />
            <div
              className="absolute top-0 left-0 h-full w-6.5"
              style={{ backgroundImage: rayas("#f6f1e8", pxMm * 10) }}
            />
            {Array.from({ length: REGLA_MM / 10 + 1 }, (_, i) => i * 10).map(
              (mm) => (
                <span
                  key={mm}
                  className="absolute left-9 -translate-y-1/2 text-[13px] text-[#b9b2a6] tabular-nums"
                  style={{ top: mm * pxMm }}
                >
                  {mm}
                </span>
              ),
            )}
            <div
              className="absolute left-0 w-[190px] border-t-2 border-oro-claro"
              style={{ top: contornoTira * pxMm }}
            />
            <span
              className="absolute left-[84px] -translate-y-[120%] font-display text-[26px] leading-none whitespace-nowrap text-oro-claro tabular-nums"
              style={{ top: contornoTira * pxMm }}
            >
              {decimal(contornoTira)} mm
            </span>
          </div>
        )}

        <span className="text-center text-sm text-[#b9b2a6]">{pieEscena}</span>
      </div>
    </div>
  );
}
