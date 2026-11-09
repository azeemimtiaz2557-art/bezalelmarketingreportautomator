"use client";

import { ChevronRight, Download } from "lucide-react";
import { useData } from "./data-provider";
import type { DateRangeKey } from "@/lib/types";

const RANGE_OPTIONS: { value: DateRangeKey; label: string }[] = [
  { value: "all", label: "All dates" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

export function PageHeader({ title, breadcrumb, showDateFilter = true }: { title: string; breadcrumb: string; showDateFilter?: boolean }) {
  const { dataset, dateRange, setDateRange } = useData();
  const canFilterDates = showDateFilter && dataset?.hasDates;

  return (
    <header className="sticky top-14 z-20 flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-border bg-background/95 px-4 py-4 backdrop-blur-sm sm:px-8 lg:top-0">
      <div className="min-w-0">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-ink-secondary">
          <span>Bezalel Media</span>
          <ChevronRight className="h-3 w-3" aria-hidden="true" />
          <span>{breadcrumb}</span>
        </nav>
        <h1 className="truncate text-xl font-semibold text-primary sm:text-2xl">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {canFilterDates && (
          <label className="flex items-center gap-2 text-sm text-ink-secondary">
            <span className="sr-only sm:not-sr-only">Date range</span>
            <select
              value={dateRange}
              onChange={(event) => setDateRange(event.target.value as DateRangeKey)}
              className="rounded-[10px] border border-border bg-surface px-3 py-2 text-sm font-medium text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              {RANGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {/* PDF export is built in the next stage. The button is shown disabled so nothing looks like it works when it doesn't. */}
        <button
          type="button"
          disabled
          title="PDF reports are part of the next development stage"
          className="btn-press inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-white opacity-50 cursor-not-allowed"
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download Report
        </button>
      </div>
    </header>
  );
}
