import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "2024-2", value: 1.5 },
  { name: "2025-1", value: 2.6 },
  { name: "2025-2", value: 3.0 },
  { name: "2026-1", value: 4.8 },
];

export default function LineChartComp() {
  return (
    <div className="
      bg-white/5
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-xl
    ">
      <h2 className="mb-4 text-gray-200 font-semibold">
        Evolución Histórica
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <YAxis
            domain={[4, 5]}
            ticks={[4, 4.25, 4.5, 4.75, 5]}
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#e5e7eb",
            }}
            labelStyle={{ color: "#94a3b8" }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#facc15" 
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#facc15",
              stroke: "#1e293b",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 7,
              fill: "#fde047", 
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}