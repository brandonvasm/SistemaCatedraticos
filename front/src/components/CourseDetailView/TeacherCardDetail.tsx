import { Star} from "lucide-react";

type Props = {
  teacher?: any;
};

export default function TeacherCardDetail({ teacher }: Props) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2); 
  };

  const name = teacher?.teacher_name || "Docente no asignado";
  const rawScore = teacher?.average_rating || 0;
  const score = (rawScore).toFixed(2); 

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-4 rounded-2xl backdrop-blur-2xl hover:bg-white/[0.04] transition-all">
      <div className="flex items-center justify-between gap-4 relative z-10">
        
        <div className="flex items-center gap-3">
          <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs">
            {getInitials(name)}
          </div>
          
          <div>
            <p className="font-black text-white tracking-tight text-[13px] uppercase">
              {name}
            </p>
            <div className="flex items-center gap-2 mt-0.5">
            
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end">
            <Star size={12} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-black text-sm tracking-tighter">
              {score}
            </span>
          </div>
          <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest mt-0.5">
            PROMEDIO DEL CURSO
          </p>
        </div>

      </div>
    </div>
  );
}