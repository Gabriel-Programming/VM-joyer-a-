import Link from "next/link";

export default function MedidorTeaser() {
  return (
    <section className="bg-tinta text-marfil">
      <div className="mx-auto grid max-w-7xl items-center gap-x-20 gap-y-12 px-5 py-16 sm:px-8 lg:py-26 lg:grid-cols-2">
        <div className="flex flex-col gap-6.5">
          <span className="etiqueta text-oro-claro">Toma de medida virtual</span>
          <h2 className="font-display text-[clamp(38px,4vw,58px)] leading-[1.04] font-medium text-balance">
            Tu talla en un minuto, sin imprimir nada.
          </h2>
          <p className="max-w-[30em] text-lg font-light text-pretty text-[#b9b2a6]">
            Calibra la pantalla con tu cédula o una tarjeta, apoya un anillo
            que te quede bien y ajusta el círculo hasta que calce. La talla
            queda guardada para tu pedido.
          </p>
          <div className="flex">
            <Link
              href="/medidor"
              className="inline-flex min-h-[54px] items-center border border-oro-claro px-8 text-[15px] font-medium tracking-[0.14em] text-oro-claro uppercase transition-colors hover:bg-oro-claro hover:text-tinta"
            >
              Abrir el medidor
            </Link>
          </div>
        </div>

        <div
          role="img"
          aria-label="Ilustración del medidor: un círculo de 17,2 milímetros equivale a la talla 14"
          className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8 border border-[#4a4338] px-6 py-10 sm:px-8 sm:py-14"
        >
          <div className="flex size-44 items-center justify-center rounded-full border-[18px] border-[#c9a45c] sm:size-52 sm:border-[22px]">
            <div className="flex w-full justify-center border-t border-dashed border-marfil">
              <span className="mt-2 text-[15px] tracking-[0.06em]">17,2 mm</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="etiqueta font-normal text-[#b9b2a6]">Tu talla</span>
            <span className="font-display text-[96px] leading-[0.9] text-oro-claro sm:text-[120px]">
              14
            </span>
            <span className="text-[15px] text-[#b9b2a6]">Contorno de 54 mm</span>
          </div>
        </div>
      </div>
    </section>
  );
}
