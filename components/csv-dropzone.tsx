"use client";

import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type CsvDropzoneProps = {
  onFileSelected: (file: File) => void;
  disabled?: boolean;
};

export function CsvDropzone({ onFileSelected, disabled = false }: CsvDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (!disabled) setDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLDivElement>) {
    // Only clear the highlight when the pointer truly leaves the zone, not when it moves over a child.
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files?.[0];
    if (file) onFileSelected(file);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      inputRef.current?.click();
    }
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      aria-label="Upload a campaign CSV file. Drag and drop or press Enter to browse."
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onKeyDown={handleKeyDown}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-card border-2 border-dashed px-6 py-12 text-center transition-[border-color,background-color] duration-200 ease-out",
        dragging ? "border-gold bg-gold-light/30" : "border-border bg-surface hover:border-gold/60",
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <span className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-background transition-transform duration-200", dragging && "scale-105")}>
        <UploadCloud className="h-6 w-6 text-gold" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-medium text-ink">
          {dragging ? "Release to upload" : "Drag your CSV here, or click to browse"}
        </p>
        <p className="mt-1 text-xs text-ink-secondary">.csv files up to 2 MB and 10,000 rows</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        tabIndex={-1}
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFileSelected(file);
          // Reset so choosing the same file again still fires onChange.
          event.target.value = "";
        }}
      />
    </div>
  );
}
