import { useSyncExternalStore } from "react";

export const TALLA_MIN = 8;
export const TALLA_MAX = 24;

/**
 * Talla chilena = contorno interior en mm (talla europea, ISO 8653) menos 40.
 * Ej.: 17,2 mm de diámetro -> 54 mm de contorno -> talla 14.
 */
export function tallaDesdeContorno(contornoMm: number) {
  const europea = Math.round(contornoMm);
  return { talla: europea - 40, europea, diametro: contornoMm / Math.PI };
}

/** 17.2 -> "17,2" */
export function decimal(valor: number, decimales = 1): string {
  return valor.toFixed(decimales).replace(".", ",");
}

// --- Talla guardada: la escribe el medidor y la lee la ficha de producto ---

const CLAVE = "vm-talla";
const EVENTO = "vm-talla-cambio";

export function guardarTalla(talla: number) {
  try {
    window.localStorage.setItem(CLAVE, String(talla));
  } catch {
    // Sin almacenamiento (modo privado estricto): la talla solo vive en pantalla.
  }
  window.dispatchEvent(new Event(EVENTO));
}

function leer(): number | null {
  try {
    const valor = Number(window.localStorage.getItem(CLAVE));
    return Number.isInteger(valor) && valor > 0 ? valor : null;
  } catch {
    return null;
  }
}

function suscribir(avisar: () => void) {
  window.addEventListener(EVENTO, avisar);
  window.addEventListener("storage", avisar);
  return () => {
    window.removeEventListener(EVENTO, avisar);
    window.removeEventListener("storage", avisar);
  };
}

/** Talla guardada en este navegador, o null si todavía no se ha medido. */
export function useTallaGuardada(): number | null {
  return useSyncExternalStore(suscribir, leer, () => null);
}
