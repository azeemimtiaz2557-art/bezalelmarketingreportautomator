"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { CampaignComparisonChart, ConversionRateChart } from "@/components/charts";
import { CampaignTable } from "@/components/campaign-table";
import { PageHeader } from "@/components/page-header";
import { EmptyState, LoadingBlock, StatusMessage } from "@/components/status-message";
import { useDashboardMetrics } from "@/components/use-dashboard-metrics";
import { cn } from "@/lib/utils";

type Metric = "impressions" | "clicks" | "conversions";

const METRIC_TABS: { value: Metric; label: string }[] = [
  { value: "impressions", label: "Impressions" },
  { value: "clicks", label: "Clicks" },
  { value: "conversions", label: "Conversions" },
];

export default function AnalyticsPage() {
  const metrics = useDashboardMetrics();
  const [metric, setMetric] = useState<Metric>("impressions");

  if (!metrics.ready) {
    return (
      <main className="page-enter px-4 pb-16 sm:px-8">
        <PageHeader title="Analytics" breadcrumb="Analytics" />
        <div className="mt-6">
          {metrics.sampleError ? (
            <StatusMessage tone="error" title="Analytics could not load">{metrics.sampleError}</StatusMessage>
          ) : (
            <LoadingBlock label="Loading analytics" />
          )}
        </div>
      </main>
    );
  }

  const { campaigns, rows } = metrics;

  return (
    <main className="page-enter px-4 pb-16 sm:px-8">
      <PageHeader title="Analytics" breadcrumb="Analytics" />

      <div className="mt-6 space-y-6">
        {rows.length === 0 ? (
          <EmptyState icon={BarChart3} title="No data in this date range" description="Choose a wider date range to compare campaigns." />
        ) : (
          <>
            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className="card p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-primary">Campaign comparison</h2>
                    <p className="text-xs text-ink-secondary">Compare campaigns by one metric</p>
                  </div>
                  <div role="tablist" aria-label="Metric" className="flex rounded-[10px] border border-border bg-background p-1">
                    {METRIC_TABS.map((tab) => (
                      <button
                        key={tab.value}
                        role="tab"
                        type="button"
                        aria-selected={metric === tab.value}
                        onClick={() => setMetric(tab.value)}
                        className={cn(
                          "btn-press rounded-[8px] px-3 py-1.5 text-xs font-medium transition-colors",
                          metric === tab.value ? "bg-surface text-primary shadow-card" : "text-ink-secondary hover:text-ink",
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
                <CampaignComparisonChart campaigns={campaigns} metric={metric} />
              </div>

              <div className="card p-5">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-primary">Conversion analysis</h2>
                  <p className="text-xs text-ink-secondary">Share of clicks that converted</p>
                </div>
                {campaigns.some((c) => c.conversionRate !== null) ? (
                  <ConversionRateChart campaigns={campaigns} />
                ) : (
                  <EmptyState icon={BarChart3} title="No conversion rate to show" description="A conversion rate needs at least one click per campaign." />
                )}
              </div>
            </section>

            <CampaignTable campaigns={campaigns} />
          </>
        )}
      </div>
    </main>
  );
}
