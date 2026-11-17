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
          sizes="(min-width: 1024px) 23vw, (min-width: 640px) 45vw, 90vw"
          className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span
          className={`text-xs tracking-[0.16em] uppercase ${colorMetal}`}
        >
          {MATERIAL[producto.metal]}
        </span>
        <span className="font-display text-[27px] leading-tight">
          {producto.nombre}
        </span>
        <span className="flex items-baseline justify-between gap-3">
          <span className="text-lg font-medium">
            {formatoPrecio(producto.precio)}
          </span>
          <span className="text-[13.5px] text-texto">A pedido</span>
        </span>
      </span>
    </Link>
  );
}
