// Costos de pintura de un trabajo (solo para admin). Montos en pesos.
export type JobPricing = {
  panels: number | null; // cantidad de paños
  panel_price: number | null; // lo que cobra el pintor por paño
  client_price: number | null; // lo que se le cobra al cliente
};

export const EMPTY_PRICING: JobPricing = { panels: null, panel_price: null, client_price: null };

export type PricingSummary = {
  painterCost: number | null; // paños × valor del paño
  profit: number | null; // cobro al cliente − costo del pintor
  margin: number | null; // ganancia / cobro al cliente (0..1)
};

export function summarizePricing(p: JobPricing): PricingSummary {
  const painterCost =
    p.panels != null && p.panel_price != null ? p.panels * p.panel_price : null;
  const profit =
    p.client_price != null && painterCost != null ? p.client_price - painterCost : null;
  const margin =
    profit != null && p.client_price ? profit / p.client_price : null;
  return { painterCost, profit, margin };
}

export function hasPricing(p: JobPricing | null | undefined): boolean {
  return !!p && (p.panels != null || p.panel_price != null || p.client_price != null);
}

const moneyFormat = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function formatMoney(value: number): string {
  return moneyFormat.format(value);
}

// "50.000", "$ 50.000", "50000" -> 50000. Vacío -> null. Se trabaja en pesos
// enteros: los centavos no se usan en el taller.
export function parseMoney(raw: string): number | null {
  const digits = raw.split(",")[0].replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

// Para mostrar en un campo mientras se escribe: 50000 -> "50.000".
export function formatMoneyInput(raw: string): string {
  const value = parseMoney(raw);
  return value == null ? "" : value.toLocaleString("es-AR");
}

export function parseCount(raw: string): number | null {
  const digits = raw.replace(/\D/g, "");
  return digits ? Number(digits) : null;
}

// Nombres de los campos en los formularios.
export const PRICING_FIELDS = {
  panels: "paint_panels",
  panelPrice: "paint_panel_price",
  clientPrice: "paint_client_price",
} as const;

export function pricingFromForm(formData: FormData): JobPricing {
  const get = (key: string) => {
    const v = formData.get(key);
    return typeof v === "string" ? v : "";
  };
  return {
    panels: parseCount(get(PRICING_FIELDS.panels)),
    panel_price: parseMoney(get(PRICING_FIELDS.panelPrice)),
    client_price: parseMoney(get(PRICING_FIELDS.clientPrice)),
  };
}
