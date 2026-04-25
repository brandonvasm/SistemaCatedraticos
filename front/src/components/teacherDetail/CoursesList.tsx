import type { TeacherStats } from "../../types/teacher";

export default function CoursesList({ teacher }: { teacher: TeacherStats | null }) {
  
  if (!teacher || !teacher.cursos_impartidos) {
    return (
      <div className="p-8 rounded-[2.5rem] backdrop-blur-2xl">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">CURSOS</h2>
        <p className="text-gray-500 text-[10px] mt-4 uppercase">Cargando cursos...</p>
      </div>
    );
  }
  const getStatus = (score: number) => {
    if (score >= 4.5) return { label: "Excelente", color: "text-emerald-400" };
    if (score >= 4) return { label: "Bueno", color: "text-blue-400" };
    return { label: "Bajo", color: "text-red-400" };
  };

  const status = getStatus(teacher.promedio_general);

  return (
    <div className="p-8 rounded-[2.5rem] backdrop-blur-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
          CURSOS
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
          LISTADO DE CÁTEDRAS
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {teacher.cursos_impartidos.length > 0 ? (
          teacher.cursos_impartidos.map((cursoNombre, i) => (
            <div
              key={i}
              className="
                bg-[#0f111a]/50
                border border-white/10
                p-5
                rounded-[2rem]
                hover:bg-white/[0.05]
                hover:border-white/20
                transition-all
                group
              "
            >
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mb-2">
                CURSO
              </p>

              <p className="text-white font-black text-[13px] uppercase tracking-wide group-hover:text-yellow-400 transition-colors">
                {cursoNombre}
              </p>

              <div className="flex items-center justify-between mt-4">
                <span className="text-yellow-400 font-black text-xl">
                  {teacher.promedio_general.toFixed(1)}
                </span>

                <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                  {status.label}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-10 text-center border border-dashed border-white/10 rounded-3xl">
             <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
               No hay cursos registrados para este semestre
             </p>
          </div>
        )}
      </div>
    </div>
  );
}