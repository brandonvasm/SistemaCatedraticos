import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import { chartService } from "../../services/chartService";

interface SemesterData {
  name: string;
  rating: number;
}

export default function LineChartCourse({ courseId }: { courseId?: string }) {
  const [data, setData] = useState<SemesterData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvolution = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const response = await chartService.getCourseEvolution(courseId);

        if (response && response.semester_ratings && response.semester_ratings.length > 0) {
          const chartData = response.semester_ratings.map((item: any) => ({
            name: `${item.semester_year}-${item.semester_number}`,
            rating: parseFloat(item.rating) || 0,
          }));
          setData(chartData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error al cargar evolución:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvolution();
  }, [courseId]);

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
        h-80
        overflow-hidden
      "
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="mb-6 relative z-10">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          EVOLUCIÓN DEL CURSO
        </h2>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3 ml-1">
          {loading ? "Sincronizando Historial..." : "Historial de Calificaciones"}
        </p>
      </div>

      <div className="relative z-10 h-[75%] flex items-center justify-center">
        {loading ? (
          <div className="text-[10px] text-gray-500 font-black uppercase animate-pulse">
            Cargando datos...
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis
                domain={[0, 'auto']} 
                stroke="#6b7280"
                tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,17,26,0.9)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                }}
              />
              <Line
                type="monotone"
                dataKey="rating"
                stroke="#facc15"
                strokeWidth={4}
                dot={{ fill: "#facc15", r: 4, strokeWidth: 2, stroke: "#111" }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="w-12 h-px bg-white/20" />
            <p className="text-[10px] text-white font-black uppercase tracking-[0.3em]">
              Sin registros históricos
            </p>
            <div className="w-12 h-px bg-white/20" />
          </div>
        )}
      </div>
    </div>
  );
}