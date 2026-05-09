import { useEffect, useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";
import { Loader2, Inbox, GraduationCap, Award, BookOpen} from "lucide-react"; 
import { motion } from "framer-motion";
import { teacherService } from "../../../services/teacherService";

interface Props {
  teacherId: string | number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f111a] border border-white/10 px-3 py-2 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
          {payload[0].payload.subject}
        </p>
        <p className="text-sm font-bold text-yellow-400">
          {payload[0].value} <span className="text-[9px] text-white/50 uppercase">Horas</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function TrainingRadarChart({ teacherId }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrainingData = async () => {
      const numericId = Number(teacherId);
      if (isNaN(numericId)) return;

      try {
        setLoading(true);
        const res = await teacherService.getTrainingHours(numericId);
        
        if (res && res.length > 0) {
          const raw = res[0];
          const formattedData = [
            { subject: "Iniciación", value: raw.initiation_count },
            { subject: "Transición", value: raw.transition_count },
            { subject: "Autonomía", value: raw.autonomy_count },
            { subject: "Complementaria", value: raw.complementary_count },
          ];
          setData(formattedData);
        }
      } catch (error) {
        console.error("Error cargando formación:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingData();
  }, [teacherId]);

  const totalHours = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-[520px] flex flex-col backdrop-blur-2xl relative overflow-hidden"
    >
      {/* Encabezado */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-400 border border-white/10 shadow-inner">
            <GraduationCap size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">CEAT</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ">Distribucion de Horas</p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex items-center justify-center mb-6 px-4">
        {loading ? (
          <Loader2 className="animate-spin text-yellow-400" size={32} />
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
              <PolarGrid stroke="rgba(255,255,255,0.05)" />
              <PolarAngleAxis 
                dataKey="subject" 
                tick={{ fill: "#64748b", fontSize: 9, fontWeight: 900, letterSpacing: '0.05em' }} 
              />
              <PolarRadiusAxis domain={[0, 'auto']} tick={false} axisLine={false} />
              
              <Tooltip content={<CustomTooltip />} cursor={false} />

              <Radar
                dataKey="value"
                stroke="#facc15"
                strokeWidth={3}
                fill="#facc15"
                fillOpacity={0.1}
                dot={{ 
                  r: 5, 
                  fill: "#facc15", 
                  strokeWidth: 2, 
                  stroke: "#1e2230",
                  className: "cursor-pointer hover:r-7 transition-all" 
                }}
                activeDot={{ r: 8, fill: "#facc15", stroke: "#fff" }}
              />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center text-gray-700">
            <Inbox size={32} className="mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sin datos</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 bg-[#1e2230]/20 -mx-8 px-8 pb-2">

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <BookOpen size={12} className="text-yellow-400" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Total Horas</span>
          </div>
          <span className="text-[11px] font-bold text-white">
            {totalHours} <span className="text-[9px] opacity-50 uppercase tracking-tighter">HRS</span>
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Award size={12} className="text-emerald-400" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Categorías</span>
          </div>
          <span className="text-[11px] font-bold text-white uppercase ">
            {data.length} Áreas
          </span>
        </div>
      </div>
    </motion.div>
  );
}