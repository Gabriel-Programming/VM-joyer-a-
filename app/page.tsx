import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FranjaConfianza from "@/components/FranjaConfianza";
import Categorias from "@/components/Categorias";
import Coleccion from "@/components/Coleccion";
import MedidorTeaser from "@/components/MedidorTeaser";
import PasosPedido from "@/components/PasosPedido";
import Contacto from "@/components/Contacto";
import Footer from "@/components/Footer";
import { obtenerCatalogo } from "@/lib/catalogo";

export default async function Home() {
  const productos = await obtenerCatalogo();

  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <FranjaConfianza />
        <Categorias />
        <Coleccion productos={productos} />
        <MedidorTeaser />
        <PasosPedido />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
