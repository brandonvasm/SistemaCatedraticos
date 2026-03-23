import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "2024-2", value: 4.5 },
  { name: "2025-1", value: 2.6 },
  { name: "2025-2", value: 5.0 },
  { name: "2026-1", value: 4.8 },
];

export default function LineChartComp() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl">
      <h2 className="mb-4">Evolución Histórica</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          
          <XAxis dataKey="name" stroke="#94a3b8" />

          <YAxis
            domain={[4, 5]} 
            ticks={[4, 4.25, 4.5, 4.75, 5]}
            stroke="#94a3b8"
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="value"
            stroke="#facc15"
            strokeWidth={3}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}