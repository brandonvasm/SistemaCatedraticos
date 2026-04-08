import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Calidad", A: 4.8 },
  { subject: "Puntualidad", A: 4.6 },
  { subject: "Claridad", A: 4.5 },
  { subject: "Disponibilidad", A: 4.7 },
  { subject: "Material", A: 4.6 },
];

export default function RadarChartTeachers() {
  return (
    <div className="bg-[#0f111a]/50 border border-white/10 p-5 rounded-2xl backdrop-blur-2xl shadow-xl h-80">
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Análisis Multidimensional
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Evaluación por categoría
        </p>
      </div>

      <ResponsiveContainer width="100%" height="80%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.05)" />

          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#64748b", fontSize: 11 }}
          />

          <Radar
            dataKey="A"
            stroke="#facc15"
            fill="#facc15"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}