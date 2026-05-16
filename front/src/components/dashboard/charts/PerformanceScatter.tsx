import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Activity, Inbox, User, Star, BookOpen } from "lucide-react";
import { teacherService } from "../../../services/teacherService";
import type { TeacherWorkload } from "../../../types/teacher";

export default function PerformanceScatter({ teacherId }: { teacherId: string | number }) {
  const [points, setPoints] = useState<TeacherWorkload[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!teacherId) return;
      try {
        setLoading(true);
        const data = await teacherService.getTeacherWorkload(teacherId);
        setPoints(data);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [teacherId]);

  const teacher = points[0] || null;

  const maxCredits = useMemo(() => 
    Math.max(teacher?.total_credits || 0, 20) * 1.3, 
  [teacher]);

  const xPos = teacher ? (teacher.total_credits / maxCredits) * 100 : 0;
  const yPos = teacher ? ((teacher.avg_score || 0) / 105) * 100 : 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-[520px] flex flex-col backdrop-blur-2xl relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10 shadow-inner">
            <Activity size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Carga vs Rendimiento</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ">Análisis de  creditos y punteo promedio</p>
          </div>
        </div>
      </div>

      <div className="relative flex-1 flex mt-2 mb-10 mr-4 ml-8">
        
        <div className="absolute inset-0 border-l border-b border-white/10" />


        <div className="absolute -left-10 h-full flex flex-col justify-between py-1 text-[9px] font-black text-gray-600 uppercase">
          <span>100</span>
          <span>50</span>
          <span>0</span>
        </div>

        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="animate-spin text-yellow-400" size={32} />
          </div>
        ) : teacher ? (
          <div className="relative w-full h-full">
            <AnimatePresence>
          
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xPos}%` }}
                className="absolute border-t border-dashed border-white/20 z-0"
                style={{ bottom: `${yPos}%`, left: 0 }}
              />
              <motion.div 
                initial={{ height: 0 }}
                animate={{ height: `${yPos}%` }}
                className="absolute border-l border-dashed border-white/20 z-0"
                style={{ left: `${xPos}%`, bottom: 0 }}
              />

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute z-10"
                style={{ 
                  left: `${xPos}%`, 
                  bottom: `${yPos}%`,
                  transform: 'translate(-50%, 50%)' 
                }}
              >
                <div className="absolute inset-0 rounded-full bg-yellow-400/20 animate-ping" />
                <div className="relative w-5 h-5 bg-yellow-400 rounded-full border-[4px] border-[#1e2230] shadow-xl" />
                
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0f111a] border border-white/10 px-3 py-1 rounded-lg shadow-2xl whitespace-nowrap">
                  <span className="text-[9px] font-black text-white uppercase">Posicionamiento</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
            <Inbox size={32} className="mb-2 opacity-20" />
            <span className="text-[10px] font-black uppercase tracking-widest">Sin registros</span>
          </div>
        )}

        <div className="absolute -bottom-8 right-0 text-[9px] font-black text-gray-600 uppercase tracking-widest">
          {maxCredits.toFixed(0)} CREDITOS
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5 bg-[#1e2230]/20 -mx-8 px-8 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <User size={12} className="text-blue-400" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Docente</span>
          </div>
          <span className="text-[11px] font-bold text-white truncate">
            {teacher?.teacher_name || "---"}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <BookOpen size={12} className="text-yellow-400" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Créditos Totales</span>
          </div>
          <span className="text-[11px] font-bold text-white">
            {teacher?.total_credits || 0} <span className="text-[9px] opacity-50 uppercase">Creditos</span>
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-gray-500">
            <Star size={12} className="text-emerald-400" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Punteo Promedio</span>
          </div>
          <span className="text-[11px] font-bold text-white uppercase">
            {teacher?.avg_score ? `${teacher.avg_score.toFixed(1)} Pts` : "N/A"}
          </span>
        </div>
      </div>
    </motion.div>
  );
}