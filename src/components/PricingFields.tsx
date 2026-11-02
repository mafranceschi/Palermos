"use client";

import { useState } from "react";
import { Paintbrush, TrendingDown, TrendingUp } from "lucide-react";
import {
  formatMoney,
  formatMoneyInput,
  parseCount,
  parseMoney,
  PRICING_FIELDS,
  summarizePricing,
  type JobPricing,
} from "@/lib/pricing";
import { inputBase } from "@/lib/ui";

const label = "text-xs font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400";

// Campos de costos de pintura con la cuenta en vivo. Solo se renderiza para
// admin. Los valores viajan en el form con los nombres de PRICING_FIELDS.
export function PricingFields({
  initial,
  painterOptions,
}: {
  initial: JobPricing;
  painterOptions: string[];
}) {
  const [panels, setPanels] = useState(initial.panels?.toString() ?? "");
  const [panelPrice, setPanelPrice] = useState(
    initial.panel_price != null ? initial.panel_price.toLocaleString("es-AR") : ""
  );
  const [clientPrice, setClientPrice] = useState(
    initial.client_price != null ? initial.client_price.toLocaleString("es-AR") : ""
  );

  const summary = summarizePricing({
    panels: parseCount(panels),
    panel_price: parseMoney(panelPrice),
    client_price: parseMoney(clientPrice),
  });
  const negative = summary.profit != null && summary.profit < 0;

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={PRICING_FIELDS.painter} className={label}>
          Pintor
        </label>
        <div className="relative mt-1">
          <Paintbrush className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            id={PRICING_FIELDS.painter}
            name={PRICING_FIELDS.painter}
            defaultValue={initial.painter ?? ""}
            list="painter-options"
            placeholder="¿Quién lo pintó?"
            autoComplete="off"
            className={`w-full py-2.5 pl-10 pr-4 ${inputBase}`}
          />
          {/* Sugiere los pintores ya cargados para escribirlos siempre igual. */}
          <datalist id="painter-options">
            {painterOptions.map((name) => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <div>
          <label htmlFor={PRICING_FIELDS.panels} className={label}>
            Cantidad de paños
          </label>
          <input
            id={PRICING_FIELDS.panels}
            name={PRICING_FIELDS.panels}
            inputMode="numeric"
            placeholder="Ej: 3"
            value={panels}
            onChange={(e) => setPanels(e.target.value.replace(/\D/g, ""))}
            className={`mt-1 w-full px-4 py-2.5 ${inputBase}`}
          />
        </div>
        <div>
          <label htmlFor={PRICING_FIELDS.panelPrice} className={label}>
            Valor del paño
          </label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              $
            </span>
            <input
              id={PRICING_FIELDS.panelPrice}
              name={PRICING_FIELDS.panelPrice}
              inputMode="numeric"
              placeholder="0"
              value={panelPrice}
              onChange={(e) => setPanelPrice(formatMoneyInput(e.target.value))}
              className={`w-full py-2.5 pl-8 pr-4 ${inputBase}`}
            />
          </div>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label htmlFor={PRICING_FIELDS.clientPrice} className={label}>
            Cobrar al cliente
          </label>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-neutral-400">
              $
            </span>
            <input
              id={PRICING_FIELDS.clientPrice}
              name={PRICING_FIELDS.clientPrice}
              inputMode="numeric"
              placeholder="0"
              value={clientPrice}
              onChange={(e) => setClientPrice(formatMoneyInput(e.target.value))}
              className={`w-full py-2.5 pl-8 pr-4 ${inputBase}`}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-neutral-100 px-4 py-3 dark:bg-white/5">
          <p className={label}>Costo del pintor</p>
          <p className="mt-1 text-lg font-extrabold tabular-nums text-navy-900 dark:text-white">
            {summary.painterCost != null ? formatMoney(summary.painterCost) : "—"}
          </p>
          {summary.painterCost != null && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {parseCount(panels)} × {formatMoney(parseMoney(panelPrice) ?? 0)}
            </p>
          )}
        </div>
        <div
          className={`rounded-2xl px-4 py-3 ${
            summary.profit == null
              ? "bg-neutral-100 dark:bg-white/5"
              : negative
                ? "bg-red-50 dark:bg-red-500/10"
                : "bg-emerald-50 dark:bg-emerald-500/10"
          }`}
        >
          <p className={label}>Ganancia</p>
          <p
            className={`mt-1 flex items-center gap-1.5 text-lg font-extrabold tabular-nums ${
              summary.profit == null
                ? "text-navy-900 dark:text-white"
                : negative
                  ? "text-red-600 dark:text-red-400"
                  : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {summary.profit != null && (negative ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />)}
            {summary.profit != null ? formatMoney(summary.profit) : "—"}
          </p>
          {summary.margin != null && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {Math.round(summary.margin * 100)}% de lo que se cobra
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
