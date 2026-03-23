import { BarChart3 } from "lucide-react";

export default function CourseBarChart() {
  const courses = [
    { name: "Programación I", score: 92, color: "bg-accent" },
    { name: "Cálculo Diferencial", score: 78, color: "bg-blue-500" },
    { name: "Física Básica", score: 85, color: "bg-accent" },
    { name: "Estadística I", score: 64, color: "bg-red-500" },
    { name: "Sistemas Operativos", score: 88, color: "bg-accent" },
  ];

  return (
    <div className="bg-secondary/20 border border-white/5 rounded-3xl p-6 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
          <BarChart3 size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Rendimiento por Curso</h3>
          <p className="text-xs text-gray-500 italic">Comparativa de promedios académicos</p>
        </div>
      </div>

      <div className="space-y-5">
        {courses.map((course, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
              <span className="text-gray-400">{course.name}</span>
              <span className="text-white">{course.score}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className={`h-full ${course.color} transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.3)]`} 
                style={{ width: `${course.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>


      <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
        <span className="text-[10px] text-gray-500 font-bold uppercase">Meta Semestral</span>
        <span className="text-[10px] text-accent font-bold">85.0%</span>
      </div>
    </div>
  );
}