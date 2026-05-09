import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Loader2, Inbox, BarChart3, Target } from "lucide-react";
import { motion } from "framer-motion";
import { careerService } from "../../services/careerService";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f111a] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-emerald-400 flex justify-between gap-4">
            <span className="uppercase opacity-60">Docentes:</span>
            <span>{payload[0].value.toFixed(1)}</span>
          </p>
          <p className="text-[11px] font-bold text-blue-400 flex justify-between gap-4">
            <span className="uppercase opacity-60">Control:</span>
            <span>{payload[1].value.toFixed(1)}</span>
          </p>
        </div>
      </div>
    );
  }
  return null;
};

export default function CareerStatsChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await careerService.getCareerAverages();
        setData(res);
      } catch (error) {
        console.error("Error cargando estadísticas de carreras:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-[520px] flex flex-col backdrop-blur-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">Promedios Facultad</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 ">Rendimiento por Carrera</p>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-yellow-400" size={32} />
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 9, fontWeight: 900 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 9 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingTop: '0', paddingBottom: '20px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}
              />
              <Bar 
                name="Puntaje Docente" 
                dataKey="avg_teacher_score" 
                fill="#34d399" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
              />
              <Bar 
                name="Control Cursos" 
                dataKey="avg_course_control_score" 
                fill="#60a5fa" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-700">
            <Inbox size={40} className="mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sin datos disponibles</span>
          </div>
        )}
      </div>
      <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
          <Target size={16} className="text-emerald-400" />
          <div>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1">Métrica Clave</p>
            <p className="text-[11px] font-bold text-white uppercase">Eficiencia Docente</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
          <BarChart3 size={16} className="text-blue-400" />
          <div>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1">Total Carreras</p>
            <p className="text-[11px] font-bold text-white">{data.length}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}