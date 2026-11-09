"use client";

import Link from "next/link";
import { BarChart3, Eye, MousePointerClick, Percent, Receipt, Target, Wallet, RefreshCw, Upload } from "lucide-react";
import { CampaignComparisonChart, ImpressionsClicksChart } from "@/components/charts";
import { CampaignTable } from "@/components/campaign-table";
import { useData } from "@/components/data-provider";
import { KpiCard } from "@/components/kpi-card";
import { PageHeader } from "@/components/page-header";
import { EmptyState, LoadingBlock, StatusMessage } from "@/components/status-message";
import { useDashboardMetrics } from "@/components/use-dashboard-metrics";
import { formatMoney, formatNumber, formatPercent } from "@/lib/format";

export default function DashboardPage() {
  const metrics = useDashboardMetrics();
  const { resetToSample } = useData();

  if (!metrics.ready) {
    return (
      <main className="page-enter px-4 pb-16 sm:px-8">
        <PageHeader title="Dashboard" breadcrumb="Dashboard" />
        <div className="mt-6">
          {metrics.sampleError ? (
            <div className="space-y-4">
              <StatusMessage tone="error" title="Sample data could not be loaded">
                {metrics.sampleError}
              </StatusMessage>
              <button type="button" onClick={resetToSample} className="btn-press inline-flex items-center gap-2 rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
                <RefreshCw className="h-4 w-4" aria-hidden="true" />
                Try again
              </button>
            </div>
          ) : (
            <LoadingBlock label="Loading dashboard" />
          )}
        </div>
      </main>
    );
  }

  const { dataset, rows, totals, changes, campaigns, daily } = metrics;
  const noRowsInRange = rows.length === 0;

  return (
    <main className="page-enter px-4 pb-16 sm:px-8">
      <PageHeader title="Dashboard" breadcrumb="Dashboard" />

      <div className="mt-6 space-y-6">
        {dataset.isSample && (
          <StatusMessage tone="info" title="You are viewing fictional sample data.">
            <span>
              Upload your own campaign CSV on the{" "}
              <Link href="/upload" className="font-medium text-primary underline underline-offset-2">Upload Data</Link> page.
            </span>
          </StatusMessage>
        )}

        {noRowsInRange ? (
          <EmptyState
            icon={BarChart3}
            title="No data in this date range"
            description="Choose a wider date range, or upload a file that covers the period you need."
          />
        ) : (
          <>
            {/* KPI cards: seven metrics, two columns on mobile, four on wide screens */}
            <section aria-label="Key performance indicators" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <KpiCard label="Total impressions" value={formatNumber(totals.impressions)} icon={Eye} change={changes.impressions} />
              <KpiCard label="Total clicks" value={formatNumber(totals.clicks)} icon={MousePointerClick} change={changes.clicks} />
              <KpiCard label="Click-through rate" value={formatPercent(totals.ctr)} icon={Percent} change={changes.ctr} />
              <KpiCard label="Total conversions" value={formatNumber(totals.conversions)} icon={Target} change={changes.conversions} />
              <KpiCard label="Conversion rate" value={formatPercent(totals.conversionRate)} icon={Percent} change={changes.conversionRate} />
              <KpiCard label="Advertising spend" value={formatMoney(totals.spend)} icon={Wallet} change={changes.spend} invertGoodness hint="Lower is usually better" />
              <KpiCard
                label="Cost per conversion"
                value={formatMoney(totals.costPerConversion)}
                icon={Receipt}
                change={changes.costPerConversion}
                invertGoodness
                hint={totals.costPerConversion === null ? "Needs at least one conversion" : "Lower is usually better"}
              />
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-5">
              <div className="card p-5 xl:col-span-3">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-primary">Impressions and clicks</h2>
                  <p className="text-xs text-ink-secondary">Daily totals</p>
                </div>
                {daily.length > 0 ? (
                  <ImpressionsClicksChart data={daily} />
                ) : (
                  <EmptyState icon={BarChart3} title="No daily trend yet" description="Add a date column to your CSV to see daily trends." />
                )}
              </div>

              <div className="card p-5 xl:col-span-2">
                <div className="mb-4">
                  <h2 className="text-base font-semibold text-primary">Campaign comparison</h2>
                  <p className="text-xs text-ink-secondary">Impressions by campaign</p>
                </div>
                <CampaignComparisonChart campaigns={campaigns} metric="impressions" />
              </div>
            </section>

            <CampaignTable campaigns={campaigns} />
          </>
        )}

        {dataset.isSample === false && (
          <p className="text-xs text-ink-secondary">
            Showing: {dataset.sourceLabel}. <Link href="/upload" className="font-medium text-primary underline underline-offset-2">Upload a different file</Link>
          </p>
        )}

        {/* Quiet reminder of what data is used and where it lives */}
        <p className="flex items-center gap-2 text-xs text-ink-secondary">
          <Upload className="h-3.5 w-3.5" aria-hidden="true" />
          Uploaded files stay in this browser session only and are never stored permanently.
        </p>
      </div>
    </main>
  );
}
