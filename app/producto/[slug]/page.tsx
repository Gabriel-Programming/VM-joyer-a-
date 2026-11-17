import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import FichaAnillo from "@/components/FichaAnillo";
import Footer from "@/components/Footer";
import { MATERIAL } from "@/lib/productos";
import { obtenerCatalogo, obtenerProducto } from "@/lib/catalogo";

type Props = { params: Promise<{ slug: string }> };

// Una página estática por cada producto del catálogo.
export async function generateStaticParams() {
  return (await obtenerCatalogo()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const producto = await obtenerProducto(slug);
  if (!producto) return {};
  return {
    title: `${producto.nombre} · ${MATERIAL[producto.metal]} · VM Joyería`,
    description: producto.alt,
  };
}

export default async function PaginaProducto({ params }: Props) {
  const { slug } = await params;
  const producto = await obtenerProducto(slug);
  if (!producto) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <FichaAnillo producto={producto} />
      </main>
      <Footer />
    </>
  );
}
