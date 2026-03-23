import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Dominio", A: 4.8 },
  { subject: "Metodología", A: 8.6 },
  { subject: "Puntualidad", A: 5.7 },
  { subject: "Comunicación", A: 4.6 },
  { subject: "Evaluación", A: 9.5 },
  { subject: "Disponibilidad", A: 2.7 },
  { subject: "Motivación", A: 1.8 },
  { subject: "Ambiente", A: 7.6 },
];

export default function RadarChartComp() {
  return (
    <div className="bg-[#1c2746] p-6 rounded-xl">
      <h2 className="mb-4">Evaluación por Categoría</h2>

      <ResponsiveContainer width="100%" height={250}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
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