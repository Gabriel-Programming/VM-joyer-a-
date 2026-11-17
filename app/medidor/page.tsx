import type { Metadata } from "next";
import Header from "@/components/Header";
import Medidor from "@/components/Medidor";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mide tu talla de anillo en pantalla · VM Joyería",
  description:
    "Calibra la pantalla con tu cédula y descubre tu talla de anillo sin imprimir nada.",
};

export default function PaginaMedidor() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Medidor />
      </main>
      <Footer />
    </>
  );
}
