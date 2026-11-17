import Link from "next/link";
import {
  INSTAGRAM_URL,
  INSTAGRAM_USUARIO,
  WHATSAPP_TEXTO,
  WHATSAPP_URL,
} from "@/lib/contacto";

const columnas = [
  {
    titulo: "Colección",
    enlaces: [
      { href: "/#coleccion", texto: "Plata 950 nacional" },
      { href: "/#coleccion", texto: "Oro 18 kilates" },
      { href: "/producto/plata-modelo-17", texto: "Anillos de compromiso" },
      { href: "/colgantes", texto: "Colgantes y cadenas" },
    ],
  },
  {
    titulo: "Ayuda",
    enlaces: [
      { href: "/medidor", texto: "Mide tu talla" },
      { href: "/#como-comprar", texto: "Cómo realizar tu pedido" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-tinta text-marfil">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-5 pt-14 pb-10 sm:px-8 lg:gap-14 lg:pt-18">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2.5">
            <span className="font-display text-[32px] leading-none font-semibold">
              VM Joyería
            </span>
            <span className="text-[11px] tracking-[0.26em] text-oro-claro uppercase">
              Elegancia que perdura
            </span>
          </div>

          {columnas.map((c) => (
            <nav
              key={c.titulo}
              aria-label={c.titulo}
              className="flex flex-col gap-1 text-[15.5px]"
            >
              <span className="mb-2 text-xs tracking-[0.2em] text-[#b9b2a6] uppercase">
                {c.titulo}
              </span>
              {c.enlaces.map((e) => (
                <Link
                  key={e.texto}
                  href={e.href}
                  className="py-1.5 hover:text-oro-claro"
                >
                  {e.texto}
                </Link>
              ))}
            </nav>
          ))}

          <div className="flex flex-col gap-1 text-[15.5px]">
            <span className="mb-2 text-xs tracking-[0.2em] text-[#b9b2a6] uppercase">
              Contacto
            </span>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 hover:text-oro-claro"
            >
              WhatsApp {WHATSAPP_TEXTO}
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="py-1.5 hover:text-oro-claro"
            >
              Instagram {INSTAGRAM_USUARIO}
            </a>
            {/* PENDIENTE: dirección o comuna del taller y política de cambios */}
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-x-8 gap-y-2 border-t border-[#4a4338] pt-6 text-[13.5px] text-[#b9b2a6]">
          <span>© 2026 VM Joyeríachile SpA</span>
          <span>
            Modelos sujetos a confirmación de material, medidas y
            disponibilidad.
          </span>
        </div>
      </div>
    </footer>
  );
}
