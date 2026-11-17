const puntos = [
  {
    titulo: "Fabricado a pedido",
    texto: "Cada pieza se hace en tu talla exacta.",
    icono: (
      <>
        <path d="M6 3h12l3 6-9 12L3 9z" />
        <path d="M3 9h18" />
        <path d="M9 3l-1.5 6L12 21l4.5-12L15 3" />
      </>
    ),
  },
  {
    titulo: "Plata 950 y oro 18K",
    texto: "Plata nacional y oro de 18 kilates.",
    icono: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="5" />
      </>
    ),
  },
  {
    titulo: "Envíos a regiones",
    texto: "Starken, Blue Express o Chilexpress.",
    icono: (
      <>
        <path d="M2 7h11v9H2z" />
        <path d="M13 10h4l4 3v3h-8" />
        <circle cx="6.5" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
      </>
    ),
  },
  {
    titulo: "Paga como prefieras",
    texto: "Transferencia, débito, crédito o efectivo.",
    icono: (
      <>
        <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
        <path d="M2.5 10h19" />
        <path d="M6 15h4" />
      </>
    ),
  },
];

export default function FranjaConfianza() {
  return (
    <section
      aria-label="Cómo trabajamos"
      className="border-y border-linea bg-papel"
    >
      <ul className="mx-auto grid max-w-7xl gap-x-8 gap-y-6 px-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {puntos.map((p) => (
          <li key={p.titulo} className="flex items-start gap-3.5">
            <svg
              aria-hidden="true"
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 flex-none text-oro-profundo"
            >
              {p.icono}
            </svg>
            <div className="flex flex-col gap-0.5">
              <strong className="font-medium">{p.titulo}</strong>
              <span className="text-[15px] text-texto">{p.texto}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
