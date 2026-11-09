import { CheckCircle2, FileText } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/status-message";

const PLANNED_CONTENTS = [
  "Bezalel Media logo in the header and a subtle watermark",
  "All seven KPIs for the selected date range",
  "Impressions and clicks trend chart",
  "Campaign comparison and campaign-wise summary table",
  "Footer with the tagline “Crafted with Purpose.”",
];

export default function ReportsPage() {
  return (
    <main className="px-4 pb-16 sm:px-8">
      <PageHeader title="Reports" breadcrumb="Reports" showDateFilter={false} />

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <EmptyState
            icon={FileText}
            title="PDF reports are coming in the next stage"
            description="Report generation is planned after the frontend is approved. Nothing here can be downloaded yet."
          />
        </div>

        <aside className="card p-5 xl:col-span-2" aria-labelledby="planned-title">
          <h2 id="planned-title" className="text-base font-semibold text-primary">What the report will include</h2>
          <ul className="mt-4 space-y-3">
            {PLANNED_CONTENTS.map((item) => (
              <li key={item} className="flex gap-3 text-sm text-ink">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </main>
  );
}
