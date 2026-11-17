import Image from "next/image";
import Link from "next/link";

const categorias = [
  {
    titulo: "Argollas de matrimonio",
    href: "/#coleccion",
    imagen: "/joyas/plata-m46.jpg",
    alt: "Par de argollas de plata con franja texturada y circones",
  },
  {
    titulo: "Anillos de compromiso",
    href: "/producto/plata-modelo-17",
    imagen: "/joyas/plata-m17.jpg",
    alt: "Anillo solitario de plata con piedra central y nudos laterales",
  },
  // Sin foto todavía: cuando el cliente la entregue, agrega `imagen` y `alt`.
  { titulo: "Colgantes y cadenas", href: "/colgantes" },
];

export default function Categorias() {
  return (
    <section
      id="categorias"
      className="mx-auto flex max-w-7xl flex-col gap-12 px-8 pt-26 pb-24"
    >
      <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-4">
        <h2 className="titulo-seccion">Una joya para cada promesa</h2>
        <p className="max-w-[26em] font-light text-texto">
          49 modelos en plata 950 y 23 en oro 18 kilates, todos fabricados en
          el taller.
        </p>
      </div>

      <ul className="grid gap-6 md:grid-cols-3">
        {categorias.map((c) => (
          <li key={c.titulo}>
            <Link href={c.href} className="group flex flex-col gap-4.5">
              {c.imagen ? (
                <Image
                  src={c.imagen}
                  alt={c.alt ?? ""}
                  width={640}
                  height={800}
                  sizes="(min-width: 768px) 30vw, 90vw"
                  className="aspect-[4/5] w-full object-cover"
                />
              ) : (
                <span className="flex aspect-[4/5] w-full items-center justify-center border border-dashed border-oro bg-arena text-sm tracking-[0.14em] text-texto uppercase">
                  [Foto de colgante]
                </span>
              )}
              <span className="flex items-baseline justify-between gap-4 border-b border-linea pb-3.5 group-hover:border-oro">
                <span className="font-display text-3xl leading-tight">
                  {c.titulo}
                </span>
                <svg
                  aria-hidden="true"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-none"
                >
                  <path d="M4 12h16" />
                  <path d="M14 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
