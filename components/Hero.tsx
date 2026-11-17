import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-x-16 gap-y-14 px-8 pt-18 pb-26 lg:grid-cols-2">
      <div className="flex flex-col gap-7">
        <span className="text-[12.5px] font-medium tracking-[0.22em] text-oro-profundo uppercase">
          Taller de joyería · Chile
        </span>

        <h1 className="font-display text-[clamp(44px,5.2vw,74px)] leading-[1.02] font-medium tracking-[-0.01em] text-balance">
          Argollas hechas a pedido, en{" "}
          <em className="font-normal text-plata-profunda">plata 950</em> y{" "}
          <em className="font-normal text-oro-profundo">oro 18 kilates</em>.
        </h1>

        <p className="max-w-[30em] text-[19px] font-light text-pretty text-texto">
          Elige tu modelo, mide tu talla desde la pantalla y la fabricamos para
          ti. Retiro coordinado en la Región Metropolitana o envío a regiones.
        </p>

        <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
          <Link
            href="/#coleccion"
            className="inline-flex min-h-[54px] items-center bg-tinta px-8 text-[15px] font-medium tracking-[0.14em] text-marfil uppercase hover:bg-oro-profundo"
          >
            Ver la colección
          </Link>
          <Link
            href="/medidor"
            className="inline-flex min-h-11 items-center border-b border-oro hover:text-oro-profundo"
          >
            Medir mi talla en un minuto
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-19">
        {/* Las dos fotos comparten la misma fila de la grilla para que se solapen */}
        <div className="grid grid-cols-12">
          <Image
            src="/joyas/hero-plata.jpg"
            alt="Par de argollas de plata 950 sobre mármol, una con circones"
            width={1280}
            height={1024}
            preload
            sizes="(min-width: 1024px) 45vw, 85vw"
            className="col-span-10 col-start-3 row-start-1 aspect-[5/4.3] w-full object-cover"
          />
          <Image
            src="/joyas/hero-oro.jpg"
            alt="Par de argollas de oro 18 kilates con grabado diagonal"
            width={1000}
            height={800}
            sizes="(min-width: 1024px) 27vw, 50vw"
            className="relative col-span-6 col-start-1 row-start-1 -mb-14 aspect-[5/4] w-full self-end border-8 border-marfil object-cover"
          />
        </div>

        <ul className="flex flex-wrap gap-x-10 gap-y-3 text-sm tracking-[0.04em]">
          <li className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="size-3.5 rounded-full border border-oro bg-oro-claro"
            />
            Oro 18 kilates · desde $520.000
          </li>
          <li className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="size-3.5 rounded-full border border-plata-borde bg-plata"
            />
            Plata 950 nacional · desde $78.000
          </li>
        </ul>
      </div>
    </section>
  );
}
