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
      bg-[#0f111a]/50 border border-white/10
      p-8
      rounded-[2.5rem]
      backdrop-blur-2xl
      mb-10
    ">

      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          EVOLUCIÓN POR CURSO
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          COMPARATIVA DE RENDIMIENTO SEMESTRAL
        </p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>

          <CartesianGrid stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[3, 5]}
            ticks={[3, 3.5, 4, 4.5, 5]}
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

          <Line type="monotone" dataKey="calc1" stroke="#60a5fa" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="calc2" stroke="#34d399" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="ecuaciones" stroke="#f87171" strokeWidth={2} dot={false} />
          <Line
            type="monotone"
            dataKey="software"
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