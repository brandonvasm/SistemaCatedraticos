import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router-dom";
import StatsSection from "../components/dashboard/stats/StatsSection"
import TeachersGrid from "../components/dashboard/stats/TeachersGrid"
import RankingCard from "../components/dashboard/stats/RankingCard";
import ThresholdCard from "../components/dashboard/stats/ThresholdCard";
import PerformanceScatter from "../components/dashboard/charts/PerformanceScatter";
import EfficiencyPanel from "../components/dashboard/insights/EfficiencyPanel";
import HistoryTrend from "../components/dashboard/charts/HistoryTrend";
import PerformancePie from "../components/dashboard/charts/PerformancePie";
import CourseBarChart from "../components/dashboard/courses/CourseBarChart"; 
import ImportModal from "../components/common/ImportModal";
import DashboardConfig from "../components/dashboard/DashboardConfig";
import { useAuth } from "../context/AuthContext";
import { teacherService } from "../services/teacherService";
import { courseService } from "../services/courseService"; 
import { Award, AlertCircle, FileUp, ArrowRight } from "lucide-react"; 
import type { TeacherStats } from "../types/teacher";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isImportOpen, setIsImportOpen] = useState(false); 
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [teachers, setTeachers] = useState<TeacherStats[]>([]);
  const [topCourses, setTopCourses] = useState([]);

  const facultyId = user?.faculty_id;
  const currentSemesterId = 1; 
  const USER_PREFS_KEY = user?.id ? `dashboard_prefs_${user.id}` : "dashboard_prefs_guest";

  const [visible, setVisible] = useState(() => {
    const saved = localStorage.getItem(USER_PREFS_KEY);
    return saved ? JSON.parse(saved) : {
      stats: true,
      teachers: true,
      rankings: true,
      charts: true,
      history: true
    };
  });

  useEffect(() => {
    if (facultyId) {
      teacherService.getTeachersStats(facultyId).then(setTeachers);
      courseService.getTopCourses(facultyId, currentSemesterId).then(setTopCourses);
    }
  }, [facultyId]);

  useEffect(() => {
    const saved = localStorage.getItem(USER_PREFS_KEY);
    if (saved) {
      setVisible(JSON.parse(saved));
    }
  }, [USER_PREFS_KEY]);

  useEffect(() => {
    localStorage.setItem(USER_PREFS_KEY, JSON.stringify(visible));
  }, [visible, USER_PREFS_KEY]);

  const toggleSection = (section: string) => {
    setVisible((prev: any) => ({ ...prev, [section]: !prev[section] }));
  };

  const topTeachers = [...teachers]
    .filter(t => t.promedio_general > 0)
    .sort((a, b) => b.promedio_general - a.promedio_general)
    .slice(0, 3)
    .map(t => ({ 
      name: t.teacher_name, 
      score: t.promedio_general.toFixed(1), 
      students: t.evaluaciones_total.toString() 
    }));

  const alertTeachers = [...teachers]
    .filter(t => t.promedio_general > 0)
    .sort((a, b) => a.promedio_general - b.promedio_general)
    .slice(0, 3)
    .map(t => ({ 
      name: t.teacher_name, 
      score: t.promedio_general.toFixed(1), 
      students: t.evaluaciones_total.toString() 
    }));

  return (
    <div className="relative z-0 space-y-10 animate-in fade-in duration-700">
      
      <DashboardConfig 
        visible={visible} 
        toggleSection={toggleSection} 
        isOpen={isConfigOpen} 
        setIsOpen={setIsConfigOpen} 
      />

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase">Dashboard General</h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
            VISTA COMPLETA - {user?.faculty_name || "EVALUACIONES"}
          </p>
        </div>

        <button 
          onClick={() => setIsImportOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all active:scale-95 shadow-xl shadow-yellow-400/10 border-none"
        >
          <FileUp size={14} /> IMPORTAR
        </button>
      </header>

      {visible.stats && (
        <section>
          <StatsSection teachers={teachers} facultyName={user?.faculty_name} />
        </section>
      )}

      {visible.teachers && (
        <section className="bg-[#11141d]/50 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 blur-[100px] rounded-full -ml-32 -mt-32 opacity-30 pointer-events-none" />
          <div className="relative z-10 flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-8 bg-yellow-500 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
              <div>
                <h2 className="text-lg font-bold text-white tracking-tight uppercase">Tablero de Docentes</h2>
                <p className="text-xs text-gray-500 font-medium tracking-tight mt-0.5">
                  Gestión y monitoreo de personal académico
                </p>
              </div>
            </div>
            <div className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.2em] bg-yellow-400/10 px-5 py-2 rounded-full border border-yellow-400/20 shadow-inner">
              {teachers.length} Docentes Activos
            </div>
          </div>
          <div className="relative z-10">
            <TeachersGrid teachers={teachers.slice(0, 5)} />
            
            <div className="mt-10 pt-6 border-t border-white/5 flex justify-center">
              <button 
                onClick={() => navigate("/docentes")}
                className="group/btn flex items-center gap-3 px-8 py-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 hover:border-yellow-400/30 rounded-2xl transition-all duration-300"
              >
                <span className="text-[9px] text-gray-400 group-hover/btn:text-yellow-400 font-black uppercase tracking-[0.3em] transition-colors">
                  Ver listado completo
                </span>
                <div className="w-8 h-8 rounded-full bg-white/5 group-hover/btn:bg-yellow-400 flex items-center justify-center transition-all">
                  <ArrowRight size={14} className="text-gray-400 group-hover/btn:text-black" />
                </div>
              </button>
            </div>
          </div>
        </section>
      )}
      
      {visible.rankings && (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RankingCard title="Mejores Valorados" icon={Award} color="green" teachers={topTeachers} />
          <ThresholdCard teachers={teachers}/>
          <RankingCard title="Requieren Atención" icon={AlertCircle} color="red" teachers={alertTeachers} />
        </section>
      )}

      {visible.charts && (
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <PerformanceScatter />
          </div>
          <div>
            <EfficiencyPanel />
          </div>
        </section>
      )}

      {visible.history && (
        <section className="pt-10 border-t border-white/5 space-y-10 pb-20">
          <div>
            <h2 className="text-xl font-bold text-gray-200 tracking-tight uppercase">
              Análisis de Tendencia y Rendimiento
            </h2>
            <p className="text-gray-500 font-medium mt-1">Métricas históricas y por asignatura</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <HistoryTrend />
            <PerformancePie teachers={teachers}/>
          </div>
          <CourseBarChart courses={topCourses} />
        </section>
      )}

      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} />
    </div>
  );
}