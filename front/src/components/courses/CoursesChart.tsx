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
  {
    name: "2024-2",
    calc1: 4.1,
    calc2: 4.0,
    ecuaciones: 4.2,
    software: 4.1,
  },
  {
    name: "2025-1",
    calc1: 4.2,
    calc2: 4.1,
    ecuaciones: 4.1,
    software: 4.2,
  },
  {
    name: "2025-2",
    calc1: 4.3,
    calc2: 4.2,
    ecuaciones: 4.0,
    software: 4.3,
  },
  {
    name: "2026-1",
    calc1: 4.4,
    calc2: 4.3,
    ecuaciones: 3.9,
    software: 4.5,
  },
];

export default function CoursesChart() {
  return (
    <div className="
      bg-white/5
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-xl
      mb-6
    ">

      <h2 className="mb-1 text-gray-200 font-semibold">
        Evolución Histórica por Curso
      </h2>
      <p className="text-gray-400 text-sm mb-4">
        Comparativa de rendimiento semestral
      </p>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>

          <CartesianGrid stroke="rgba(255,255,255,0.08)" />

          <XAxis
            dataKey="name"
            stroke="#94a3b8"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <YAxis
            domain={[3, 5]}
            ticks={[3, 3.5, 4, 4.5, 5]}
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

          <Line type="monotone" dataKey="calc1" stroke="#60a5fa" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="calc2" stroke="#34d399" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="ecuaciones" stroke="#f87171" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="software" stroke="#facc15" strokeWidth={3} dot={{ r: 4, fill: "#facc15" }} />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}