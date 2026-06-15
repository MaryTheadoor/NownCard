import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import type { DailyAnalytics } from "@/shared/api/types";

interface AnalyticsChartProps {
  data: DailyAnalytics[];
}

export function AnalyticsChart({ data }: AnalyticsChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-ink-faint">
        No analytics data yet. Share your card to start tracking views.
      </div>
    );
  }

  const chartData = [...data]
    .reverse()
    .map((d) => ({ date: d.date.slice(5), views: d.views, saves: d.saves }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line-soft)" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis fontSize={12} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey="views" stroke="var(--brand-yellow)" strokeWidth={2} dot={false} name="Views" />
          <Line type="monotone" dataKey="saves" stroke="var(--ink-faint)" strokeWidth={2} dot={false} name="Saves" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
