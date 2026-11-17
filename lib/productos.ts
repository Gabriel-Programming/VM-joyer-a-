export type Metal = "plata" | "oro";

export type Producto = {
  slug: string;
  nombre: string;
  metal: Metal;
  precio: number;
  imagen: string;
  ancho: number;
  alto: number;
  alt: string;
  /** Se muestra en el inicio cuando el filtro está en "Todo". */
  destacado?: boolean;
};

export const MATERIAL: Record<Metal, string> = {
  plata: "Plata 950 nacional",
  oro: "Oro 18 kilates",
};

// Catálogo de respaldo: se usa solo si Medusa no está configurado o no responde.
// La fuente real es Medusa (ver lib/catalogo.ts). Modelos y precios de los
// catálogos de VM Joyería (plata 950 y oro 18K).
export const productos: Producto[] = [
  { slug: "plata-modelo-40", nombre: "Modelo 40", metal: "plata", precio: 150000, imagen: "/joyas/hero-plata.jpg", ancho: 1280, alto: 1024, alt: "Argollas de plata Modelo 40, una con circones", destacado: true },
  { slug: "plata-modelo-44", nombre: "Modelo 44", metal: "plata", precio: 150000, imagen: "/joyas/plata-m44.jpg", ancho: 1280, alto: 1170, alt: "Argollas de plata Modelo 44 con trenzado oscuro", destacado: true },
  { slug: "plata-modelo-46", nombre: "Modelo 46", metal: "plata", precio: 200000, imagen: "/joyas/plata-m46.jpg", ancho: 1280, alto: 1170, alt: "Argollas de plata Modelo 46 con franja texturada", destacado: true },
  { slug: "plata-modelo-43", nombre: "Modelo 43", metal: "plata", precio: 185000, imagen: "/joyas/plata-m43.jpg", ancho: 1280, alto: 1170, alt: "Anillos de plata Modelo 43, solitario y argolla en V", destacado: true },
  { slug: "plata-modelo-41", nombre: "Modelo 41", metal: "plata", precio: 180000, imagen: "/joyas/plata-m41.jpg", ancho: 1280, alto: 1280, alt: "Argollas de plata Modelo 41 apiladas sobre mármol" },
  { slug: "plata-modelo-47", nombre: "Modelo 47", metal: "plata", precio: 155000, imagen: "/joyas/plata-m47.jpg", ancho: 1280, alto: 1170, alt: "Argollas de plata Modelo 47 con grabado de hojas" },
  { slug: "plata-modelo-17", nombre: "Modelo 17", metal: "plata", precio: 228800, imagen: "/joyas/plata-m17.jpg", ancho: 1152, alto: 1280, alt: "Anillo solitario de plata Modelo 17 con piedra central y nudos laterales" },
  { slug: "plata-modelo-21", nombre: "Modelo 21", metal: "plata", precio: 231400, imagen: "/joyas/plata-m21.jpg", ancho: 1280, alto: 1280, alt: "Anillo de sello de plata Modelo 21 con nudo celta" },
  { slug: "oro-o18-01", nombre: "Modelo O18-01", metal: "oro", precio: 1400000, imagen: "/joyas/hero-oro.jpg", ancho: 1000, alto: 800, alt: "Argollas de oro 18 kilates Modelo O18-01 con grabado diagonal", destacado: true },
  { slug: "oro-o18-04", nombre: "Modelo O18-04", metal: "oro", precio: 650000, imagen: "/joyas/oro-o04.jpg", ancho: 1000, alto: 800, alt: "Argollas de oro 18 kilates Modelo O18-04, lisas", destacado: true },
  { slug: "oro-o18-12", nombre: "Modelo O18-12", metal: "oro", precio: 1440000, imagen: "/joyas/oro-o12.jpg", ancho: 1000, alto: 800, alt: "Argollas de oro 18 kilates Modelo O18-12 con hilera de circones", destacado: true },
  { slug: "oro-o18-18", nombre: "Modelo O18-18", metal: "oro", precio: 2300000, imagen: "/joyas/oro-o18.jpg", ancho: 1000, alto: 800, alt: "Conjunto de oro 18 kilates Modelo O18-18, solitario y dos argollas", destacado: true },
  { slug: "oro-o18-10", nombre: "Modelo O18-10", metal: "oro", precio: 1120000, imagen: "/joyas/oro-o10.jpg", ancho: 1000, alto: 800, alt: "Argollas de oro 18 kilates Modelo O18-10, una lisa y una con circones" },
  { slug: "oro-o18-21", nombre: "Modelo O18-21", metal: "oro", precio: 2120000, imagen: "/joyas/oro-o21.jpg", ancho: 1000, alto: 885, alt: "Argollas de oro 18 kilates Modelo O18-21" },
];

/** 150000 -> "$150.000" (formato chileno, igual en servidor y navegador). */
export function formatoPrecio(valor: number): string {
  return "$" + valor.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
