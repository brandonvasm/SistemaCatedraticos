import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useEffect, useState } from "react";
import { courseService } from "../../services/courseService";

const colors = ["#facc15", "#34d399", "#60a5fa", "#f87171", "#a78bfa"];

export default function BarChartTeachers({ courseId }: { courseId?: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const res = await courseService.getCourseTeachersStats(courseId);
        
        if (Array.isArray(res) && res.length > 0) {
          const formattedData = res.map((item) => ({
            name: item.teacher_name?.split(" ")[0] || "Docente", 
            value: parseFloat(item.average_rating) || 0,
          }));
          setData(formattedData);
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error cargando stats de docentes:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [courseId]);

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl h-80 overflow-hidden">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.01] blur-[80px] rounded-full pointer-events-none" />
      
      <div className="mb-6 relative z-10">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          DOCENTES
        </h2>
        <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3 ml-1">
          {loading ? "Sincronizando..." : "Rendimiento por curso"}
        </p>
      </div>

      <div className="relative z-10 h-[75%] flex items-center justify-center">
        {loading ? (
          <div className="text-[10px] text-gray-500 font-black uppercase animate-pulse">
            Cargando docentes...
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                domain={[0, 100]}
                stroke="#6b7280"
                tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,17,26,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "16px",
                  backdropFilter: "blur(10px)",
                }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-40">
            <div className="w-12 h-px bg-white/20" />
            <p className="text-[10px] text-white font-black uppercase tracking-[0.3em]">
              Sin docentes asignados
            </p>
            <div className="w-12 h-px bg-white/20" />
          </div>
        )}
      </div>
    </div>
  );
}