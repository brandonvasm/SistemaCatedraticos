import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "García", value: 4.8 },
  { name: "Juárez", value: 4.6 },
  { name: "Ramírez", value: 4.5 },
  { name: "González", value: 4.3 },
  { name: "Martínez", value: 4.1 },
];

const colors = ["#60a5fa", "#34d399", "#facc15", "#f87171", "#a78bfa"];

export default function BarChartTeachers() {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-64">

      <p className="mb-2 text-sm text-gray-300">
        Comparación de Docentes
      </p>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#aaa" />
          <YAxis domain={[0, 5]} stroke="#aaa" />

          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>

        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}