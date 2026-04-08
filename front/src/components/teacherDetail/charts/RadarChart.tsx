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
      
        p-5
        rounded-2xl
        backdrop-blur-2xl
        shadow-xl
      "
    >
      {/* HEADER */}
      <div className="mb-4">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Evaluación por Categoría
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Competencias docentes
        </p>
      </div>

      {/* CHART */}
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>

          {/* GRID */}
          <PolarGrid stroke="rgba(255,255,255,0.05)" />

          {/* LABELS */}
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#64748b", fontSize: 11 }}
          />

          {/* ESCALA */}
          <PolarRadiusAxis
            angle={30}
            domain={[0, 10]}
            tick={{ fill: "#475569", fontSize: 10 }}
          />

          {/* RADAR */}
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