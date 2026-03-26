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
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-64">

      <p className="mb-2 text-sm text-gray-300">
        Evolución del Curso
      </p>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
          <YAxis domain={[3, 5]} stroke="#94a3b8" tick={{ fill: "#94a3b8" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15, 23, 42, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "10px",
              color: "#e5e7eb",
            }}
            labelStyle={{ color: "#94a3b8" }}
          />

          <Line type="monotone" dataKey="calc1" stroke="#facc15" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="calc2" stroke="#3b82f6" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="software" stroke="#22c55e" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="ecuaciones" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}