"use client";

import { useState } from "react";
import { AlertTriangle, Download, FileSpreadsheet, RotateCcw, X } from "lucide-react";
import { CsvDropzone } from "@/components/csv-dropzone";
import { useData } from "@/components/data-provider";
import { PageHeader } from "@/components/page-header";
import { StatusMessage } from "@/components/status-message";
import { formatMoney, formatNumber, formatShortDate } from "@/lib/format";
import { parseCampaignCsv, validateCsvFile } from "@/lib/csv";
import type { CsvParseResult } from "@/lib/types";

type UploadState =
  | { status: "idle" }
  | { status: "parsing"; fileName: string }
  | { status: "error"; fileName: string; message: string }
  | { status: "preview"; fileName: string; result: CsvParseResult };

const PREVIEW_ROWS = 10;

export default function UploadPage() {
  const { setDataset, resetToSample, dataset } = useData();
  const [state, setState] = useState<UploadState>({ status: "idle" });
  const [confirmation, setConfirmation] = useState<string | null>(null);

  async function handleFile(file: File) {
    setConfirmation(null);

    const fileProblem = validateCsvFile(file);
    if (fileProblem) {
      setState({ status: "error", fileName: file.name, message: fileProblem });
      return;
    }

    setState({ status: "parsing", fileName: file.name });
    try {
      const text = await file.text();
      const result = parseCampaignCsv(text);
      if (result.errors.length > 0 && result.rows.length === 0) {
        setState({
          status: "error",
          fileName: file.name,
          message: result.errors[0].message,
        });
        setState({ status: "preview", fileName: file.name, result });
        return;
      }
      setState({ status: "preview", fileName: file.name, result });
    } catch {
      setState({ status: "error", fileName: file.name, message: "The file could not be read. Please try exporting it again." });
    }
  }

  function applyPreview() {
    if (state.status !== "preview" || state.result.rows.length === 0) return;
    const { result, fileName } = state;
    setDataset({
      rows: result.rows,
      sourceLabel: fileName,
      isSample: false,
      hasDates: result.rows.some((row) => row.date !== null),
    });
    setConfirmation(`Now showing ${result.rows.length} rows from ${fileName}.`);
    setState({ status: "idle" });
  }

  function discard() {
    setState({ status: "idle" });
  }

  function restoreSample() {
    resetToSample();
    setState({ status: "idle" });
    setConfirmation("Sample data restored.");
  }

  return (
    <main className="page-enter px-4 pb-16 sm:px-8">
      <PageHeader title="Upload Data" breadcrumb="Upload Data" showDateFilter={false} />

      <div className="mt-6 grid gap-6 xl:grid-cols-5">
        <section className="space-y-4 xl:col-span-3" aria-labelledby="upload-title">
          <div>
            <h2 id="upload-title" className="text-base font-semibold text-primary">Upload a campaign CSV</h2>
            <p className="mt-1 text-sm text-ink-secondary">
              Required columns: <code className="rounded bg-background px-1.5 py-0.5 text-xs">campaign, impressions, clicks, conversions, spend</code>.
              Add <code className="rounded bg-background px-1.5 py-0.5 text-xs">date</code> (YYYY-MM-DD) for trends and date filters.
            </p>
          </div>

          <CsvDropzone onFileSelected={handleFile} disabled={state.status === "parsing"} />

          {state.status === "parsing" && (
            <StatusMessage tone="info" title={`Checking ${state.fileName}…`} />
          )}

          {state.status === "error" && (
            <StatusMessage tone="error" title={`Could not use ${state.fileName}`}>
              {state.message}
            </StatusMessage>
          )}

          {confirmation && <StatusMessage tone="success" title={confirmation} />}

          <div className="card flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-gold-light/50">
                <FileSpreadsheet className="h-4 w-4 text-gold" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-medium text-ink">Need a starting point?</p>
                <p className="text-xs text-ink-secondary">Download the fictional sample file to see the expected format.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href="/samples/sample-campaigns.csv"
                download
                className="btn-press inline-flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-2 text-sm font-medium text-ink hover:border-gold"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Sample CSV
              </a>
              <a
                href="/samples/sample-campaigns-with-errors.csv"
                download
                className="btn-press inline-flex items-center gap-2 rounded-[10px] border border-border bg-surface px-3 py-2 text-sm font-medium text-ink hover:border-gold"
              >
                <AlertTriangle className="h-4 w-4 text-danger" aria-hidden="true" />
                Error example
              </a>
            </div>
          </div>

          {dataset && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface px-4 py-3 text-sm">
              <p className="text-ink-secondary">
                Currently showing: <span className="font-medium text-ink">{dataset.sourceLabel}</span>
              </p>
              {!dataset.isSample && (
                <button type="button" onClick={restoreSample} className="btn-press inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-gold">
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  Restore sample data
                </button>
              )}
            </div>
          )}
        </section>

        <section className="xl:col-span-2" aria-labelledby="preview-title">
          {state.status === "preview" ? (
            <div className="card flex flex-col overflow-hidden">
              <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
                <div className="min-w-0">
                  <h2 id="preview-title" className="truncate text-base font-semibold text-primary">Preview: {state.fileName}</h2>
                  <p className="text-xs text-ink-secondary">
                    {state.result.rows.length} valid of {state.result.totalDataRows} data rows
                  </p>
                </div>
                <button type="button" onClick={discard} aria-label="Discard this file" className="btn-press rounded-[10px] p-1.5 text-ink-secondary hover:bg-background hover:text-ink">
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {state.result.errors.length > 0 && (
                <div className="space-y-2 border-b border-border px-5 py-4">
                  <StatusMessage tone="error" title="Problems found">
                    <ul className="list-disc space-y-1 pl-4">
                      {state.result.errors.map((issue, index) => (
                        <li key={index}>{issue.line ? `Line ${issue.line}: ` : ""}{issue.message}</li>
                      ))}
                    </ul>
                  </StatusMessage>
                </div>
              )}

              {state.result.warnings.length > 0 && (
                <div className="space-y-2 border-b border-border px-5 py-4">
                  <StatusMessage tone="info" title="Things to check">
                    <ul className="list-disc space-y-1 pl-4">
                      {state.result.warnings.map((issue, index) => (
                        <li key={index}>{issue.line ? `Line ${issue.line}: ` : ""}{issue.message}</li>
                      ))}
                    </ul>
                  </StatusMessage>
                </div>
              )}

              {state.result.rows.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] text-xs">
                      <thead className="bg-background text-ink-secondary">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium">Campaign</th>
                          <th className="px-3 py-2 text-left font-medium">Date</th>
                          <th className="px-3 py-2 text-right font-medium">Impr.</th>
                          <th className="px-3 py-2 text-right font-medium">Clicks</th>
                          <th className="px-3 py-2 text-right font-medium">Conv.</th>
                          <th className="px-3 py-2 text-right font-medium">Spend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.result.rows.slice(0, PREVIEW_ROWS).map((row, index) => (
                          <tr key={index} className="border-t border-border">
                            <td className="max-w-[140px] truncate px-3 py-2 text-ink">{row.campaign}</td>
                            <td className="px-3 py-2 text-ink-secondary">{row.date ? formatShortDate(row.date) : "—"}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{formatNumber(row.impressions)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{formatNumber(row.clicks)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{formatNumber(row.conversions)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{formatMoney(row.spend)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {state.result.rows.length > PREVIEW_ROWS && (
                    <p className="border-t border-border px-5 py-3 text-xs text-ink-secondary">
                      Showing the first {PREVIEW_ROWS} of {state.result.rows.length} valid rows.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
                    <button type="button" onClick={applyPreview} className="btn-press inline-flex items-center rounded-[10px] bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
                      Use this data
                    </button>
                    <button type="button" onClick={discard} className="btn-press rounded-[10px] border border-border px-4 py-2 text-sm font-medium text-ink hover:border-gold">
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-5 py-8 text-center text-sm text-ink-secondary">
                  No valid rows were found, so there is nothing to show. Fix the problems above and upload again.
                </div>
              )}
            </div>
          ) : (
            <div className="card flex h-full min-h-[240px] flex-col items-center justify-center gap-2 p-6 text-center">
              <p className="text-sm font-medium text-ink">Your preview will appear here</p>
              <p className="max-w-xs text-xs text-ink-secondary">
                Check the first rows and any problems before the data is used on the dashboard.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
