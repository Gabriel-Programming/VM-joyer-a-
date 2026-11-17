import Image from "next/image";
import Link from "next/link";
import BotonCarrito from "./BotonCarrito";

const enlaces = [
  { href: "/#coleccion", texto: "Argollas" },
  { href: "/producto/plata-modelo-17", texto: "Compromiso" },
  { href: "/#coleccion", texto: "Plata 950" },
  { href: "/#coleccion", texto: "Oro 18K" },
  { href: "/colgantes", texto: "Colgantes" },
];

export default function Header() {
  return (
    <>
      <p className="bg-tinta px-6 py-2.5 text-center text-[13px] tracking-[0.08em] text-marfil">
        Fabricación a pedido · Despachos a regiones por Starken, Blue Express y
        Chilexpress
      </p>

      <header className="border-b border-linea">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-8 gap-y-4 px-8 py-3.5">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-emblema.png"
              alt="Emblema de VM Joyería"
              width={60}
              height={60}
              className="rounded-full mix-blend-multiply"
            />
            <span className="flex flex-col">
              <span className="font-display text-[28px] leading-none font-semibold tracking-[0.02em]">
                VM Joyería
              </span>
              <span className="text-[10.5px] tracking-[0.26em] text-oro-profundo uppercase">
                Elegancia que perdura
              </span>
            </span>
          </Link>

          <nav
            aria-label="Principal"
            className="flex flex-wrap gap-x-7 gap-y-2 text-[15px] tracking-[0.04em]"
          >
            {enlaces.map((e) => (
              <Link
                key={e.texto}
                href={e.href}
                className="py-3 hover:text-oro-profundo"
              >
                {e.texto}
              </Link>
            ))}
            <Link
              href="/medidor"
              className="border-b border-oro py-3 hover:text-oro-profundo"
            >
              Mide tu talla
            </Link>
          </nav>

          <BotonCarrito />
        </div>
      </header>
    </>
  );
}
