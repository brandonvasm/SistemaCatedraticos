import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { name: "García", value: 4.8 },
  { name: "Juárez", value: 4.6 },
  { name: "Ramírez", value: 4.5 },
  { name: "González", value: 4.3 },
  { name: "Martínez", value: 4.1 },
];

const colors = ["#facc15", "#34d399", "#60a5fa", "#f87171", "#a78bfa"];

export default function BarChartTeachers() {
  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-xl
        h-80
        overflow-hidden
      "
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="mb-6 relative z-10">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          DOCENTES
        </h2>

        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3 ml-1">
          RENDIMIENTO PROMEDIO
        </p>
      </div>

      <div className="relative z-10 h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.05)" />

            <XAxis
              dataKey="name"
              stroke="#6b7280"
              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[3.5, 5]}
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

            <Bar dataKey="value" radius={[12, 12, 0, 0]}>
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}