/** One validated row from an uploaded campaign CSV. No personal data fields exist by design. */
export type CampaignRow = {
  campaign: string;
  /** ISO date (YYYY-MM-DD) or null when the file has no date column. */
  date: string | null;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
};

export type Dataset = {
  rows: CampaignRow[];
  /** Name shown to the user, e.g. "Sample data" or the uploaded file name. */
  sourceLabel: string;
  isSample: boolean;
  hasDates: boolean;
};

export type DateRangeKey = "all" | "7d" | "30d";

export type Totals = {
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  /** Null when there are no impressions. */
  ctr: number | null;
  /** Null when there are no clicks. */
  conversionRate: number | null;
  /** Null when there are no conversions, so we never show a misleading value. */
  costPerConversion: number | null;
};

export type CampaignSummary = Totals & { name: string };

export type DailyPoint = { date: string; impressions: number; clicks: number };

export type CsvIssue = { line: number | null; message: string };

export type CsvParseResult = {
  rows: CampaignRow[];
  errors: CsvIssue[];
  warnings: CsvIssue[];
  totalDataRows: number;
};
