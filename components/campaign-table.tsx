"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CampaignSummary } from "@/lib/types";

type SortKey = "name" | "impressions" | "clicks" | "ctr" | "conversions" | "conversionRate" | "spend" | "costPerConversion";

const COLUMNS: { key: SortKey; label: string; numeric: boolean }[] = [
  { key: "name", label: "Campaign", numeric: false },
  { key: "impressions", label: "Impressions", numeric: true },
  { key: "clicks", label: "Clicks", numeric: true },
  { key: "ctr", label: "CTR", numeric: true },
  { key: "conversions", label: "Conversions", numeric: true },
  { key: "conversionRate", label: "Conv. rate", numeric: true },
  { key: "spend", label: "Spend", numeric: true },
  { key: "costPerConversion", label: "Cost / conv.", numeric: true },
];

export function CampaignTable({ campaigns }: { campaigns: CampaignSummary[] }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("impressions");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const filtered = needle ? campaigns.filter((c) => c.name.toLowerCase().includes(needle)) : campaigns;

    return [...filtered].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      // Missing values always sort to the bottom, whichever direction is chosen.
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      const result = typeof av === "string" && typeof bv === "string" ? av.localeCompare(bv) : (av as number) - (bv as number);
      return sortDir === "asc" ? result : -result;
    });
  }, [campaigns, query, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((dir) => (dir === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "name" ? "asc" : "desc");
    }
  }

  return (
    <section className="card overflow-hidden" aria-labelledby="campaign-table-title">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div>
          <h2 id="campaign-table-title" className="text-base font-semibold text-primary">Campaign performance</h2>
          <p className="text-xs text-ink-secondary">{visible.length} of {campaigns.length} campaigns</p>
        </div>
        <label className="relative w-full sm:w-64">
          <span className="sr-only">Search campaigns</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-secondary" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search campaigns"
            className="w-full rounded-[10px] border border-border bg-surface py-2 pl-9 pr-3 text-sm placeholder:text-ink-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          />
        </label>
      </div>

      {visible.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <p className="text-sm font-medium text-ink">No campaigns match “{query}”</p>
          <p className="mt-1 text-xs text-ink-secondary">Try a different search term.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-background text-xs text-ink-secondary">
              <tr>
                {COLUMNS.map((column) => {
                  const active = sortKey === column.key;
                  const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                  return (
                    <th key={column.key} scope="col" className={cn("px-4 py-3 font-medium", column.numeric ? "text-right" : "text-left")}>
                      <button
                        type="button"
                        onClick={() => toggleSort(column.key)}
                        aria-label={`Sort by ${column.label}`}
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-gold",
                          active && "text-ink",
                        )}
                      >
                        {column.label}
                        <Icon className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visible.map((campaign) => (
                <tr key={campaign.name} className="border-t border-border transition-colors hover:bg-background/70">
                  <th scope="row" className="px-4 py-3 text-left font-medium text-ink">{campaign.name}</th>
                  <td className="px-4 py-3 text-right tabular-nums">{formatNumber(campaign.impressions)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatNumber(campaign.clicks)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatPercent(campaign.ctr)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatNumber(campaign.conversions)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatPercent(campaign.conversionRate)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatMoney(campaign.spend)}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{formatMoney(campaign.costPerConversion)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
