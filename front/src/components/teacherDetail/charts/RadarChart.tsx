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
        p-6
        rounded-[2.5rem]
        backdrop-blur-2xl
        shadow-xl
      "
    >
      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          EVALUACIÓN POR CATEGORÍA
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          COMPETENCIAS DOCENTES
        </p>
      </div>

      <ResponsiveContainer width="100%" height={270}>
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