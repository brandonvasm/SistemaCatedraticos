import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { name: "2024-2", value: 1.5 },
  { name: "2025-1", value: 2.6 },
  { name: "2025-2", value: 3.0 },
  { name: "2026-1", value: 4.8 },
];

export default function LineChartComp() {
  return (
    <div
      className="
      
        p-5
        rounded-2xl
        backdrop-blur-2xl
        shadow-xl
      "
    >
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Evolución Histórica
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Desempeño por semestre
        </p>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>

          {/* GRID SUAVE */}
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
          />

          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[4, 5]}
            ticks={[4, 4.25, 4.5, 4.75, 5]}
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 17, 26, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              backdropFilter: "blur(10px)",
              color: "#e5e7eb",
            }}
            labelStyle={{
              color: "#9ca3af",
              fontSize: "12px",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#facc15"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#facc15",
              stroke: "#0f111a",
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: "#fde047",
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}