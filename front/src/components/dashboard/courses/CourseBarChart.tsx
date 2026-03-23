import { BarChart3 } from "lucide-react";

export default function CourseBarChart() {
  const courses = [
    { name: "Cálculo I", score: 4.2 },
    { name: "Cálculo II", score: 3.9 },
    { name: "Ecuaciones Dif.", score: 3.6 },
    { name: "Ing. Software", score: 4.5 },
    { name: "Programación", score: 4.0 },
    { name: "Estructuras", score: 3.8 },
  ];

  return (
    <div className="bg-[#1e2230]/60 border border-white/5 rounded-3xl p-8 shadow-2xl w-full mt-8">

      <div className="flex items-center gap-3 mb-10">
        <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500">
          <BarChart3 size={22} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight italic uppercase">Rendimiento por Curso</h3>
          <p className="text-sm text-gray-500 font-medium">Comparativa de evaluaciones por materia</p>
        </div>
      </div>


      <div className="relative h-[400px] w-full mt-4 pl-16 pr-4">
        
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-14">

          <div className="relative w-full border-t border-gray-700/30 border-dashed">
            <span className="absolute -left-12 -top-2.5 text-[13px] font-black text-gray-500 w-8 text-right">5</span>
          </div>

          <div className="absolute w-full border-t border-gray-700/30 border-dashed" style={{ bottom: '54%' }}>
            <span className="absolute -left-12 -top-2.5 text-[13px] font-black text-gray-500 w-8 text-right">2</span>
          </div>

          <div className="relative w-full border-t-2 border-gray-600">
            <span className="absolute -left-12 -top-2.5 text-[13px] font-black text-gray-600 w-8 text-right">0</span>
          </div>
        </div>

        <div className="relative h-full w-full flex justify-around items-end gap-6 pb-14">
          {courses.map((course, i) => (
            <div key={i} className="flex-1 flex flex-col items-center group h-full justify-end relative">

              <div 
                className="w-full max-w-[130px] bg-[#facc15] rounded-t-xl shadow-[0_10px_30px_rgba(250,204,21,0.1)] transition-all duration-500 group-hover:bg-yellow-300 group-hover:shadow-[0_0_40px_rgba(250,204,21,0.4)] cursor-pointer"
                style={{ height: `${(course.score / 5) * 100}%` }}
              >
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] font-black py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all border border-white/10 shadow-2xl z-50">
                  {course.score}
                </div>
              </div>
              <div className="absolute -bottom-10 w-full text-center">
                <p className="text-[11px] font-black text-gray-500 uppercase tracking-tighter truncate px-1 group-hover:text-gray-300 transition-colors">
                  {course.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}