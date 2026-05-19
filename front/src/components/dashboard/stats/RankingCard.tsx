import { Star, User } from "lucide-react";

interface TeacherProps {
  name: string;
  score: string;
  students: string;
  color: 'green' | 'red';
}

export const TeacherRow = ({ name, score, color }: TeacherProps) => (
  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all w-full min-w-0">
    <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${color === 'green' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
        <User size={20} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-white uppercase tracking-tight truncate block">
          {name}
        </p>
        <div className="flex items-center gap-1.5 mt-1">
          <Star size={10} className="text-yellow-500" fill="currentColor" />
          <span className="text-[10px] text-gray-500 font-black tracking-widest uppercase">
            Promedio: {score}
          </span>
        </div>
      </div>
    </div>
    <div className={`text-lg font-black tracking-tighter shrink-0 ${color === 'green' ? 'text-emerald-400' : 'text-red-400'}`}>
      {score}
    </div>
  </div>
);
export default function RankingCard({ title, icon: Icon, color, teachers }: any) {
  const isGreen = color === 'green';

  return (
    <div className="bg-[#11141d]/50 border border-white/5 p-6 rounded-[2.5rem] shadow-xl backdrop-blur-xl relative overflow-hidden group w-full h-full flex flex-col">
      <div className={`flex items-center gap-3 mb-6 ${isGreen ? 'text-emerald-400' : 'text-red-400'}`}>
        <div className={`p-2 ${isGreen ? 'bg-emerald-500/10' : 'bg-red-500/10'} rounded-xl`}>
          <Icon size={20} />
        </div>
        <h3 className="font-bold uppercase tracking-widest text-[11px] truncate">{title}</h3>
      </div>
      
      <div className="space-y-3 flex-1">
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