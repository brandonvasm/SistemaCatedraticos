import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Calidad", A: 4.8, color: "#facc15" },
  { subject: "Puntualidad", A: 4.6, color: "#3b82f6" },
  { subject: "Claridad", A: 4.5, color: "#22c55e" },
  { subject: "Disponibilidad", A: 4.7, color: "#ef4444" },
  { subject: "Material", A: 4.6, color: "#a78bfa" },
];

export default function RadarChartTeachers() {
  return (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-80">

      <p className="mb-2 text-sm text-gray-300">
        Análisis Multidimensional
      </p>

      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.08)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />
          <Radar
            dataKey="A"
            stroke="#facc15"
            fill="#facc15"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>

    </div>
  );
}