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
    <div
      className="
        w-full
bg-secondary/40 border border-white/5
        p-6
        rounded-[2rem]
        backdrop-blur-2xl
        shadow-2xl
      "
    >

      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-sm font-bold text-white tracking-tight">
          Gestión de Cursos
        </h2>
        <p className="text-[11px] text-gray-500 uppercase tracking-wider">
          Evaluación y rendimiento académico
        </p>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Buscar curso..."
          className="
            w-full md:w-72
            bg-white/5
            border border-white/10
            px-4 py-2.5
            rounded-xl
            text-sm
            text-white
            placeholder-gray-500

            focus:border-yellow-400
            focus:outline-none

            hover:border-white/20
            transition-all
          "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* SELECT */}
        <select
          className="
            bg-white/5
            border border-white/10
            px-4 py-2.5
            rounded-xl
            text-sm
            text-gray-300

            focus:border-yellow-400
            focus:outline-none

            hover:border-white/20
            transition-all
          "
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>Todos</option>
          <option>Matemática</option>
          <option>Informática</option>
        </select>

        {/* ORDER */}
        <select
          className="
            bg-white/5
            border border-white/10
            px-4 py-2.5
            rounded-xl
            text-sm
            text-gray-300

            focus:border-yellow-400
            focus:outline-none

            hover:border-white/20
            transition-all
          "
          onChange={(e) => setOrder(e.target.value)}
        >
          <option value="desc">Mayor Promedio</option>
          <option value="asc">Menor Promedio</option>
        </select>

      </div>

      {/* TABLA */}
      <div className="overflow-x-auto">
        <table className="min-w-[1000px] w-full text-sm">

          <thead
            className="
              bg-white/[0.02]
              text-gray-500
              text-[10px]
              uppercase
              tracking-[0.2em]
              border-b border-white/5
            "
          >
            <tr>
              <th className="px-4 py-3 w-[220px]">Curso</th>
              <th className="px-4 py-3 w-[90px] text-center">Código</th>
              <th className="px-4 py-3 w-[80px] text-center">Secciones</th>
              <th className="px-4 py-3 w-[80px] text-center">Docentes</th>
              <th className="px-4 py-3 w-[90px] text-center">Estudiantes</th>
              <th className="px-4 py-3 w-[120px] text-center">Promedio</th>
              <th className="px-4 py-3 w-[100px] text-center">Tendencia</th>
              <th className="px-4 py-3 w-[100px] text-center">Recomendado</th>
              <th className="px-4 py-3 w-[150px] text-center">Docente</th>
              <th className="px-4 py-3 w-[100px] text-right">Acciones</th>
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