import { Star } from "lucide-react";

interface TeacherProps {
  name: string;
  score: string;
  students: string;
  color: 'green' | 'red';
}

export const TeacherRow = ({ name, score,  color }: TeacherProps) => (
  <div className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
    <div className="flex items-center gap-3">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl bg-${color}-500/10 border border-${color}-500/20`}>👤</div>
      <div>
        <p className="text-sm font-bold text-white group-hover:text-accent transition-colors">{name}</p>
        <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-black">
          <Star size={10} className="text-yellow-500" fill="currentColor" />

        </div>
      </div>
    </div>
    <div className={`text-xl font-black ${color === 'green' ? 'text-green-400' : 'text-red-400'}`}>{score}</div>
  </div>
);

export default function RankingCard({ title, icon: Icon, color, teachers }: any) {
  return (
    <div className={`bg-secondary/20 border border-white/5 p-6 rounded-3xl space-y-4 shadow-xl`}>
      <div className={`flex items-center gap-3 ${color === 'green' ? 'text-green-400' : 'text-red-400'}`}>
        <div className={`p-2 bg-${color}-500/10 rounded-lg`}><Icon size={20} /></div>
        <h3 className="font-bold tracking-tight">{title}</h3>
      </div>
      {teachers.map((t: any, i: number) => (
        <TeacherRow key={i} {...t} color={color} />
      ))}
    </div>
  );
}