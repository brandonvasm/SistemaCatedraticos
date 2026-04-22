import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Dominio", A: 8.8 },
  { subject: "Metodología", A: 8.6 },
  { subject: "Puntualidad", A: 9.7 },
  { subject: "Comunicación", A: 9.6 },
  { subject: "Evaluación", A: 9.5 },
  { subject: "Disponibilidad", A: 9.7 },
  { subject: "Motivación", A: 8.8 },
  { subject: "Ambiente", A: 7.6 },
];

export default function RadarChartComp() {
  return (
    <div
      className="
        bg-[#1e2230]/60
        border border-white/5
        rounded-3xl
        p-8
        shadow-2xl
        h-full
        w-full
        mx-auto
        backdrop-blur-2xl
        relative
        overflow-hidden
      "
    >
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Evaluación por Categoría
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-1">
          Competencias docentes
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.05)" />

          <PolarAngleAxis
            dataKey="subject"
            tick={{
              fill: "#64748b",
              fontSize: 10,
              fontWeight: 700,
            }}
          />

          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{
              fill: "#475569",
              fontSize: 9,
              fontWeight: 700,
            }}
          />

          <Radar
            dataKey="A"
            stroke="#facc15"
            strokeWidth={2}
            fill="#facc15"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}