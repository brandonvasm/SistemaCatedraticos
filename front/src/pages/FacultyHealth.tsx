import React, { useState, useEffect, useMemo } from 'react';
import StatCard from '../components/ui/StatCard';
import PerformanceBar from '../components/ui/PerformanceBar';
import HistoryTrend from "../components/dashboard/charts/HistoryTrend";
import CareerStatsChart from '../components/health/CareerStatsChart';
import { AlertOctagon, Users, Percent, Loader2 } from 'lucide-react';
import { teacherService } from "../services/teacherService"; 
import { courseService } from "../services/courseService";
import { useAuth } from "../context/AuthContext";

const SaludFacultad: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const facultyId = user?.faculty_id;
  const semesterId = user?.semester_id;

  useEffect(() => {
    if (facultyId && semesterId) {
      setLoading(true);
      Promise.all([
        teacherService.getTeachersStats(facultyId, 1),
        courseService.getTopCourses(facultyId, semesterId)
      ])
        .then(([teachersData, coursesData]) => {
          setTeachers(teachersData?.teachers || []);
          setCourses(coursesData || []);
        })
        .catch((err) => console.error("Error cargando salud de carrera:", err))
        .finally(() => setLoading(false));
    }
  }, [facultyId, semesterId]);

  const stats = useMemo(() => {
    const excellentCourses = courses.filter(c => (parseFloat(c.average_rating) || 0) >= 65).length;
    const coursePerc = courses.length > 0 ? Math.round((excellentCourses / courses.length) * 100) : 0;
    const evaluatedTeachers = teachers.filter(t => (t.promedio_general || 0) > 0);
    const excellentTeachersCount = evaluatedTeachers.filter(t => t.promedio_general >= 65).length;
    const teacherPerc = evaluatedTeachers.length > 0 ? Math.round((excellentTeachersCount / evaluatedTeachers.length) * 100) : 0;

    return {
      excellentCourses,
      coursePerc,
      excellentTeachersCount,
      teacherPerc,
      totalTeachers: teachers.length
    };
  }, [courses, teachers]);

  return (
    <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-700 pb-20 px-4 sm:px-0">
      
      <header className="text-left">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tighter uppercase break-words">
          Salud de la Facultad
        </h1>
        <p className="text-gray-500 font-bold mt-2 sm:mt-4 uppercase text-[9px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] ml-0.5">
          Estado Académico — {user?.faculty_name || "Facultad"}
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard 
          title="Excelencia" 
          value={`${stats.teacherPerc}%`} 
          description="sobre 65 pts"
          icon={<Percent size={20} className="text-yellow-400" />} 
        />
        <StatCard 
          title="Planilla Docente" 
          value={stats.totalTeachers.toString()} 
          description="Total registrados"
          icon={<Users size={20} className="text-blue-400" />} 
        />
        <StatCard 
          title="Críticos" 
          value="1" 
          description="Acción requerida"
          icon={<AlertOctagon size={20} className="text-red-500" />} 
        />
      </div>

      <section className="bg-[#11141d]/50 border border-white/5 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400/[0.02] blur-[100px] rounded-full -ml-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-1.5 h-6 sm:h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)] flex-shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight uppercase">
                Indicadores de desempeño
              </h2>
              <p className="text-[9px] sm:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
                Calidad académica global de la facultad
              </p>
            </div>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/20 px-4 sm:px-5 py-2 rounded-full text-[9px] sm:text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em] w-fit flex items-center gap-2">
            {loading && <Loader2 size={12} className="animate-spin" />}
            {loading ? "Sincronizando..." : "Métricas Actualizadas"}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 relative z-10">
          <PerformanceBar 
            label="Excelencia Docente" 
            percentage={stats.teacherPerc} 
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 overflow-hidden">
        {loading ? (
          <div className="lg:col-span-2 flex flex-col items-center justify-center py-20 space-y-4 bg-[#11141d]/20 border border-white/5 rounded-[2rem]">
            <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
            <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">Cargando analíticas...</p>
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto min-w-0">
              <CareerStatsChart />
            </div>
            <div className="w-full overflow-x-auto min-w-0">
              <HistoryTrend facultyId={facultyId} />
            </div>
          </>
        )}
      </div>

    </div>
  );
};

export default SaludFacultad;