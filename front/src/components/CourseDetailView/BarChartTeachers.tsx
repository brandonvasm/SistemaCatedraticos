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
    <div className="bg-[#0f111a]/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl h-80">

      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          DOCENTES
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          RENDIMIENTO PROMEDIO
        </p>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <BarChart data={data}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />

          <XAxis
            dataKey="name"
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[3.5, 5]}
            stroke="#64748b"
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(15,17,26,0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "16px",
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

          <Bar dataKey="value" radius={[10, 10, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}