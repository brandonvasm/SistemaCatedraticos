import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {  Loader2 } from "lucide-react";
import { teacherService } from "../../services/teacherService";

interface CommentData {
  id: number;
  text: string;
  rating: number;
  sentiment: "good" | "bad";
  date: string;
}

export default function CommentsSection({ teacherId }: { teacherId: string | undefined }) {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchComments() {
      if (!teacherId) return;
      try {
        setLoading(true);
        const response = await teacherService.getTeacherComments(teacherId);

        const rawList = response.comentarios || [];
        const mappedComments: CommentData[] = rawList.map((text: string, index: number) => ({
          id: index,
          text: text,
        }));

        setComments(mappedComments);
      } catch (error) {
        console.error("Error:", error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    }
    fetchComments();
  }, [teacherId]);

  const stats = useMemo(() => {
    const total = comments.length;
    const good = comments.filter(c => c.sentiment === "good").length;
    const bad = comments.filter(c => c.sentiment === "bad").length;
    return {
      total,
      goodPercent: total > 0 ? Math.round((good / total) * 100) : 0,
      badPercent: total > 0 ? Math.round((bad / total) * 100) : 0,
    };
  }, [comments]);

  if (loading) return (
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
      </div>

      <div className="grid gap-4">
        {comments.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#0f111a]/50 border border-white/10 p-6 rounded-[2rem] hover:border-white/20 transition-all"
          >
            
            <p className="text-[13px] text-gray-300 leading-relaxed font-medium">
              {c.text}
            </p>

            
          </motion.div>
        ))}
      </div>
    </div>
  );
}