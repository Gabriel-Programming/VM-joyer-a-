/**
 * Datos iniciales de VM Joyería: región Chile (CLP), taller como bodega y el
 * catálogo de anillos con una variante por talla.
 *
 *   npx medusa exec ./src/scripts/seed-vm.ts
 *
 * Se puede volver a ejecutar: lo que ya existe se omite.
 */
import {
  createInventoryLevelsWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createStockLocationsWorkflow,
  deleteProductsWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import type { ExecArgs } from "@medusajs/framework/types";

// URL de la tienda Next.js: las fotos viven en su carpeta public/joyas.
const TIENDA_URL = process.env.TIENDA_URL || "http://localhost:3000";

const TALLA_MIN = 8;
const TALLA_MAX = 24;
const TALLAS = Array.from(
  { length: TALLA_MAX - TALLA_MIN + 1 },
  (_, i) => String(TALLA_MIN + i)
);

const NOMBRE_TALLER = "Taller VM Joyería";
const PRODUCTOS_DEMO = ["t-shirt", "sweatshirt", "sweatpants", "shorts"];

type Joya = {
  handle: string;
  titulo: string;
  metal: "plata" | "oro";
  precio: number; // CLP, precio final del catálogo
  imagen: string;
  ancho: number;
  alto: number;
  alt: string;
  destacado?: boolean;
  /** Unidades terminadas por talla. STOCK DE EJEMPLO: ajustar al inventario real. */
  stock?: Record<string, number>;
};

// Modelos y precios de los catálogos de plata 950 y oro 18K.
const JOYAS: Joya[] = [
  { handle: "plata-modelo-40", titulo: "Modelo 40", metal: "plata", precio: 150000, imagen: "/joyas/hero-plata.jpg", ancho: 1280, alto: 1024, alt: "Argollas de plata Modelo 40, una con circones", destacado: true },
  { handle: "plata-modelo-44", titulo: "Modelo 44", metal: "plata", precio: 150000, imagen: "/joyas/plata-m44.jpg", ancho: 1280, alto: 1170, alt: "Argollas de plata Modelo 44 con trenzado oscuro", destacado: true },
  { handle: "plata-modelo-46", titulo: "Modelo 46", metal: "plata", precio: 200000, imagen: "/joyas/plata-m46.jpg", ancho: 1280, alto: 1170, alt: "Argollas de plata Modelo 46 con franja texturada", destacado: true },
  { handle: "plata-modelo-43", titulo: "Modelo 43", metal: "plata", precio: 185000, imagen: "/joyas/plata-m43.jpg", ancho: 1280, alto: 1170, alt: "Anillos de plata Modelo 43, solitario y argolla en V", destacado: true },
  { handle: "plata-modelo-41", titulo: "Modelo 41", metal: "plata", precio: 180000, imagen: "/joyas/plata-m41.jpg", ancho: 1280, alto: 1280, alt: "Argollas de plata Modelo 41 apiladas sobre mármol" },
  { handle: "plata-modelo-47", titulo: "Modelo 47", metal: "plata", precio: 155000, imagen: "/joyas/plata-m47.jpg", ancho: 1280, alto: 1170, alt: "Argollas de plata Modelo 47 con grabado de hojas" },
  { handle: "plata-modelo-17", titulo: "Modelo 17", metal: "plata", precio: 228800, imagen: "/joyas/plata-m17.jpg", ancho: 1152, alto: 1280, alt: "Anillo solitario de plata Modelo 17 con piedra central y nudos laterales", stock: { "12": 2, "14": 1, "16": 3 } },
  { handle: "plata-modelo-21", titulo: "Modelo 21", metal: "plata", precio: 231400, imagen: "/joyas/plata-m21.jpg", ancho: 1280, alto: 1280, alt: "Anillo de sello de plata Modelo 21 con nudo celta" },
  { handle: "oro-o18-01", titulo: "Modelo O18-01", metal: "oro", precio: 1400000, imagen: "/joyas/hero-oro.jpg", ancho: 1000, alto: 800, alt: "Argollas de oro 18 kilates Modelo O18-01 con grabado diagonal", destacado: true },
  { handle: "oro-o18-04", titulo: "Modelo O18-04", metal: "oro", precio: 650000, imagen: "/joyas/oro-o04.jpg", ancho: 1000, alto: 800, alt: "Argollas de oro 18 kilates Modelo O18-04, lisas", destacado: true },
  { handle: "oro-o18-12", titulo: "Modelo O18-12", metal: "oro", precio: 1440000, imagen: "/joyas/oro-o12.jpg", ancho: 1000, alto: 800, alt: "Argollas de oro 18 kilates Modelo O18-12 con hilera de circones", destacado: true },
  { handle: "oro-o18-18", titulo: "Modelo O18-18", metal: "oro", precio: 2300000, imagen: "/joyas/oro-o18.jpg", ancho: 1000, alto: 800, alt: "Conjunto de oro 18 kilates Modelo O18-18, solitario y dos argollas", destacado: true },
  { handle: "oro-o18-10", titulo: "Modelo O18-10", metal: "oro", precio: 1120000, imagen: "/joyas/oro-o10.jpg", ancho: 1000, alto: 800, alt: "Argollas de oro 18 kilates Modelo O18-10, una lisa y una con circones" },
  { handle: "oro-o18-21", titulo: "Modelo O18-21", metal: "oro", precio: 2120000, imagen: "/joyas/oro-o21.jpg", ancho: 1000, alto: 885, alt: "Argollas de oro 18 kilates Modelo O18-21" },
];

const MATERIAL = { plata: "Plata 950 nacional", oro: "Oro 18 kilates" };

export default async function seedVm({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const link = container.resolve(ContainerRegistrationKeys.LINK);

  // ---- Lo que ya creó la instalación de Medusa ------------------------------
  const { data: stores } = await query.graph({
    entity: "store",
    fields: ["id", "supported_currencies.currency_code"],
  });
  const { data: salesChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
  });
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  });
  const store = stores[0];
  const salesChannel = salesChannels[0];
  const shippingProfile = shippingProfiles[0];
  if (!store || !salesChannel || !shippingProfile) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Falta la tienda, el canal de venta o el perfil de envío. Ejecuta primero las migraciones (npx medusa db:migrate)."
    );
  }

  // ---- Moneda: pesos chilenos por defecto -----------------------------------
  const monedas = (store.supported_currencies ?? [])
    .map((m) => m?.currency_code)
    .filter((c): c is string => Boolean(c));
  if (!monedas.includes("clp")) {
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          name: "VM Joyería",
          supported_currencies: [
            { currency_code: "clp", is_default: true },
            ...monedas.map((currency_code) => ({ currency_code })),
          ],
        },
      },
    });
    logger.info("Moneda CLP agregada como predeterminada.");
  }

  // ---- Región Chile ----------------------------------------------------------
  const { data: regiones } = await query.graph({
    entity: "region",
    fields: ["id", "name", "countries.iso_2"],
  });
  const yaHayChile = regiones.some((r) =>
    (r.countries ?? []).some((p) => p?.iso_2 === "cl")
  );
  if (!yaHayChile) {
    await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "Chile",
            currency_code: "clp",
            countries: ["cl"],
            payment_providers: ["pp_system_default"],
          },
        ],
      },
    });
    logger.info("Región Chile creada.");
  }

  // ---- Bodega: el taller ------------------------------------------------------
  const { data: bodegas } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  });
  let taller = bodegas.find((b) => b.name === NOMBRE_TALLER);
  if (!taller) {
    const { result } = await createStockLocationsWorkflow(container).run({
      input: {
        locations: [
          {
            name: NOMBRE_TALLER,
            address: { city: "Santiago", country_code: "CL", address_1: "" },
          },
        ],
      },
    });
    taller = result[0];
    await link.create({
      [Modules.STOCK_LOCATION]: { stock_location_id: taller.id },
      [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
    });
    await linkSalesChannelsToStockLocationWorkflow(container).run({
      input: { id: taller.id, add: [salesChannel.id] },
    });
    logger.info("Bodega del taller creada y conectada al canal de venta.");
  }

  // ---- Fuera los productos de demostración -----------------------------------
  const { data: demo } = await query.graph({
    entity: "product",
    fields: ["id"],
    filters: { handle: PRODUCTOS_DEMO },
  });
  if (demo.length) {
    await deleteProductsWorkflow(container).run({
      input: { ids: demo.map((p) => p.id) },
    });
    logger.info(`${demo.length} productos de demostración eliminados.`);
  }

  // ---- Catálogo ----------------------------------------------------------------
  const { data: existentes } = await query.graph({
    entity: "product",
    fields: ["handle"],
    filters: { handle: JOYAS.map((j) => j.handle) },
  });
  const yaCreados = new Set(existentes.map((p) => p.handle));
  const nuevas = JOYAS.filter((j) => !yaCreados.has(j.handle));

  if (nuevas.length) {
    const { data: opciones } = await query.graph({
      entity: "product_option",
      fields: ["id", "title", "is_exclusive"],
      filters: { title: "Talla" },
    });
    let opcionTalla = opciones.find((o) => !o.is_exclusive);
    if (!opcionTalla) {
      const { result } = await createProductOptionsWorkflow(container).run({
        input: { product_options: [{ title: "Talla", values: TALLAS }] },
      });
      opcionTalla = result[0];
    }

    await createProductsWorkflow(container).run({
      input: {
        products: nuevas.map((j) => ({
          title: j.titulo,
          handle: j.handle,
          description: j.alt,
          material: MATERIAL[j.metal],
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: TIENDA_URL + j.imagen,
          images: [{ url: TIENDA_URL + j.imagen }],
          // La tienda lee estos datos para pintar la tarjeta y la ficha.
          metadata: {
            metal: j.metal,
            imagen: j.imagen,
            ancho: j.ancho,
            alto: j.alto,
            alt: j.alt,
            destacado: Boolean(j.destacado),
          },
          options: [{ id: opcionTalla!.id }],
          variants: TALLAS.map((talla) => ({
            title: `Talla ${talla}`,
            sku: `${j.handle}-t${talla}`.toUpperCase(),
            options: { Talla: talla },
            prices: [{ amount: j.precio, currency_code: "clp" }],
            // Stock real por talla; sin stock se vende igual: se fabrica a pedido.
            manage_inventory: true,
            allow_backorder: true,
          })),
          sales_channels: [{ id: salesChannel.id }],
        })),
      },
    });
    logger.info(`${nuevas.length} joyas creadas con ${TALLAS.length} tallas cada una.`);

    // ---- Stock por talla en el taller ----------------------------------------
    const { data: variantes } = await query.graph({
      entity: "variant",
      fields: ["sku", "inventory_items.inventory_item_id"],
      filters: {
        sku: nuevas.flatMap((j) =>
          TALLAS.map((t) => `${j.handle}-t${t}`.toUpperCase())
        ),
      },
    });
    const stockPorSku = new Map<string, number>();
    for (const j of nuevas) {
      for (const t of TALLAS) {
        stockPorSku.set(`${j.handle}-t${t}`.toUpperCase(), j.stock?.[t] ?? 0);
      }
    }
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: variantes.flatMap((v) =>
          (v.inventory_items ?? []).map((item) => ({
            location_id: taller!.id,
            inventory_item_id: item!.inventory_item_id,
            stocked_quantity: stockPorSku.get(v.sku ?? "") ?? 0,
          }))
        ),
      },
    });
    logger.info("Stock por talla cargado en el taller.");
  } else {
    logger.info("El catálogo ya estaba cargado: no se creó nada.");
  }

  // ---- Clave pública para la tienda -------------------------------------------
  const { data: claves } = await query.graph({
    entity: "api_key",
    fields: ["token", "title"],
    filters: { type: "publishable" },
  });
  logger.info("Listo. Copia esta línea en el archivo .env.local de la tienda:");
  logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${claves[0]?.token}`);
}
