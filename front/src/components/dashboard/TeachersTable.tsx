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
      rounded-[2.5rem]
      border border-white/10
      bg-[#0f111a]/50
      backdrop-blur-2xl
      shadow-2xl
    ">

      {/* HEADER */}
      <div className="px-8 pt-8 pb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Listado de Docentes
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-[0.2em]">
          Evaluación y rendimiento académico
        </p>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[900px]">

          <thead className="
            bg-white/[0.02]
            text-gray-500
            text-[10px]
            font-black
            uppercase
            tracking-[0.2em]
            border-b border-white/5
          ">
            <tr>
              <th className="px-6 py-5 w-[220px]">Docente</th>
              <th className="px-6 py-5 w-[180px]">Cursos</th>
              <th className="px-6 py-5 w-[120px]">Promedio</th>
              <th className="px-6 py-5 w-[120px]">Tendencia</th>
              <th className="px-6 py-5 w-[100px]">Evaluaciones</th>
              <th className="px-6 py-5 w-[120px]">Recomendado</th>
              <th className="px-6 py-5 w-[140px]">Estado</th>
              <th className="px-6 py-5 w-[140px] text-right">Acciones</th>
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