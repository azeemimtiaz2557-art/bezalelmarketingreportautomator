import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

type KpiCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Percentage change vs. the previous period, or null when no comparison is possible. */
  change?: number | null;
  /** Some metrics (like spend) rise without being good, so direction and colour can be inverted. */
  invertGoodness?: boolean;
  hint?: string;
};

export function KpiCard({ label, value, icon: Icon, change = null, invertGoodness = false, hint }: KpiCardProps) {
  const hasChange = change !== null && change !== undefined;
  const isUp = hasChange && change > 0;
  const isFlat = hasChange && Math.abs(change) < 0.05;
  const isGood = hasChange && !isFlat && (invertGoodness ? !isUp : isUp);

  const Trend = isFlat ? Minus : isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="card lift-on-hover group relative overflow-hidden p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink-secondary">{label}</p>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-gold-light/50 text-gold transition-transform duration-200 group-hover:scale-105">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-primary sm:text-[1.7rem]" aria-label={`${label}: ${value}`}>
        {value}
      </p>

      <div className="mt-2 flex min-h-[20px] items-center gap-1.5 text-xs">
        {hasChange ? (
          <span
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              isFlat ? "text-ink-secondary" : isGood ? "text-success" : "text-danger",
            )}
          >
            <Trend className="h-3.5 w-3.5" aria-hidden="true" />
            {isFlat ? "No change" : `${change > 0 ? "+" : ""}${change.toFixed(1)}%`}
            <span className="font-normal text-ink-secondary">vs previous</span>
          </span>
        ) : (
          <span className="text-ink-secondary">{hint ?? " "}</span>
        )}
      </div>
    </article>
  );
}
