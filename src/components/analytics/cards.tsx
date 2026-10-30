// Overview and Usage cards of the Analytics page, ported from the RAG Studio web app
// (features/analytics/components/{stat-card,message-trend-chart,channel-breakdown,quota-card}.tsx).
import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Area, CartesianGrid, ComposedChart, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { AnalyticsChannel, AnalyticsGranularity, AnalyticsPoint } from "../../services/types";
import { CHANNEL_LABEL, cn, formatNumber } from "./format";

type StatTone = "info" | "success" | "accent";

const statCardTone: Record<StatTone, string> = {
  info: "bg-info-tint",
  success: "bg-success-tint",
  accent: "bg-accent-tint",
};
const statIconTone: Record<StatTone, string> = {
  info: "text-info-text",
  success: "text-success-text",
  accent: "text-accent",
};

/** Tinted summary card: big number on top, two small stat boxes below. */
export function StatCard({
  title,
  icon: Icon,
  tone,
  badge,
  value,
  unit,
  details,
}: {
  title: string;
  icon: LucideIcon;
  tone: StatTone;
  badge?: ReactNode;
  value: ReactNode;
  unit: string;
  details: { label: string; value: ReactNode; onClick?: () => void }[];
}) {
  return (
    <section className={`rounded-card-sm border-line border p-6 ${statCardTone[tone]}`}>
      <div className="flex items-center gap-3">
        <span className="bg-card rounded-small flex size-10 shrink-0 items-center justify-center">
          <Icon className={`size-5 ${statIconTone[tone]}`} aria-hidden />
        </span>
        <h2 className="text-p2 text-ink">{title}</h2>
        {badge && <span className="ml-auto">{badge}</span>}
      </div>
      <p className="mt-5 flex items-baseline gap-3">
        <span className="text-h2 text-ink tabular">{value}</span>
        <span className="text-p3 text-ink-secondary">{unit}</span>
      </p>
      <dl className="mt-4 grid grid-cols-2 gap-3">
        {details.map((detail) => (
          <div
            key={detail.label}
            className={cn(
              "bg-card rounded-small flex flex-col-reverse px-4 py-3",
              detail.onClick && "hover:ring-accent cursor-pointer hover:ring-1",
            )}
            onClick={detail.onClick}
          >
            <dt className="text-c1 text-ink-secondary">{detail.label}</dt>
            <dd className="text-s1 text-ink tabular">{detail.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

const RANGES: { key: AnalyticsGranularity; label: string }[] = [
  { key: "daily", label: "Daily" },
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
];

const axisTick = { fill: "var(--ink-muted)", fontSize: 12 };

function pointLabel(iso: string, granularity: AnalyticsGranularity) {
  const d = new Date(iso);
  return granularity === "monthly"
    ? d.toLocaleDateString("en-US", { month: "short" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Area chart of messages (solid) and sessions (dashed) with a Daily / Weekly / Monthly switch. */
export function MessageTrendChart({
  points,
  granularity,
  periodLabel,
  onGranularity,
}: {
  points: AnalyticsPoint[];
  granularity: AnalyticsGranularity;
  periodLabel: string;
  onGranularity: (g: AnalyticsGranularity) => void;
}) {
  const data = points.map((p) => ({ label: pointLabel(p.start, granularity), messages: p.messages, sessions: p.sessions }));
  // Show only the first, middle and last date under the chart.
  const xTicks = [data[0]?.label, data[Math.floor((data.length - 1) / 2)]?.label, data[data.length - 1]?.label].filter(
    (label): label is string => Boolean(label),
  );

  return (
    <section className="bg-card rounded-card-sm border-line shadow-subtle h-full border p-6">
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
        <div>
          <h2 className="text-s1 text-ink">{"Message trend"}</h2>
          <p className="text-p3 text-ink-secondary">{`Messages and sessions · ${periodLabel}`}</p>
        </div>
        <ul className="text-c1 text-ink-body flex items-center gap-4 pt-1">
          <li className="flex items-center gap-2">
            <span className="rounded-pill bg-accent h-0.5 w-4" aria-hidden />
            {"Messages"}
          </li>
          <li className="flex items-center gap-2">
            <span className="border-ink-muted w-4 border-t-2 border-dashed" aria-hidden />
            {"Sessions"}
          </li>
        </ul>
        <div role="group" aria-label="Time range" className="bg-subtle rounded-small flex p-1">
          {RANGES.map((r) => (
            <button
              key={r.key}
              type="button"
              aria-pressed={granularity === r.key}
              onClick={() => onGranularity(r.key)}
              className={`rounded-tag text-btn-sm cursor-pointer px-4 py-2 transition-colors ${
                granularity === r.key ? "bg-inverse text-on-inverse" : "text-ink-body hover:text-ink"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-6 h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 24, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border-default)" />
            <XAxis
              dataKey="label"
              ticks={xTicks}
              interval={0}
              tickLine={false}
              axisLine={false}
              tick={axisTick}
              tickMargin={12}
            />
            <YAxis tickLine={false} axisLine={false} tick={axisTick} tickFormatter={formatNumber} width={48} />
            <Tooltip
              formatter={(value) => formatNumber(Number(value))}
              contentStyle={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--ink-primary)" }}
            />
            <Area
              type="monotone"
              dataKey="messages"
              name="Messages"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="var(--accent)"
              fillOpacity={0.1}
              dot={false}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="sessions"
              name="Sessions"
              stroke="var(--ink-muted)"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

// `dot` is a Tailwind class for the list; `fill` is the same color for the chart.
const channelColor: Record<AnalyticsChannel, { dot: string; fill: string }> = {
  "public-link": { dot: "bg-accent", fill: "var(--accent)" },
  widget: { dot: "bg-warning", fill: "var(--warning)" },
  telegram: { dot: "bg-info-text", fill: "var(--info-text)" },
  playground: { dot: "bg-success", fill: "var(--success)" },
};

/** Donut of messages per channel, with a list of each channel's share below. */
export function ChannelBreakdown({
  channels,
  periodLabel,
}: {
  channels: { channel: AnalyticsChannel; messages: number; sessions: number }[];
  periodLabel: string;
}) {
  const total = channels.reduce((n, c) => n + c.messages, 0);
  // Recharts reads each slice's color from its `fill` field; an empty ring when there are no messages.
  const slices = total
    ? channels.map((c) => ({ name: CHANNEL_LABEL[c.channel], messages: c.messages, fill: channelColor[c.channel].fill }))
    : [{ name: "None", messages: 1, fill: "var(--border-default)" }];

  return (
    <section className="bg-card rounded-card-sm border-line shadow-subtle h-full border p-6">
      <h2 className="text-s1 text-ink">{"Channel breakdown"}</h2>
      <p className="text-p3 text-ink-secondary">{`Messages and sessions per channel · ${periodLabel}`}</p>
      <div className="bg-subtle rounded-card-sm mt-6 flex justify-center p-6">
        <div className="relative size-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={slices}
                dataKey="messages"
                nameKey="name"
                innerRadius="72%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                paddingAngle={total ? 2 : 0}
                stroke="none"
                isAnimationActive={false}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-h5 text-ink tabular">{formatNumber(total)}</span>
            <span className="text-c1 text-ink-secondary">{"messages"}</span>
          </div>
        </div>
      </div>
      <ul className="divide-line mt-4 divide-y">
        {channels.map((c) => (
          <li key={c.channel} className="flex items-center gap-3 py-3">
            <span className={`rounded-pill size-3 shrink-0 ${channelColor[c.channel].dot}`} aria-hidden />
            <div className="min-w-0">
              <p className="text-p4 text-ink">{CHANNEL_LABEL[c.channel]}</p>
              <p className="text-c1 text-ink-secondary">{`${formatNumber(c.sessions)} sessions`}</p>
            </div>
            <span className="bg-muted rounded-pill text-c1 text-ink-body ml-auto px-2 py-0.5">
              {`${total ? Math.round((c.messages / total) * 100) : 0}%`}
            </span>
            <span className="text-s2 text-ink tabular w-14 text-right">{formatNumber(c.messages)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

type QuotaTone = "accent" | "info";

// Card background, ring/bar color and percent text color for each tone.
const quotaTone: Record<QuotaTone, { card: string; fill: string; stroke: string; text: string }> = {
  accent: { card: "bg-accent-tint", fill: "bg-accent", stroke: "stroke-accent", text: "text-accent" },
  info: { card: "bg-info-tint", fill: "bg-info-text", stroke: "stroke-info-text", text: "text-info-text" },
};

/** Plan usage card: ring with the percent, big used / quota number, and a meter. */
export function QuotaCard({
  title,
  icon: Icon,
  tone,
  used,
  quota,
  usedLabel,
  quotaLabel,
  note,
  meter,
}: {
  title: string;
  icon: LucideIcon;
  tone: "accent" | "info";
  used: number;
  quota: number;
  usedLabel: string;
  quotaLabel: string;
  note: string;
  /** "segments": one block per item (chatbots). "bar": one long bar (storage). */
  meter: "segments" | "bar";
}) {
  const percent = quota ? Math.min(100, Math.round((used / quota) * 100)) : 0;
  const colors = quotaTone[tone];
  return (
    <section className={cn("rounded-card-sm border-line border p-6", colors.card)}>
      <div className="flex items-center gap-4">
        <span className="bg-card rounded-small flex size-14 shrink-0 items-center justify-center">
          <Icon className={cn("size-6", colors.text)} aria-hidden />
        </span>
        <h2 className="text-h5 text-ink">{title}</h2>
        <PercentRing percent={percent} className="ml-auto" stroke={colors.stroke} text={colors.text} />
      </div>
      <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <p className="flex items-baseline gap-2">
          <span className="text-h1 text-ink tabular">{usedLabel}</span>
          <span className="text-h5 text-ink-body">{quotaLabel}</span>
        </p>
        <p className="text-p2 text-ink-body">{note}</p>
      </div>
      {meter === "segments" ? (
        <div className="mt-6 flex gap-2" aria-hidden>
          {Array.from({ length: quota }, (_, i) => (
            <span key={i} className={cn("rounded-pill h-3 flex-1", i < used ? colors.fill : "bg-card")} />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-pill mt-6 h-3 overflow-hidden" aria-hidden>
          <div className={cn("rounded-pill h-full", colors.fill)} style={{ width: `${percent}%` }} />
        </div>
      )}
    </section>
  );
}

/** Donut ring with the percent in the middle. */
function PercentRing({
  percent,
  stroke,
  text,
  className,
}: {
  percent: number;
  stroke: string;
  text: string;
  className?: string;
}) {
  return (
    <div className={cn("relative size-18 shrink-0", className)}>
      <svg viewBox="0 0 36 36" className="size-full -rotate-90" aria-hidden>
        <circle cx="18" cy="18" r="15" className="fill-card stroke-card" strokeWidth="4" />
        <circle
          cx="18"
          cy="18"
          r="15"
          pathLength={100}
          strokeDasharray={`${percent} 100`}
          strokeLinecap="round"
          strokeWidth="4"
          className={cn("fill-none", stroke)}
        />
      </svg>
      <span className={cn("text-s2 absolute inset-0 flex items-center justify-center", text)}>{`${percent}%`}</span>
    </div>
  );
}
