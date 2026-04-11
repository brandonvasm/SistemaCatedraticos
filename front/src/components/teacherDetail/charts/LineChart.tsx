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
        p-6
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-xl
      "
    >
      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          EVOLUCIÓN HISTÓRICA
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          DESEMPEÑO POR SEMESTRE
        </p>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.05)"
          />

          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[4, 5]}
            ticks={[4, 4.25, 4.5, 4.75, 5]}
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 17, 26, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
              backdropFilter: "blur(10px)",
              color: "#e5e7eb",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
            labelStyle={{
              color: "#9ca3af",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
            }}
          />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#facc15"
            strokeWidth={3}
            dot={{
              r: 5,
              fill: "#facc15",
              stroke: "#0f111a",
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