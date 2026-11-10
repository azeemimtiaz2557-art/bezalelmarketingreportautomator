import Papa from "papaparse";
import type { CampaignRow, CsvIssue, CsvParseResult } from "./types";

export const MAX_FILE_BYTES = 2 * 1024 * 1024; // 2 MB
export const MAX_ROWS = 10_000;
const MAX_REPORTED_ERRORS = 15;

export const REQUIRED_COLUMNS = ["campaign", "impressions", "clicks", "conversions", "spend"] as const;
export const OPTIONAL_COLUMNS = ["date"] as const;

/** Lower-cases and trims a header so "Campaign Name " and "campaign" match. */
function normaliseHeader(header: string): string {
  return header.trim().toLowerCase().replace(/\s+/g, "_");
}

/** Accepts "1,234", "  56 ", "12.5". Rejects blanks, text, negatives and non-finite values. */
function parseNonNegativeNumber(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  const cleaned = raw.replace(/,/g, "").trim();
  if (cleaned === "") return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return value;
}

/** Accepts strict YYYY-MM-DD dates that actually exist in the calendar. */
function parseIsoDate(raw: string | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
  const date = new Date(`${trimmed}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10) === trimmed ? trimmed : null;
}

/**
 * Parses and validates campaign CSV text. Invalid rows are skipped and reported,
 * never silently coerced into zeros.
 */
export function parseCampaignCsv(text: string): CsvParseResult {
  const errors: CsvIssue[] = [];
  const warnings: CsvIssue[] = [];

  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: normaliseHeader,
  });

  if (parsed.errors.length > 0) {
    const first = parsed.errors[0];
    errors.push({
      line: typeof first.row === "number" ? first.row + 2 : null,
      message: `The file could not be read as CSV: ${first.message}.`,
    });
  }

  const headers = parsed.meta.fields ?? [];
  const missing = REQUIRED_COLUMNS.filter((column) => !headers.includes(column));
  if (missing.length > 0) {
    errors.push({
      line: 1,
      message: `Missing required column${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}.`,
    });
    return { rows: [], errors, warnings, totalDataRows: 0 };
  }

  const hasDateColumn = headers.includes("date");
  if (!hasDateColumn) {
    warnings.push({
      line: null,
      message: "No date column found. Date filters and daily charts will be unavailable.",
    });
  }

  const data = parsed.data;
  if (data.length === 0) {
    errors.push({ line: null, message: "The file has a header row but no data rows." });
    return { rows: [], errors, warnings, totalDataRows: 0 };
  }
  if (data.length > MAX_ROWS) {
    errors.push({
      line: null,
      message: `The file has ${data.length.toLocaleString()} rows. The limit is ${MAX_ROWS.toLocaleString()}.`,
    });
    return { rows: [], errors, warnings, totalDataRows: data.length };
  }

  const rows: CampaignRow[] = [];
  let invalidCount = 0;

  data.forEach((record, index) => {
    // Header is line 1, so the first data row is line 2.
    const line = index + 2;
    const rowProblems: string[] = [];

    const campaign = (record.campaign ?? "").trim();
    if (campaign === "") rowProblems.push("campaign name is empty");

    const impressions = parseNonNegativeNumber(record.impressions);
    const clicks = parseNonNegativeNumber(record.clicks);
    const conversions = parseNonNegativeNumber(record.conversions);
    const spend = parseNonNegativeNumber(record.spend);

    if (impressions === null) rowProblems.push("impressions must be a number of zero or more");
    if (clicks === null) rowProblems.push("clicks must be a number of zero or more");
    if (conversions === null) rowProblems.push("conversions must be a number of zero or more");
    if (spend === null) rowProblems.push("spend must be a number of zero or more");

    let date: string | null = null;
    if (hasDateColumn) {
      date = parseIsoDate(record.date);
      if (date === null) rowProblems.push("date must use the format YYYY-MM-DD");
    }

    if (
      rowProblems.length > 0 ||
      impressions === null ||
      clicks === null ||
      conversions === null ||
      spend === null
    ) {
      invalidCount += 1;
      if (errors.length < MAX_REPORTED_ERRORS) {
        errors.push({ line, message: rowProblems.join("; ") });
      }
      return;
    }

    if (clicks > impressions) {
      warnings.push({ line, message: "Clicks are higher than impressions. The row was kept." });
    }
    if (conversions > clicks) {
      warnings.push({ line, message: "Conversions are higher than clicks. The row was kept." });
    }

    rows.push({ campaign, date, impressions, clicks, conversions, spend });
  });

  if (invalidCount > MAX_REPORTED_ERRORS) {
    errors.push({
      line: null,
      message: `${invalidCount - MAX_REPORTED_ERRORS} more invalid rows were not listed.`,
    });
  }
  if (invalidCount > 0) {
    warnings.push({
      line: null,
      message: `${invalidCount} row${invalidCount === 1 ? "" : "s"} skipped because of invalid values.`,
    });
  }

  return { rows, errors, warnings: warnings.slice(0, MAX_REPORTED_ERRORS), totalDataRows: data.length };
}

/** Client-side file check that runs before any parsing. */
export function validateCsvFile(file: File): string | null {
  const isCsvName = file.name.toLowerCase().endsWith(".csv");
  const isCsvType = file.type === "" || file.type === "text/csv" || file.type === "application/vnd.ms-excel";
  if (!isCsvName || !isCsvType) {
    return "Please choose a .csv file. Other file types are not supported.";
  }
  if (file.size === 0) {
    return "This file is empty.";
  }
  if (file.size > MAX_FILE_BYTES) {
    return "This file is larger than 2 MB. Please export a smaller date range.";
  }
  return null;
}
