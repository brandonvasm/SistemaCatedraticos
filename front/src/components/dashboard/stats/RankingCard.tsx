import { Star, User } from "lucide-react";

interface TeacherProps {
  name: string;
  score: string;
  students: string;
  color: 'green' | 'red';
}

export const TeacherRow = ({ name, score, color }: TeacherProps) => (
  <div className="flex items-center justify-between p-2.5 sm:p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group w-full min-w-0">
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2">
      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${color === 'green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'} border`}>
        <User size={16} className="sm:hidden" />
        <User size={20} className="hidden sm:block" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors uppercase tracking-tight break-words">
          {name}
        </p>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <Star size={10} className="text-yellow-500 flex-shrink-0" fill="currentColor" />
          <span className="text-[9px] sm:text-[10px] text-gray-500 font-black tracking-widest uppercase whitespace-nowrap">
            Promedio: {score}
          </span>
        </div>
      </div>
    </div>
    <div className={`text-lg sm:text-xl font-black tracking-tighter flex-shrink-0 ${color === 'green' ? 'text-emerald-400' : 'text-red-400'}`}>
      {score}
    </div>
  </div>
);

export default function RankingCard({ title, icon: Icon, color, teachers }: any) {
  const isGreen = color === 'green';

  return (
    <div className="bg-[#11141d]/50 border border-white/5 p-4 sm:p-6 rounded-[2rem] sm:rounded-[2.5rem] space-y-4 shadow-xl backdrop-blur-xl relative overflow-hidden group w-full">
      <div className={`flex items-center gap-3 ${isGreen ? 'text-emerald-400' : 'text-red-400'}`}>
        <div className={`p-2 ${isGreen ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-xl flex-shrink-0`}>
          <Icon size={20} />
        </div>
        <h3 className="font-bold uppercase tracking-widest text-[10px] sm:text-[11px] break-words flex-1">{title}</h3>
      </div>
      
      <div className="space-y-3">
        {teachers.map((t: any, i: number) => (
          <TeacherRow key={i} {...t} color={color} />
        ))}
        {teachers.length === 0 && (
          <div className="py-10 text-center text-[10px] text-gray-600 font-bold uppercase tracking-widest">
            Sin datos disponibles
          </div>
        )}
      </div>
    </div>
  );
}