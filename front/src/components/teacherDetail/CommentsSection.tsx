import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles, MessageSquare } from "lucide-react";
import { teacherService } from "../../services/teacherService";
import type { CommentData } from "../../types/teacher";

export default function CommentsSection({ teacherId }: { teacherId: string | undefined }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [analysis, setAnalysis] = useState<any | null>(null);
  
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    async function processData() {
      if (!teacherId) return;
      
      try {
        setLoadingComments(true);
        const resComments = await teacherService.getTeacherComments(teacherId);
        const rawTexts: string[] = resComments.comentarios || [];
        
        setComments(rawTexts.map((text, i) => ({
          id: i,
          text,
          rating: 0, 
          sentiment: "neutral",
          date: new Date().toISOString()
        })));
        setLoadingComments(false);

        if (rawTexts.length > 0) {
          setLoadingAnalysis(true);
          const response = await teacherService.analyzeComments(
            parseInt(teacherId), 
            rawTexts
          );

          if (response.task_id) {
            let completed = false;
            let attempts = 0;
            const maxAttempts = 20; 

            while (!completed && attempts < maxAttempts) {
              const check = await teacherService.getAnalysisStatus(response.task_id);
              
              if (check.state === 'SUCCESS' && check.result?.analysis) {
                setAnalysis(check.result.analysis); 
                completed = true;
              } else if (check.state === 'FAILURE') {
                console.error("La tarea de Celery falló");
                completed = true;
              } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                attempts++;
              }
            }
          }
          setLoadingAnalysis(false);
        }
      } catch (error) {
        console.error("Error en la carga de datos:", error);
        setLoadingComments(false);
        setLoadingAnalysis(false);
      }
    }

    processData();
  }, [teacherId]);

  const stats = useMemo(() => {
    if (analysis) {
      return {
        goodPercent: Math.round(analysis.positive_percentage || 0),
        badPercent: Math.round(analysis.negative_percentage || 0),
      };
    }
    return { goodPercent: 0, badPercent: 0 };
  }, [analysis]);

  if (loadingComments) return (
    <div className="flex flex-col items-center justify-center p-20">
      <Loader2 className="w-6 h-6 animate-spin text-yellow-400 opacity-20" />
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      <div className="space-y-4">
        <div className="flex justify-between text-[11px] font-black tracking-[0.2em] uppercase px-1">
          <span className="text-emerald-400">Positivo {stats.goodPercent}%</span>
          <span className="text-red-400">Crítico {stats.badPercent}%</span>
        </div>
        
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden flex">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${stats.goodPercent}%` }} 
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-emerald-400 h-full shadow-[0_0_8px_rgba(52,211,153,0.4)]" 
          />
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${stats.badPercent}%` }} 
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="bg-red-500/30 h-full" 
          />
        </div>

        {loadingAnalysis ? (
          <div className="flex items-center gap-3 p-4 bg-white/[0.02] border border-white/5 rounded-2xl animate-pulse">
            <Sparkles className="text-yellow-400" size={12} />
            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">
              Generando análisis con IA...
            </span>
          </div>
        ) : (
          analysis?.comment && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 bg-gradient-to-r from-white/[0.03] to-transparent rounded-[2rem] border-l-2 border-yellow-400/30 backdrop-blur-sm"
            >
              <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-2">
                Resumen de la IA
              </p>
              <p className="text-[11px] text-gray-400 leading-relaxed italic font-medium">
                "{analysis.comment}"
              </p>
            </motion.div>
          )
        )}
      </div>

      <div className="flex items-end justify-between px-1 border-b border-white/5 pb-4">
        <div className="relative">
          <h3 className="text-[12px] font-black text-white uppercase tracking-[0.5em]">
            Comentarios
          </h3>
          <span className="absolute -top-1 -right-8 text-[16px] font-black text-yellow-400/40">
            /{comments.length.toString().padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="relative">
        <div className="flex overflow-x-auto gap-6 pb-6 pt-2 custom-scrollbar snap-x snap-mandatory">
          {comments.length > 0 ? (
            comments.map((c) => (
              <motion.div
                key={c.id}
                whileHover={{ scale: 1.02 }}
                className="flex-none w-[280px] snap-start bg-[#0f111a]/40 border border-white/5 p-6 rounded-[2.5rem] relative flex flex-col justify-center min-h-[120px]"
              >
                <MessageSquare className="absolute -bottom-2 -right-2 text-white/[0.01]" size={60} />
                <p className="text-[12px] text-gray-400 leading-relaxed font-medium line-clamp-3 relative z-10">
                  {c.text}
                </p>
              </motion.div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center py-10 opacity-20 border border-dashed border-white/10 rounded-[2.5rem]">
              <p className="text-[10px] font-black uppercase tracking-widest">Sin comentarios</p>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 2px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 10px; 
        }
      `}} />
    </div>
  );
}