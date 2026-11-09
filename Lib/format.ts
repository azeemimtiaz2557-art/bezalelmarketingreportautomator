const numberFormat = new Intl.NumberFormat("en-US");
const compactFormat = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });
const percentFormat = new Intl.NumberFormat("en-US", { style: "percent", maximumFractionDigits: 2 });

/** Currency is shown without a symbol so the format works for any account currency. */
const moneyFormat = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatNumber = (value: number) => numberFormat.format(value);
export const formatCompact = (value: number) => compactFormat.format(value);
export const formatPercent = (value: number | null) => (value === null ? "—" : percentFormat.format(value));
export const formatMoney = (value: number | null) => (value === null ? "—" : moneyFormat.format(value));

export function formatDelta(change: number | null): string {
  if (change === null) return "No comparison";
  const sign = change > 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}% vs previous`;
}

export function formatShortDate(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}
