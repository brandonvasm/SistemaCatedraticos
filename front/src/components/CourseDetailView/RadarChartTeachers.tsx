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
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-8
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-xl
        h-96
        overflow-hidden
      "
    >
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-yellow-400/[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="mb-6 relative z-10">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          ANÁLISIS MULTIDIMENSIONAL
        </h2>

        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3 ml-1">
          EVALUACIÓN POR CATEGORÍA
        </p>
      </div>

      <div className="relative z-10 h-[75%]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />

            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
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
    </div>
  );
}