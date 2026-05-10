import { useEffect, useState } from "react";
import CategoryCard from "./CategoryCard";
import { teacherService } from "../../services/teacherService";
import type { TeacherStats } from "../../types/teacher";

type Props = {
  facultyId: number;
};

export default function CategoryDecisions({ facultyId }: Props) {
  const [data, setData] = useState({
    excelencia: 0,
    muyBueno: 0,
    aceptable: 0,
    mejora: 0,
    total: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await teacherService.getTeachersStats(facultyId, 1);

        console.log("RESPUESTA API:", response);

        const teachers: TeacherStats[] =
          response.results ||
          response.data ||
          response.teachers ||
          response;

        console.log("TEACHERS:", teachers);

        let excelencia = 0;
        let muyBueno = 0;
        let aceptable = 0;
        let mejora = 0;

        teachers.forEach((t) => {
          const avg = Number(t.promedio_general);

          if (avg > 90) excelencia++;
          else if (avg > 75) muyBueno++;
          else if (avg > 65) aceptable++;
          else mejora++;
        });

        setData({
          excelencia,
          muyBueno,
          aceptable,
          mejora,
          total: teachers.length,
        });
      } catch (error) {
        console.error("Error cargando categorías:", error);
      } finally {
        setLoading(false);
      }
    };

    if (facultyId) {
      fetchData();
    }
  }, [facultyId]);

  const percent = (value: number) =>
    data.total === 0 ? 0 : Math.round((value / data.total) * 100);

  if (loading) {
    return (
      <div className="text-center text-gray-400 py-10">
        Cargando análisis...
      </div>
    );
  }

  return (
    <div className="bg-secondary/40 border border-white/5 p-8 rounded-2xl backdrop-blur-md shadow-xl mt-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-56 h-56 bg-yellow-400/10 blur-[100px] rounded-full -ml-28 -mt-28 opacity-20 pointer-events-none" />

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-8 relative z-10">
        <div>
          <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
            Decisiones Automáticas por Categoría
          </p>

          <p className="text-gray-500 text-[10px] leading-tight font-medium">
            Recomendaciones del sistema basadas en evaluaciones
          </p>
        </div>

        <button className="px-5 py-2.5 bg-yellow-400 text-black rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20">
          Aplicar Todas
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 relative z-10">
        <CategoryCard
          title="Excelencia (>90)"
          count={data.excelencia}
          percent={percent(data.excelencia)}
          bg="bg-green-500/10"
          border="border-green-500/20"
          textColor="text-green-500"
          barColor="bg-green-500"
        />

        <CategoryCard
          title="Muy Bueno (75-90)"
          count={data.muyBueno}
          percent={percent(data.muyBueno)}
          bg="bg-white/5"
          border="border-white/10"
          textColor="text-gray-300"
          barColor="bg-white/40"
        />

        <CategoryCard
          title="Aceptable (65-75)"
          count={data.aceptable}
          percent={percent(data.aceptable)}
          bg="bg-yellow-400/10"
          border="border-yellow-400/20"
          textColor="text-yellow-400"
          barColor="bg-yellow-400"
        />

        <CategoryCard
          title="Requiere Mejora (<65)"
          count={data.mejora}
          percent={percent(data.mejora)}
          bg="bg-red-500/10"
          border="border-red-500/20"
          textColor="text-red-400"
          barColor="bg-red-400"
        />
      </div>
    </div>
  );
}