"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompact, formatNumber, formatShortDate } from "@/lib/format";
import type { CampaignSummary, DailyPoint } from "@/lib/types";

const COLORS = {
  navy: "#18243A",
  gold: "#B89A62",
  slate: "#77808D",
  grid: "#E8E9EC",
};

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #E8E9EC",
  boxShadow: "0 6px 18px rgba(24,36,58,0.08)",
  fontSize: 12,
  color: "#202939",
};

export function ImpressionsClicksChart({ data }: { data: DailyPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke={COLORS.grid} vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fill: COLORS.slate, fontSize: 12 }} axisLine={false} tickLine={false} minTickGap={16} />
        <YAxis yAxisId="left" tickFormatter={formatCompact} tick={{ fill: COLORS.slate, fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
        <YAxis yAxisId="right" orientation="right" tickFormatter={formatCompact} tick={{ fill: COLORS.slate, fontSize: 12 }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          contentStyle={tooltipStyle}
          labelFormatter={(label) => formatShortDate(String(label))}
          formatter={(value, name) => [formatNumber(Number(value)), String(name)]}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: COLORS.slate }} />
        <Line yAxisId="left" type="monotone" dataKey="impressions" name="Impressions" stroke={COLORS.navy} strokeWidth={2} dot={false} isAnimationActive animationDuration={700} />
        <Line yAxisId="right" type="monotone" dataKey="clicks" name="Clicks" stroke={COLORS.gold} strokeWidth={2} dot={false} isAnimationActive animationDuration={700} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function CampaignComparisonChart({ campaigns, metric }: { campaigns: CampaignSummary[]; metric: "impressions" | "clicks" | "conversions" }) {
  const labels = { impressions: "Impressions", clicks: "Clicks", conversions: "Conversions" } as const;
  const data = campaigns.map((campaign) => ({ name: campaign.name, value: campaign[metric] }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, campaigns.length * 56)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={COLORS.grid} horizontal={false} />
        <XAxis type="number" tickFormatter={formatCompact} tick={{ fill: COLORS.slate, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={150} tick={{ fill: "#202939", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [formatNumber(Number(value)), labels[metric]]} cursor={{ fill: "#F7F7F5" }} />
        <Bar dataKey="value" name={labels[metric]} fill={COLORS.navy} radius={[0, 6, 6, 0]} barSize={22} isAnimationActive animationDuration={700} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ConversionRateChart({ campaigns }: { campaigns: CampaignSummary[] }) {
  const data = campaigns
    .filter((campaign) => campaign.conversionRate !== null)
    .map((campaign) => ({ name: campaign.name, value: (campaign.conversionRate ?? 0) * 100 }));

  return (
    <ResponsiveContainer width="100%" height={Math.max(220, data.length * 56)}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke={COLORS.grid} horizontal={false} />
        <XAxis type="number" tickFormatter={(value) => `${Number(value).toFixed(0)}%`} tick={{ fill: COLORS.slate, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={150} tick={{ fill: "#202939", fontSize: 12 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} formatter={(value) => [`${Number(value).toFixed(2)}%`, "Conversion rate"]} cursor={{ fill: "#F7F7F5" }} />
        <Bar dataKey="value" name="Conversion rate" fill={COLORS.gold} radius={[0, 6, 6, 0]} barSize={22} isAnimationActive animationDuration={700} />
      </BarChart>
    </ResponsiveContainer>
  );
}
