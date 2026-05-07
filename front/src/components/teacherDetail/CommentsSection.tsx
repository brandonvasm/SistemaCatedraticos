import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Loader2, Sparkles } from "lucide-react";
import { teacherService } from "../../services/teacherService";
import type { CommentData, TeacherProfileAnalysis } from "../../types/teacher";

export default function CommentsSection({ teacherId }: { teacherId: string | undefined }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [analysis, setAnalysis] = useState<TeacherProfileAnalysis | null>(null);
  
  const [loadingComments, setLoadingComments] = useState(true);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    async function processData() {
      if (!teacherId) return;
      
      try {
        setLoadingComments(true);
        const resComments = await teacherService.getTeacherComments(teacherId);
        const rawTexts: string[] = resComments.comentarios || [];
        
        const formatted: CommentData[] = rawTexts.map((text, i) => ({
          id: i,
          text,
          rating: 0, 
          sentiment: "neutral",
          date: new Date().toISOString()
        }));
        
        setComments(formatted);
        setLoadingComments(false);

        if (rawTexts.length > 0) {
          setLoadingAnalysis(true);
          const resAnalysis = await teacherService.analyzeComments(
            parseInt(teacherId), 
            rawTexts
          );
          setAnalysis(resAnalysis);
          setLoadingAnalysis(false);
        }
      } catch (error) {
        console.error("Error:", error);
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
      <Loader2 className="w-8 h-8 animate-spin text-yellow-400 opacity-20" />
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <div className="flex justify-between text-[11px] font-black text-gray-400 tracking-widest uppercase">
          <span className="text-emerald-400">Positivo {stats.goodPercent}%</span>
          <span className="text-red-400">Crítico {stats.badPercent}%</span>
        </div>
        
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden flex">
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${stats.goodPercent}%` }} 
            className="bg-emerald-400 h-full" 
          />
          <motion.div 
            initial={{ width: 0 }} 
            animate={{ width: `${stats.badPercent}%` }} 
            className="bg-red-400 h-full" 
          />
        </div>


        {loadingAnalysis ? (
          <div className="flex items-center gap-3 p-4 bg-yellow-400/5 border border-yellow-400/10 rounded-2xl animate-pulse">
            <Sparkles className="text-yellow-400" size={14} />
            <span className="text-[10px] text-yellow-400/70 font-black uppercase tracking-widest">
              Analizando comentarios... esto tomará unos segundos
            </span>
          </div>
        ) : analysis?.comment && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-white/5 rounded-2xl border border-white/5"
          >
            <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-widest font-bold mb-1">
              Resumen de la IA
            </p>
            <p className="text-[11px] text-gray-500 leading-relaxed italic">
              {analysis.comment}
            </p>
          </motion.div>
        )}
      </div>

      <div className="grid gap-4">
        {comments.length > 0 ? (
          comments.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0f111a]/50 border border-white/10 p-6 rounded-[2rem] hover:border-white/20 transition-all"
            >
              <p className="text-[13px] text-gray-300 leading-relaxed font-medium">
                {c.text}
              </p>
            </motion.div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-16 bg-[#0f111a]/30 border border-dashed border-white/5 rounded-[3rem]">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">
              Sin comentarios
            </p>
          </div>
        )}
      </div>
    </div>
  );
}