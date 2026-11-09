import type {
  CampaignRow,
  CampaignSummary,
  CsvIssue,
  DailyPoint,
  DateRangeKey,
  Totals,
} from "./types";

/** Divides only when the denominator is positive; otherwise returns null. */
function safeRatio(numerator: number, denominator: number): number | null {
  return denominator > 0 ? numerator / denominator : null;
}

export function computeTotals(rows: CampaignRow[]): Totals {
  const sum = rows.reduce(
    (acc, row) => ({
      impressions: acc.impressions + row.impressions,
      clicks: acc.clicks + row.clicks,
      conversions: acc.conversions + row.conversions,
      spend: acc.spend + row.spend,
    }),
    { impressions: 0, clicks: 0, conversions: 0, spend: 0 },
  );

  return {
    ...sum,
    ctr: safeRatio(sum.clicks, sum.impressions),
    conversionRate: safeRatio(sum.conversions, sum.clicks),
    costPerConversion: safeRatio(sum.spend, sum.conversions),
  };
}

export function computeCampaignSummaries(rows: CampaignRow[]): CampaignSummary[] {
  const groups = new Map<string, CampaignRow[]>();
  for (const row of rows) {
    const existing = groups.get(row.campaign);
    if (existing) existing.push(row);
    else groups.set(row.campaign, [row]);
  }

  return Array.from(groups.entries())
    .map(([name, groupRows]) => ({ name, ...computeTotals(groupRows) }))
    .sort((a, b) => b.impressions - a.impressions);
}

/** Sums impressions and clicks per date, sorted oldest first. Rows without dates are ignored. */
export function computeDailySeries(rows: CampaignRow[]): DailyPoint[] {
  const byDate = new Map<string, DailyPoint>();
  for (const row of rows) {
    if (!row.date) continue;
    const point = byDate.get(row.date) ?? { date: row.date, impressions: 0, clicks: 0 };
    point.impressions += row.impressions;
    point.clicks += row.clicks;
    byDate.set(row.date, point);
  }
  return Array.from(byDate.values()).sort((a, b) => a.date.localeCompare(b.date));
}

const DAY_MS = 24 * 60 * 60 * 1000;

function toUtcMs(isoDate: string): number {
  return Date.parse(`${isoDate}T00:00:00Z`);
}

/** The most recent date in the dataset, or null when there are no dates. */
export function latestDate(rows: CampaignRow[]): string | null {
  let latest: string | null = null;
  for (const row of rows) {
    if (row.date && (latest === null || row.date > latest)) latest = row.date;
  }
  return latest;
}

/**
 * Keeps rows inside the selected window ending on the latest date in the data.
 * "all" returns every row, including rows without dates.
 */
export function filterByRange(rows: CampaignRow[], range: DateRangeKey): CampaignRow[] {
  if (range === "all") return rows;
  const end = latestDate(rows);
  if (!end) return rows;
  const days = range === "7d" ? 7 : 30;
  const startMs = toUtcMs(end) - (days - 1) * DAY_MS;
  return rows.filter((row) => row.date !== null && toUtcMs(row.date) >= startMs);
}

/** The window of the same length immediately before the selected range, for comparisons. */
export function filterPreviousRange(rows: CampaignRow[], range: DateRangeKey): CampaignRow[] {
  if (range === "all") return [];
  const end = latestDate(rows);
  if (!end) return [];
  const days = range === "7d" ? 7 : 30;
  const endMs = toUtcMs(end) - days * DAY_MS;
  const startMs = endMs - (days - 1) * DAY_MS;
  return rows.filter((row) => {
    if (row.date === null) return false;
    const ms = toUtcMs(row.date);
    return ms >= startMs && ms <= endMs;
  });
}

/** Percentage change from previous to current, or null when it cannot be judged. */
export function percentChange(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export function summariseIssues(issues: CsvIssue[]): string {
  return issues.map((issue) => (issue.line ? `Line ${issue.line}: ${issue.message}` : issue.message)).join(" ");
}
