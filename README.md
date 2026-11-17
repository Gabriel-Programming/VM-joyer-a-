# VM Joyería — sitio B2C

Tienda de VM Joyería en Next.js 16 (App Router) y Tailwind CSS 4, conectada a un backend Medusa 2.

## Cómo levantar la tienda

Necesitas Node.js 22 LTS.

```bash
npm install
npm run dev
```

Abre http://localhost:3000. Si Medusa no está configurado o está apagado, la tienda
muestra el catálogo de respaldo (`lib/productos.ts`) y deshabilita el carrito.

## Cómo conectar Medusa (una sola vez)

Requisito: PostgreSQL instalado y con el servicio iniciado.

1. Crea el backend desde la raíz del proyecto (responde **N** a la tienda de ejemplo):

   ```bash
   npx create-medusa-app@latest backend
   ```

2. Copia el script de datos al backend:

   ```bash
   copy medusa-vm\seed-vm.ts backend\apps\backend\src\scripts\
   ```

3. En `backend/apps/backend/.env`, agrega `http://localhost:3000` al inicio de `STORE_CORS` (línea 2).

4. Carga la región Chile, el taller y el catálogo:

   ```bash
   cd backend\apps\backend
   npx medusa exec ./src/scripts/seed-vm.ts
   ```

5. Crea el archivo `.env.local` en la raíz del proyecto con las dos líneas que imprime el script al terminar.

6. Levanta el backend (`npm run dev` dentro de `backend/apps/backend`) y reinicia la tienda.

El panel de administración queda en http://localhost:9000/app.

## Páginas

| Ruta | Archivo | Qué es |
|---|---|---|
| `/` | `app/page.tsx` | Inicio |
| `/producto/[slug]` | `app/producto/[slug]/page.tsx` | Ficha de anillo con talla y stock en vivo |
| `/carrito` | `app/carrito/page.tsx` | Carrito (pedido por WhatsApp) |
| `/medidor` | `app/medidor/page.tsx` | Medidor de talla en pantalla |
| `/colgantes` | `app/colgantes/page.tsx` | Ficha de colgante (largo de cadena y dije) |

## Componentes (`components/`)

- **Inicio:** `Header`, `MenuMovil` (menú desplegable en teléfono y tablet), `Hero`, `FranjaConfianza`, `Categorias`, `Coleccion`, `TarjetaProducto`, `MedidorTeaser`, `PasosPedido`, `Contacto`, `Footer`.
- **Medidor:** `Medidor`.
- **Fichas:** `FichaAnillo`, `FichaColgante`.
- **Carrito:** `CarritoProvider` (estado compartido), `BotonCarrito` (contador de la cabecera), `Carrito`.

## Datos y lógica (`lib/`)

- `medusa.ts`: cliente de la API de tienda de Medusa.
- `catalogo.ts`: catálogo desde Medusa (en caché unos minutos) con respaldo local.
- `productos.ts`: tipos, formato de precio y catálogo de respaldo.
- `tallas.ts`: fórmula de talla (contorno en mm − 40) y talla guardada en el navegador.
- `contacto.ts`: WhatsApp e Instagram.

## Cómo funciona el stock

- Cada talla es una variante en Medusa con su propio inventario en la bodega "Taller VM Joyería".
- La ficha pide el stock en vivo cada vez que se abre: con unidades muestra "lista para despacho"; sin unidades, "se fabrica a pedido" (la variante permite venta sin stock).
- Medusa descuenta la unidad cuando se confirma un pedido. Mientras el pedido se cierre por WhatsApp, el stock se ajusta a mano en el panel (Inventario).

## Diseño adaptable

La tienda se adapta a teléfono, tablet y escritorio con los puntos de corte de Tailwind:

- **Menos de 1024 px (`lg`):** la navegación pasa al menú desplegable (`MenuMovil`).
- **Desde 768 px (`md`):** las fichas de producto muestran foto y compra lado a lado.
- **Teléfono:** la colección va en dos columnas y el medidor muestra el escenario a todo el ancho, pegado a su control.

## Paleta y tipografías

Definidas en `app/globals.css` (bloque `@theme`). Tailwind 4 no usa `tailwind.config.js`.
Las tipografías (Cormorant Garamond y Jost) se cargan en `app/layout.tsx`.

## Datos de ejemplo y pendientes

- El stock inicial del script (Modelo 17, tallas 12, 14 y 16) es de ejemplo.
- Falta el pago en línea (checkout): hoy el carrito termina en un mensaje de WhatsApp.
- La ficha de colgante usa textos entre corchetes (`[PRECIO]`, `[X mm]`) y aún no está en Medusa.
- Falta confirmar con el cliente: plazo de fabricación (`[PLAZO]`), dirección del taller y política de cambios.
- Aún no están integrados Sanity, Swiper ni PhotoSwipe.
