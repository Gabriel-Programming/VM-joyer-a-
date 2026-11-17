import {
  INSTAGRAM_URL,
  INSTAGRAM_USUARIO,
  WHATSAPP_TEXTO,
  WHATSAPP_URL,
} from "@/lib/contacto";

export default function Contacto() {
  return (
    <section className="border-t border-linea bg-arena">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-16 gap-y-8 px-8 py-20">
        <div className="flex max-w-[34em] flex-col gap-3">
          <h2 className="font-display text-[clamp(32px,3.2vw,46px)] leading-[1.08] font-medium">
            ¿Tienes un diseño en mente?
          </h2>
          <p className="text-lg font-light text-texto">
            Consulta por tu modelo y realiza tu pedido por WhatsApp, o síguenos
            en Instagram para ver más diseños.
          </p>
        </div>

        <div className="flex flex-wrap gap-3.5">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[54px] items-center gap-3 bg-[#1f6b45] px-6.5 font-medium text-white transition-colors hover:bg-[#17553a]"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 20l1.4-4.2A8 8 0 1 1 8.3 19z" />
            </svg>
            WhatsApp {WHATSAPP_TEXTO}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[54px] items-center gap-3 border border-tinta px-6.5 font-medium transition-colors hover:bg-tinta hover:text-marfil"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17" cy="7" r="0.6" />
            </svg>
            {INSTAGRAM_USUARIO}
          </a>
        </div>
      </div>
    </section>
  );
}
