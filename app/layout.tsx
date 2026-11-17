import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/components/CarritoProvider";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VM Joyería · Argollas en plata 950 y oro 18K",
  description:
    "Argollas y anillos hechos a pedido en plata 950 nacional y oro 18 kilates. Despachos a regiones.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${jost.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-marfil font-sans text-[17px] leading-relaxed text-tinta">
        <CarritoProvider>{children}</CarritoProvider>
      </body>
    </html>
  );
}
