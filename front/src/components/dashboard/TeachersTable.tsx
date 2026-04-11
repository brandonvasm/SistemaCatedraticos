import { TeacherRow } from "./TeacherRow";
import teachers from "../../data/teachers";

type Props = {
  filter: string;
};

export const TeachersTable = ({ filter }: Props) => {

  const getStatus = (score: number) => {
    if (score >= 4.5) return "Excelente";
    if (score >= 4) return "Bueno";
    return "Bajo";
  };

  const filteredTeachers =
    filter === "Todos"
      ? teachers
      : teachers.filter((t) => getStatus(t.score) === filter);

  return (
    <div className="
      w-full
      overflow-hidden
      rounded-[3rem]
      border border-white/10
      bg-[#0f111a]/50
      backdrop-blur-2xl
      shadow-2xl
    ">

      <div className="px-10 pt-10 pb-5">
        <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
          LISTADO DE DOCENTES
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-4 ml-1">
          EVALUACIÓN · RENDIMIENTO ACADÉMICO
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">

          <thead className="
            bg-white/[0.02]
            text-gray-500
            text-[10px]
            font-black
            uppercase
            tracking-[0.4em]
            border-b border-white/5
          ">
            <tr>
              <th className="px-6 py-6 w-[220px]">Docente</th>
              <th className="px-6 py-6 w-[180px]">Cursos</th>
              <th className="px-6 py-6 w-[120px]">Promedio</th>
              <th className="px-6 py-6 w-[120px]">Tendencia</th>
              <th className="px-6 py-6 w-[100px]">Evaluaciones</th>
              <th className="px-6 py-6 w-[120px]">Recomendado</th>
              <th className="px-6 py-6 w-[140px]">Estado</th>
              <th className="px-6 py-6 w-[140px] text-right">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {filteredTeachers.map((t) => (
              <tr
                key={t.id}
                className="
                  group
                  hover:bg-white/[0.03]
                  transition-all
                  duration-300
                "
              >
                <TeacherRow teacher={t} />
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};