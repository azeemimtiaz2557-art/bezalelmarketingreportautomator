"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { parseCampaignCsv } from "@/lib/csv";
import type { Dataset, DateRangeKey } from "@/lib/types";

/**
 * Holds the active dataset in memory only. Nothing is written to localStorage,
 * cookies or a server, so a page refresh returns the app to the sample data.
 */
type DataContextValue = {
  dataset: Dataset | null;
  loadingSample: boolean;
  sampleError: string | null;
  setDataset: (dataset: Dataset) => void;
  resetToSample: () => void;
  dateRange: DateRangeKey;
  setDateRange: (range: DateRangeKey) => void;
};

const DataContext = createContext<DataContextValue | null>(null);

const SAMPLE_PATH = "/samples/sample-campaigns.csv";

export function DataProvider({ children }: { children: ReactNode }) {
  const [dataset, setDatasetState] = useState<Dataset | null>(null);
  const [loadingSample, setLoadingSample] = useState(true);
  const [sampleError, setSampleError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeKey>("all");

  const loadSample = useCallback(async () => {
    setLoadingSample(true);
    setSampleError(null);
    try {
      const response = await fetch(SAMPLE_PATH, { cache: "no-store" });
      if (!response.ok) throw new Error(`Sample file returned ${response.status}`);
      const result = parseCampaignCsv(await response.text());
      if (result.rows.length === 0) throw new Error("Sample file contains no valid rows");
      setDatasetState({
        rows: result.rows,
        sourceLabel: "Sample data (fictional)",
        isSample: true,
        hasDates: result.rows.some((row) => row.date !== null),
      });
    } catch (error) {
      setSampleError(error instanceof Error ? error.message : "Could not load sample data");
    } finally {
      setLoadingSample(false);
    }
  }, []);

  useEffect(() => {
    void loadSample();
  }, [loadSample]);

  const setDataset = useCallback((next: Dataset) => {
    setDatasetState(next);
    setDateRange("all");
  }, []);

  const resetToSample = useCallback(() => {
    setDateRange("all");
    void loadSample();
  }, [loadSample]);

  const value = useMemo<DataContextValue>(
    () => ({
      dataset,
      loadingSample,
      sampleError,
      setDataset,
      resetToSample,
      dateRange,
      setDateRange,
    }),
    [dataset, loadingSample, sampleError, setDataset, resetToSample, dateRange],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used inside DataProvider");
  return context;
}
