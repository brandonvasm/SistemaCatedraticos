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
    <div className="bg-[#0f111a]/50 border border-white/10 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl h-96">

      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          ANÁLISIS MULTIDIMENSIONAL
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          EVALUACIÓN POR CATEGORÍA
        </p>
      </div>

      <ResponsiveContainer width="100%" height="75%">
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.05)" />

          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
          />

          <Radar
            dataKey="A"
            stroke="#facc15"
            fill="#facc15"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}