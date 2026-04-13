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
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        mb-10
        overflow-hidden
      "
    >
      <div className="absolute -top-24 -right-24 w-56 h-56 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="mb-6 relative z-10">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
          EVOLUCIÓN POR CURSO
        </h2>

        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3 ml-1">
          COMPARATIVA DE RENDIMIENTO SEMESTRAL
        </p>
      </div>

      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />

            <XAxis
              dataKey="name"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[3, 5]}
              ticks={[3, 3.5, 4, 4.5, 5]}
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(15,17,26,0.9)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "16px",
                backdropFilter: "blur(10px)",
                color: "#e5e7eb",
                fontSize: "10px",
                fontWeight: 800,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
              labelStyle={{
                color: "#9ca3af",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
              }}
            />

            <Line
              type="monotone"
              dataKey="calc1"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="calc2"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="ecuaciones"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
            />

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
    </div>
  );
}