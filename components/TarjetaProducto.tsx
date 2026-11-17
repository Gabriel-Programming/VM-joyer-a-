import Image from "next/image";
import Link from "next/link";
import { MATERIAL, formatoPrecio, type Producto } from "@/lib/productos";

export default function TarjetaProducto({ producto }: { producto: Producto }) {
  const colorMetal =
    producto.metal === "oro" ? "text-oro-profundo" : "text-plata-profunda";

  return (
    <Link
      href={`/producto/${producto.slug}`}
      className="group flex flex-col gap-3.5"
    >
      <span className="block overflow-hidden">
        <Image
          src={producto.imagen}
          alt={producto.alt}
          width={producto.ancho}
          height={producto.alto}
          sizes="(min-width: 1024px) 23vw, 45vw"
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span
          className={`text-[11px] tracking-[0.12em] uppercase sm:text-xs sm:tracking-[0.16em] ${colorMetal}`}
        >
          {MATERIAL[producto.metal]}
        </span>
        <span className="font-display text-[22px] leading-tight sm:text-[27px]">
          {producto.nombre}
        </span>
        <span className="flex flex-wrap items-baseline justify-between gap-x-3">
          <span className="text-base font-medium sm:text-lg">
            {formatoPrecio(producto.precio)}
          </span>
          <span className="text-[13.5px] text-texto">A pedido</span>
        </span>
      </span>
    </Link>
  );
}
