import Image from "next/image";
import Link from "next/link";
import BotonCarrito from "./BotonCarrito";
import MenuMovil from "./MenuMovil";

const enlaces = [
  { href: "/#coleccion", texto: "Argollas" },
  { href: "/producto/plata-modelo-17", texto: "Compromiso" },
  { href: "/#coleccion", texto: "Plata 950" },
  { href: "/#coleccion", texto: "Oro 18K" },
  { href: "/colgantes", texto: "Colgantes" },
  { href: "/medidor", texto: "Mide tu talla", destacado: true },
];

export default function Header() {
  return (
    <>
      <p className="bg-tinta px-5 py-2.5 text-center text-[13px] tracking-[0.08em] text-marfil">
        Fabricación a pedido · Despachos a regiones
        {/* El detalle de los couriers solo cabe en pantallas anchas */}
        <span className="hidden md:inline">
          {" "}
          por Starken, Blue Express y Chilexpress
        </span>
      </p>

      {/* relative: el menú móvil se despliega justo debajo de la cabecera */}
      <header className="relative border-b border-linea">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-x-4 px-5 py-2.5 sm:px-8 lg:gap-x-8 lg:py-3.5">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3">
            <Image
              src="/logo-emblema.png"
              alt="Emblema de VM Joyería"
              width={60}
              height={60}
              className="size-12 rounded-full mix-blend-multiply sm:size-15"
            />
            <span className="flex flex-col">
              <span className="font-display text-2xl leading-none font-semibold tracking-[0.02em] sm:text-[28px]">
                VM Joyería
              </span>
              <span className="text-[9.5px] tracking-[0.22em] text-oro-profundo uppercase sm:text-[10.5px] sm:tracking-[0.26em]">
                Elegancia que perdura
              </span>
            </span>
          </Link>

          {/* Navegación de escritorio; en teléfono y tablet va en MenuMovil */}
          <nav
            aria-label="Principal"
            className="hidden gap-x-7 text-[15px] tracking-[0.04em] lg:flex"
          >
            {enlaces.map((e) => (
              <Link
                key={e.texto}
                href={e.href}
                className={`py-3 hover:text-oro-profundo ${
                  e.destacado ? "border-b border-oro" : ""
                }`}
              >
                {e.texto}
              </Link>
            ))}
          </nav>

          <div className="flex items-center">
            <BotonCarrito />
            <MenuMovil enlaces={enlaces} />
          </div>
        </div>
      </header>
    </>
  );
}
