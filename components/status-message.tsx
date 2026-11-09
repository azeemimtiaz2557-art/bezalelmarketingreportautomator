import type { ComponentType, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "success" | "error" | "info";

const TONES: Record<Tone, { box: string; icon: LucideIcon; iconClass: string }> = {
  success: { box: "border-success/30 bg-success/5 text-ink", icon: CheckCircle2, iconClass: "text-success" },
  error: { box: "border-danger/30 bg-danger/5 text-ink", icon: AlertCircle, iconClass: "text-danger" },
  info: { box: "border-gold/40 bg-gold-light/30 text-ink", icon: Info, iconClass: "text-gold" },
};

/** Inline success, error or info message. Errors use role=alert so screen readers announce them. */
export function StatusMessage({ tone, title, children }: { tone: Tone; title: string; children?: ReactNode }) {
  const config = TONES[tone];
  const Icon = config.icon;
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cn("flex gap-3 rounded-card border px-4 py-3", config.box)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.iconClass)} aria-hidden="true" />
      <div className="min-w-0 text-sm">
        <p className="font-medium">{title}</p>
        {children && <div className="mt-1 text-xs text-ink-secondary">{children}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
        <Icon className="h-6 w-6 text-gold" aria-hidden={true} />
      </span>
      <p className="text-base font-semibold text-primary">{title}</p>
      <p className="max-w-sm text-sm text-ink-secondary">{description}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function LoadingBlock({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="card flex items-center justify-center gap-3 px-6 py-14 text-sm text-ink-secondary">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-gold border-t-transparent motion-reduce:animate-none" aria-hidden="true" />
      {label}…
    </div>
  );
}
