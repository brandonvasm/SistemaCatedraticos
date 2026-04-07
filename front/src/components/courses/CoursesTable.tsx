import { useState } from "react";
import CourseRow from "./CourseRow";

const coursesData = [
	{
		name: "Cálculo I",
		code: "MAT101",
		category: "Matemática",
		evaluations: 245,
		sections: 8,
		teachers: 6,
		students: 245,
		avg: 2.3,
		trend: 0.2,
		rec: 88,
		teacher: "Dr. Carlos Méndez",
	},
	{
		name: "Ecuaciones Diferenciales",
		code: "MAT201",
		category: "Matemática",
		evaluations: 156,
		sections: 5,
		teachers: 4,
		students: 156,
		avg: 1.8,
		trend: -0.3,
		rec: 72,
		teacher: "Dra. Ana Rodríguez",
	},
	{
		name: "Programación I",
		code: "INF101",
		category: "Informática",
		evaluations: 300,
		sections: 10,
		teachers: 7,
		students: 300,
		avg: 4.7,
		trend: 0.5,
		rec: 92,
		teacher: "Ing. Luis Pérez",
	},
];

export default function CoursesTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");
  const [order, setOrder] = useState("desc");

  const filtered = coursesData.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "Todos" || c.category === category;

    return matchSearch && matchCategory;
  });

  const sorted = [...filtered].sort((a, b) =>
    order === "asc" ? a.avg - b.avg : b.avg - a.avg
  );

  return (
    <div className="
      bg-white/5
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-xl
    ">

      <div className="flex flex-col md:flex-row gap-4 mb-4">

        <input
          type="text"
          placeholder="Buscar curso..."
          className="
            bg-white/5
            border border-white/10
            px-3 py-2
            rounded-lg
            text-sm
            text-white
            placeholder-gray-400
            focus:border-blue-400
            focus:outline-none
            hover:border-white/20
            transition
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="
            bg-white/5
            border border-white/10
            px-3 py-2
            rounded-lg
            text-sm
            text-white
            focus:border-blue-400
            focus:outline-none
            hover:border-white/20
            transition
          "
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Todos</option>
          <option>Matemática</option>
          <option>Informática</option>
        </select>

      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">

          <thead className="text-gray-400 border-b border-white/10">
            <tr className="text-left">
              <th className="p-4">Curso</th>
              <th className="p-4">Código</th>
              <th className="p-4">Secciones</th>
              <th className="p-4">Docentes</th>
              <th className="p-4">Estudiantes</th>
              <th className="p-4">Promedio</th>
              <th className="p-4">Tendencia</th>
              <th className="p-4">Recomendado</th>
              <th className="p-4">Docente</th>
              <th className="p-4">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/5">
            {sorted.map((c, i) => (
              <CourseRow key={i} course={c} />
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}