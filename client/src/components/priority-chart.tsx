import { Feature } from "@shared/schema";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface PriorityChartProps {
  features: Feature[];
}

export default function PriorityChart({ features }: PriorityChartProps) {
  const data = features
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((feature) => ({
      name: feature.title,
      score: parseFloat(feature.score.toFixed(2)),
    }));

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Top 5 Features by RICE Score</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              stroke="#888888"
            />
            <YAxis stroke="#888888" />
            <Tooltip />
            <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
