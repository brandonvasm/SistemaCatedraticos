import { BookOpen, TrendingUp } from "lucide-react";

export default function CourseHeader() {
  return (
    <div className="bg-[#0f111a]/50 border border-white/10 backdrop-blur-2xl p-8 rounded-[2.5rem] flex flex-col md:flex-row justify-between items-center gap-6">

      <div className="flex gap-5 items-center">

        <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
          <BookOpen className="text-blue-400" size={22} />
        </div>

        <div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
            INGENIERÍA DE SOFTWARE
          </h1>

          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
            METODOLOGÍAS · DESARROLLO · SISTEMAS
          </p>
        </div>

      </div>

      <div className="flex items-center gap-2 text-emerald-400 font-black text-lg">
        <TrendingUp size={18} />
        +0.4
      </div>

    </div>
  );
}