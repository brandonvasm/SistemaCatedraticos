import React, { useState, useEffect, useMemo } from 'react';
import StatCard from '../components/ui/StatCard';
import PerformanceBar from '../components/ui/PerformanceBar';
import CourseBarChart from '../components/dashboard/courses/CourseBarChart';
import StudentGradeLineChart from '../components/health/StudentGradeLineChart';
import HealthLegend from '../components/health/HealthLegend';
import { AlertOctagon, Users, Percent} from 'lucide-react';
import { teacherService } from "../services/teacherService"; 
import { courseService } from "../services/courseService";
import { useAuth } from "../context/AuthContext";

const SaludCarrera: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const facultyId = user?.faculty_id;
  const currentSemesterId = 1;

  useEffect(() => {
    if (facultyId) {
      setLoading(true);
      Promise.all([
        teacherService.getTeachersStats(facultyId),
        courseService.getTopCourses(facultyId, currentSemesterId)
      ])
        .then(([teachersData, coursesData]) => {
          setTeachers(teachersData || []);
          setCourses(coursesData || []);
        })
        .catch((err) => console.error("Error cargando salud de carrera:", err))
        .finally(() => setLoading(false));
    }
  }, [facultyId]);

  const stats = useMemo(() => {
    const excellentCourses = courses.filter(c => (parseFloat(c.average_rating) || 0) >= 85).length;
    const coursePerc = courses.length > 0 ? Math.round((excellentCourses / courses.length) * 100) : 0;
    const evaluatedTeachers = teachers.filter(t => (t.promedio_general || 0) > 0);
    const excellentTeachersCount = evaluatedTeachers.filter(t => t.promedio_general >= 85).length;
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
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
          Salud de la carrera
        </h1>
        <p className="text-gray-500 font-medium mt-1 uppercase text-[10px] tracking-widest">
          Estado Académico — {user?.faculty_name || "Facultad"}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard 
          title="Excelencia" 
          value={`${stats.teacherPerc}%`} 
          description="sobre 85 pts"
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

      <section className="glass-card p-8 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400/[0.02] blur-[100px] rounded-full -ml-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-yellow-400 rounded-full" />
            <div>
              <h2 className="text-lg font-black text-white tracking-tight uppercase">
                Indicadores de desempeño
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                Calidad académica global de la facultad
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 px-5 py-2 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            {loading ? "Sincronizando..." : "Métricas Actualizadas"}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <PerformanceBar 
            label="Excelencia Docente " 
            percentage={stats.teacherPerc} 
          />
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-[#11141d]/50 border border-white/5 p-0 rounded-[2.5rem] overflow-hidden">
          {!loading && <CourseBarChart courses={courses} />}
        </div>

        <div className="bg-[#11141d]/50 border border-white/5 p-8 rounded-[2.5rem]">
          <h3 className="text-sm font-black text-gray-500 tracking-widest mb-8 text-center uppercase">
            Calificación promedio histórica
          </h3>
          <StudentGradeLineChart />
        </div>
      </div>

      <footer className="pt-10 border-t border-white/5">
        <div className="bg-[#11141d]/50 border border-white/5 p-8 rounded-[2.5rem]">
            <h2 className="text-lg font-bold text-white tracking-tight mb-6 uppercase">Recomendaciones y acciones </h2>
          <HealthLegend />
        </div>
      </footer>
    </div>
  );
};

export default SaludCarrera;