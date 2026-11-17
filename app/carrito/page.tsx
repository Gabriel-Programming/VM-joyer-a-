import type { Metadata } from "next";
import Header from "@/components/Header";
import Carrito from "@/components/Carrito";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Tu carrito · VM Joyería",
};

export default function PaginaCarrito() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Carrito />
      </main>
      <Footer />
    </>
  );
}
