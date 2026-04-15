import { Star} from "lucide-react";

export const TeacherMatchCard = ({ teacher }: any) => (
  <div className="glass-card group relative p-8 transition-all hover:bg-white/10 hover:border-white/20">
    <div className="flex flex-col lg:flex-row gap-10">
      
      <div className="flex lg:flex-col items-center gap-6 p-6 bg-white/5 rounded-[2rem] border border-white/10 shadow-inner min-w-[150px]">
        <div className="w-16 h-16 rounded-2xl bg-yellow-400 text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-yellow-400/20">
          {teacher.initials}
        </div>
        <div className="text-center">
          <span className="text-4xl font-black text-white tracking-tighter">{teacher.match}%</span>
        </div>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">{teacher.name}</h3>
            <div className="flex gap-4 mt-3">
              
              
              <span className="px-2 py-0.5 variant-green rounded text-[9px] font-bold uppercase">
                Cumple requisitos
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl shadow-sm">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="text-lg font-black text-white">{teacher.rating}</span>
          </div>
        </div>

        <div className="h-px bg-white/5" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block mb-3">Cursos Actuales:</span>
            <div className="flex gap-2">
              {teacher.currentCourses.map((c: string) => (
                <span key={c} className="px-3 py-1.5 variant-yellow rounded-xl text-[10px] font-bold uppercase tracking-tight">
                  {c}
                </span>
              ))}
            </div>
          </div>
          <div className="space-y-2">
          </div>
        </div>
        <div className="p-5 bg-white/5 border border-white/10 rounded-[1.5rem] shadow-inner">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 italic">Razón de Recomendación (IA):</p>
          <p className="text-sm text-gray-300 font-medium leading-relaxed italic">"{teacher.reason}"</p>
        </div>
      </div>
    </div>
  </div>
);