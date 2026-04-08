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
  { name: "2024-2", calc1: 4.0, calc2: 4.1, software: 4.2, ecuaciones: 4.3 },
  { name: "2025-1", calc1: 4.2, calc2: 4.0, software: 4.3, ecuaciones: 4.1 },
  { name: "2025-2", calc1: 4.3, calc2: 4.2, software: 4.0, ecuaciones: 4.2 },
  { name: "2026-1", calc1: 4.5, calc2: 4.3, software: 4.4, ecuaciones: 4.1 },
];

export default function LineChartCourse() {
  return (
    <div
      className="
        bg-[#0f111a]/50
        border border-white/10
        p-5
        rounded-2xl
        backdrop-blur-2xl
        shadow-xl
        h-72
      "
    >

      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Evolución del Curso
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Comparación por asignatura
        </p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>

          <CartesianGrid stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 11 }}
          />

          <YAxis
            domain={[3.5, 5]}
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 11 }}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 17, 26, 0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#e5e7eb",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />

          <Line
            type="monotone"
            dataKey="calc1"
            stroke="#facc15" 
            strokeWidth={2.5}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="calc2"
            stroke="#60a5fa" 
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="software"
            stroke="#34d399" 
            strokeWidth={2}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="ecuaciones"
            stroke="#f87171" 
            strokeWidth={2}
            dot={false}
          />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}