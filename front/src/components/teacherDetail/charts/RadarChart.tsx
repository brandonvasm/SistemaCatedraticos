import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
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
    <div className="
      bg-white/5
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-xl
    ">
      <h2 className="mb-4 text-gray-200 font-semibold">
        Evaluación por Categoría
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>

          <PolarGrid stroke="rgba(255,255,255,0.1)" />

          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "#94a3b8", fontSize: 12 }}
          />

          <Radar
            dataKey="A"
            stroke="#facc15"   
            fill="#facc15"
            fillOpacity={0.3}  
          />

        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}