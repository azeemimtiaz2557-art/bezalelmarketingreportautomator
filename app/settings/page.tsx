"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";
import { useData } from "@/components/data-provider";
import { PageHeader } from "@/components/page-header";

export default function SettingsPage() {
  const { dataset, resetToSample } = useData();

  return (
    <main className="page-enter px-4 pb-16 sm:px-8">
      <PageHeader title="Settings" breadcrumb="Settings" showDateFilter={false} />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="card p-5" aria-labelledby="data-title">
          <h2 id="data-title" className="text-base font-semibold text-primary">Data</h2>
          <p className="mt-1 text-sm text-ink-secondary">
            Currently showing: <span className="font-medium text-ink">{dataset?.sourceLabel ?? "Loading…"}</span>
          </p>
          <button
            type="button"
            onClick={resetToSample}
            className="btn-press mt-4 inline-flex items-center gap-2 rounded-[10px] border border-border bg-surface px-4 py-2 text-sm font-medium text-ink hover:border-gold"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Restore sample data
          </button>
        </section>

        <section className="card p-5" aria-labelledby="privacy-title">
          <h2 id="privacy-title" className="flex items-center gap-2 text-base font-semibold text-primary">
            <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
            Privacy
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink-secondary">
            <li>Uploaded files are read in your browser and kept only for this session.</li>
            <li>Customer names, phone numbers and emails are not collected.</li>
            <li>Data is never sent to external AI services.</li>
            <li>Refreshing the page returns the app to the sample data.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
