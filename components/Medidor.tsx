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

  const PX_MIN = 2.6;
  const PX_MAX = 7.5; // los teléfonos rondan 6 a 7 px por milímetro

  const control = (
    id: string,
    rotulo: string,
    valor: number,
    min: number,
    max: number,
    paso_: number,
    alCambiar: (v: number) => void,
    textoMenos: string,
    textoMas: string,
    salto: number,
  ) => (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={claseRotulo}>
        {rotulo}
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={textoMenos}
          onClick={() => alCambiar(valor - salto)}
          className={claseMasMenos}
        >
          −
        </button>
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={paso_}
          value={valor}
          onChange={(e) => alCambiar(Number(e.target.value))}
          className="h-11 min-w-0 flex-1"
        />
        <button
          type="button"
          aria-label={textoMas}
          onClick={() => alCambiar(valor + salto)}
          className={claseMasMenos}
        >
          +
        </button>
      </div>
    </div>
  );

  // En teléfono el orden es: explicación, escenario, controles. Así el control
  // queda pegado a lo que se mide. En escritorio el escenario va a la derecha.
  return (
    <div className="mx-auto grid max-w-7xl items-start gap-y-7 px-5 pt-10 pb-16 sm:px-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-8 lg:pt-14 lg:pb-24">
      {/* 1 · Explicación */}
      <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-1 lg:gap-8">
        <div className="flex flex-col gap-3.5">
          <span className="etiqueta text-oro-profundo">
            Toma de medida virtual
          </span>
          <h1 className="font-display text-[clamp(36px,4.2vw,60px)] leading-[1.03] font-medium">
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

        {paso === 2 && (
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
        )}

        {paso === 1 ? (
          <p className="text-lg">
            Apoya tu{" "}
            <strong className="font-medium">
              cédula de identidad o una tarjeta bancaria
            </strong>{" "}
            en vertical sobre el rectángulo dorado y mueve el control hasta que
            tengan exactamente el mismo tamaño.
          </p>
        ) : metodo === "anillo" ? (
          <p className="text-lg">
            Apoya el anillo sobre la pantalla y ajusta hasta que el círculo
            dorado{" "}
            <strong className="font-medium">llene justo el interior</strong>{" "}
            del anillo, sin sobresalir ni dejar borde oscuro.
          </p>
        ) : (
          <p className="text-lg">
            Envuelve una tira de papel en tu dedo sin apretar y marca donde se
            superpone. Apoya la tira sobre la regla, con el extremo en el 0, y
            lleva la <strong className="font-medium">línea dorada</strong> hasta
            tu marca.
          </p>
        )}
      </div>

      {/* 2 · Escenario a tamaño real. En teléfono va a todo el ancho y sin rótulos,
          para que la tarjeta y el control quepan juntos en pantalla. */}
      <div className="-mx-5 flex min-h-[300px] flex-col items-center justify-center gap-7 overflow-hidden bg-tinta px-0 py-5 text-marfil sm:mx-0 sm:min-h-[420px] sm:justify-between sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:min-h-[680px]">
        <span className="etiqueta hidden self-start font-normal text-[#b9b2a6] sm:block">
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

        <span className="hidden text-center text-sm text-[#b9b2a6] sm:block">
          {pieEscena}
        </span>
      </div>

      {/* 3 · Controles y resultado */}
      <div className="flex flex-col gap-6 lg:col-start-1 lg:row-start-2">
        {paso === 1 ? (
          <>
            {control(
              "ctl-px",
              "Tamaño del rectángulo",
              pxMm,
              PX_MIN,
              PX_MAX,
              0.01,
              (v) => setPxMm(limitar(v, PX_MIN, PX_MAX)),
              "Achicar el rectángulo",
              "Agrandar el rectángulo",
              0.02,
            )}
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
          </>
        ) : (
          <>
            {metodo === "anillo"
              ? control(
                  "ctl-d",
                  `Diámetro interior · ${decimal(diametro)} mm`,
                  diametro,
                  14,
                  23.5,
                  0.1,
                  cambiarDiametro,
                  "Reducir diámetro 0,1 milímetros",
                  "Aumentar diámetro 0,1 milímetros",
                  0.1,
                )
              : control(
                  "ctl-t",
                  `Contorno del dedo · ${decimal(contornoTira)} mm`,
                  contornoTira,
                  44,
                  74,
                  0.5,
                  cambiarTira,
                  "Reducir contorno medio milímetro",
                  "Aumentar contorno medio milímetro",
                  0.5,
                )}

            {/* Resultado */}
            <div
              aria-live="polite"
              className="flex flex-wrap items-center gap-x-9 gap-y-4 border border-t-2 border-linea border-t-oro bg-papel px-5 py-5 sm:px-7 sm:py-6"
            >
              <div className="flex flex-col gap-0.5">
                <span className="etiqueta font-normal text-texto">Tu talla</span>
                <span className="font-display text-[88px] leading-[0.9] text-oro-profundo tabular-nums sm:text-[104px]">
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
          </>
        )}
      </div>
    </div>
  );
}
