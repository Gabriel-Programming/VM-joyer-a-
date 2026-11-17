"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Enlace = { href: string; texto: string; destacado?: boolean };

/** Botón de menú y panel desplegable para teléfono y tablet (oculto desde lg). */
export default function MenuMovil({ enlaces }: { enlaces: Enlace[] }) {
  const [abierto, setAbierto] = useState(false);

  // Se cierra con Escape, como cualquier menú desplegable.
  useEffect(() => {
    if (!abierto) return;
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierto(false);
    };
    window.addEventListener("keydown", alPulsar);
    return () => window.removeEventListener("keydown", alPulsar);
  }, [abierto]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={abierto}
        aria-controls="menu-movil"
        aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setAbierto(!abierto)}
        className="-mr-2.5 flex size-11 cursor-pointer items-center justify-center hover:text-oro-profundo"
      >
        <svg
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          {abierto ? (
            <>
              <path d="M6 6l12 12" />
              <path d="M18 6L6 18" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      {abierto && (
        <nav
          id="menu-movil"
          aria-label="Principal"
          className="absolute inset-x-0 top-full z-20 border-b border-linea bg-marfil shadow-[0_12px_24px_-12px_rgba(26,22,18,0.25)]"
        >
          <ul className="mx-auto flex max-w-7xl flex-col px-5 py-2 sm:px-8">
            {enlaces.map((e) => (
              <li key={e.texto} className="border-b border-linea last:border-b-0">
                <Link
                  href={e.href}
                  onClick={() => setAbierto(false)}
                  className={`flex min-h-13 items-center text-[17px] tracking-[0.04em] hover:text-oro-profundo ${
                    e.destacado ? "font-medium text-oro-profundo" : ""
                  }`}
                >
                  {e.texto}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
