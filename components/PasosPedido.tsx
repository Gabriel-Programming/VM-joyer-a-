const pasos = [
  {
    titulo: "Selecciona tu modelo",
    texto: "Escoge el diseño del catálogo en plata 950 u oro 18 kilates.",
  },
  {
    titulo: "Toma tu medida",
    texto: "Usa el medidor en pantalla y confirma tu talla antes de fabricar.",
  },
  {
    titulo: "Elige tu medio de pago",
    texto: "Efectivo, transferencia bancaria, tarjeta de débito o crédito.",
  },
  {
    titulo: "Coordina tu entrega",
    texto:
      "Región Metropolitana: entrega presencial coordinada o envío. Regiones: Starken, Blue Express o Chilexpress.",
  },
];

export default function PasosPedido() {
  return (
    <section
      id="como-comprar"
      className="mx-auto flex max-w-7xl flex-col gap-14 px-8 pt-26 pb-24"
    >
      <h2 className="titulo-seccion">Cómo realizar tu pedido</h2>
      <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {pasos.map((p, i) => (
          <li
            key={p.titulo}
            className="flex flex-col gap-3 border-t border-oro pt-5"
          >
            <span
              aria-hidden="true"
              className="font-display text-[54px] leading-none text-oro-profundo italic"
            >
              {i + 1}
            </span>
            <strong className="text-[19px] font-medium">{p.titulo}</strong>
            <span className="text-base text-texto">{p.texto}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
