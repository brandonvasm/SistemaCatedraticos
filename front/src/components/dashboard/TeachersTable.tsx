import { useEffect, useState } from "react";
import { TeacherRow } from "./TeacherRow";
import { teacherService } from "../../services/teacherService";
import type { TeacherStats } from "../../types/teacher";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  SearchX,
} from "lucide-react";

export const TeachersTable = ({
  filter,
  facultyId,
}: {
  filter: string;
  facultyId: number;
}) => {
  const [teachers, setTeachers] = useState<TeacherStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 8;

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        setLoading(true);

        const data = await teacherService.getTeachersStats(
          facultyId,
          currentPage
        );

        setTeachers(data.teachers_paginated || []);
        setTotalCount(data.count || 0);
      } catch (error) {
        console.error("Error al cargar docentes:", error);
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) fetchTeachers();
  }, [facultyId, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [facultyId, filter]);

  const getStatus = (score: number) => {
    if (score >= 65) return "Excelente";
    return "Bajo";
  };

  const displayedTeachers =
    filter === "Todos"
      ? teachers
      : teachers.filter(
          (t) => getStatus(t.promedio_general) === filter
        );

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div
      className="
        w-full
        overflow-hidden
        rounded-[2rem]
        border border-white/10
        bg-[#0f111a]/60
        backdrop-blur-2xl
        shadow-2xl
      "
    >
      <div className="px-10 pt-10 pb-5 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
            LISTADO DE DOCENTES
          </h2>

          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-4 ml-1">
            EVALUACIÓN · RENDIMIENTO ACADÉMICO
          </p>
        </div>

        <div className="px-5 py-2.5 bg-white/[0.03] rounded-xl border border-white/5 backdrop-blur-md">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            DOCENTES TOTALES:
            <span className="text-yellow-400 ml-2 text-xs">
              {totalCount}
            </span>
          </p>
        </div>
      </div>

      <div className="overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-[#0f111a]/20 backdrop-blur-[2px] z-10 flex items-center justify-center">
            <Loader2
              className="animate-spin text-yellow-400"
              size={32}
            />
          </div>
        )}

        <table className="w-full border-separate border-spacing-0 min-w-[1200px]">
          <thead>
            <tr
              className="
                bg-white/[0.02]
                text-gray-500
                text-[10px]
                font-black
                uppercase
                tracking-[0.4em]
              "
            >
              <th className="px-10 py-6 text-left border-b border-white/5">
                Docente
              </th>

              <th className="px-6 py-6 text-left border-b border-white/5 w-[400px]">
                Cursos
              </th>

              <th className="px-6 py-6 text-left border-b border-white/5">
                Promedio
              </th>

              <th className="px-6 py-6 text-left border-b border-white/5">
                Tendencia
              </th>

              <th className="px-6 py-6 text-left border-b border-white/5">
                Evaluaciones
              </th>

              <th className="px-6 py-6 text-left border-b border-white/5">
                Recomendacion
              </th>

              <th className="px-6 py-6 text-left border-b border-white/5">
                Estado
              </th>

              <th className="px-10 py-6 text-center border-b border-white/5">
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>
            {displayedTeachers.length > 0 ? (
              displayedTeachers.map((t, index) => (
                <tr
                  key={t.teacher_id}
                  className="
                    group
                    hover:bg-white/[0.03]
                    transition-all
                    duration-300
                  "
                >
                  <TeacherRow
                    teacher={t}
                    isLast={
                      index === displayedTeachers.length - 1
                    }
                  />
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-32 text-center"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="p-5 bg-white/[0.02] border border-white/5 rounded-full mb-6">
                      <SearchX
                        size={32}
                        className="text-gray-700"
                      />
                    </div>

                    <p className="text-[11px] font-black text-gray-500 uppercase tracking-[0.4em]">
                      Sin coincidencias
                    </p>

                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-2">
                      No hay docentes con estado "{filter}"
                      en esta página.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="px-10 py-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1 || loading}
              className="
                flex items-center gap-2
                px-5 py-3
                rounded-xl
                bg-white/5
                border border-white/10
                text-[10px]
                font-black
                uppercase
                tracking-widest
                text-gray-400
                hover:text-white
                hover:border-white/20
                disabled:opacity-20
                transition-all
              "
            >
              <ChevronLeft size={14} strokeWidth={3} />
              Anterior
            </button>

            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;

                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 &&
                    pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() =>
                        setCurrentPage(pageNum)
                      }
                      className={`
                        w-10 h-10 rounded-xl text-[10px]
                        font-black transition-all
                        ${
                          currentPage === pageNum
                            ? "bg-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]"
                            : "bg-white/5 text-gray-500 hover:bg-white/10"
                        }
                      `}
                    >
                      {pageNum}
                    </button>
                  );
                }

                if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return (
                    <span
                      key={pageNum}
                      className="text-gray-700 mx-1"
                    >
                      ...
                    </span>
                  );
                }

                return null;
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={
                currentPage === totalPages || loading
              }
              className="
                flex items-center gap-2
                px-5 py-3
                rounded-xl
                bg-white/5
                border border-white/10
                text-[10px]
                font-black
                uppercase
                tracking-widest
                text-gray-400
                hover:text-white
                hover:border-white/20
                disabled:opacity-20
                transition-all
              "
            >
              Siguiente
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};