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
      bg-white/5
      border border-white/10
      p-5
      rounded-2xl
      backdrop-blur-xl
      shadow-lg
    ">

      <h2 className="text-lg mb-4 font-semibold text-gray-200">
        Listado de Docentes
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full text-sm">

          <thead className="text-gray-400 border-b border-white/10">
            <tr className="text-left">
              <th className="p-4">Docente</th>
              <th className="p-4">Cursos</th>
              <th className="p-4">Promedio</th>
              <th className="p-4">Tendencia</th>
              <th className="p-4">Evaluaciones</th>
              <th className="p-4">Recomendado</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredTeachers.map((t) => (
              <TeacherRow key={t.id} teacher={t} />
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};