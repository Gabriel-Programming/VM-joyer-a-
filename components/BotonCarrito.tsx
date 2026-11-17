"use client";

import Link from "next/link";
import { useCarrito } from "./CarritoProvider";

export default function BotonCarrito() {
  const { cantidad } = useCarrito();

  return (
    <Link
      href="/carrito"
      aria-label={`Carrito, ${cantidad} ${cantidad === 1 ? "pieza" : "piezas"}`}
      className="flex h-11 items-center justify-center gap-1.5 px-2.5 hover:text-oro-profundo"
    >
      <svg
        aria-hidden="true"
        width="21"
        height="21"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 8h14l-1.2 12H6.2z" />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" />
      </svg>
      {cantidad > 0 && (
        <span className="text-[15px] tabular-nums">{cantidad}</span>
      )}
    </Link>
  );
}
