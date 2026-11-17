import type { Metadata } from "next";
import Header from "@/components/Header";
import FichaColgante from "@/components/FichaColgante";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Colgantes y cadenas · VM Joyería",
};

export default function PaginaColgantes() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <FichaColgante />
      </main>
      <Footer />
    </>
  );
}
