"use client";

import { useMemo } from "react";
import { useData } from "./data-provider";
import {
  computeCampaignSummaries,
  computeDailySeries,
  computeTotals,
  filterByRange,
  filterPreviousRange,
  percentChange,
} from "@/lib/metrics";

/**
 * Derives every metric the pages show from the active dataset and date range.
 * Shared by the dashboard and analytics pages so both always agree.
 */
export function useDashboardMetrics() {
  const { dataset, dateRange, loadingSample, sampleError } = useData();

  return useMemo(() => {
    if (!dataset) {
      return { ready: false as const, loadingSample, sampleError };
    }

    const rows = filterByRange(dataset.rows, dateRange);
    const previousRows = filterPreviousRange(dataset.rows, dateRange);
    const totals = computeTotals(rows);
    const previous = dateRange === "all" ? null : computeTotals(previousRows);
    const hasComparison = previous !== null && previousRows.length > 0;

    return {
      ready: true as const,
      loadingSample,
      sampleError,
      dataset,
      rows,
      totals,
      changes: {
        impressions: hasComparison ? percentChange(totals.impressions, previous.impressions) : null,
        clicks: hasComparison ? percentChange(totals.clicks, previous.clicks) : null,
        ctr: hasComparison ? percentChange(totals.ctr, previous.ctr) : null,
        conversions: hasComparison ? percentChange(totals.conversions, previous.conversions) : null,
        conversionRate: hasComparison ? percentChange(totals.conversionRate, previous.conversionRate) : null,
        spend: hasComparison ? percentChange(totals.spend, previous.spend) : null,
        costPerConversion: hasComparison ? percentChange(totals.costPerConversion, previous.costPerConversion) : null,
      },
      campaigns: computeCampaignSummaries(rows),
      daily: computeDailySeries(rows),
    };
  }, [dataset, dateRange, loadingSample, sampleError]);
}
