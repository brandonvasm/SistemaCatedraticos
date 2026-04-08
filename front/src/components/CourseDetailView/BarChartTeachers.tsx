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
    <div className="bg-[#0f111a]/50 border border-white/10 p-5 rounded-2xl backdrop-blur-2xl shadow-xl h-72">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Comparación de Docentes
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Rendimiento promedio
        </p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <BarChart data={data}>
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
              backgroundColor: "rgba(15,17,26,0.95)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              color: "#e5e7eb",
              fontSize: "12px",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />

          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={index} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}