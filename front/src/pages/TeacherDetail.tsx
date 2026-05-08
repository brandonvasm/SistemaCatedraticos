import { useParams, useNavigate } from "react-router-dom";
import teachers from "../data/teachers";
import Header from "../components/teacherDetail/Header";
import StatsCards from "../components/teacherDetail/StatsCards";
import Tabs from "../components/teacherDetail/Tabs";
import RadarChartComp from "../components/teacherDetail/charts/RadarChart";
import SemesterRatings from "../components/teacherDetail/SemesterRatings";
import CoursesList from "../components/teacherDetail/CoursesList";
import { useState, useEffect } from "react";
import ComentariosTab from "../components/teacherDetail/CommentsSection";
import Recommendations from "../components/teacherDetail/Recommendations";
import HistoryTrend from "../components/dashboard/charts/HistoryTrend";
import { teacherService } from "../services/teacherService";
import type { Courses } from "../types/teacher";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState("resumen");
  const [teacherAPI, setTeacherAPI] = useState<any>(null);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const facultyId = user?.faculty_id;
  
  const teacherLocal = teachers.find((t) => t.id === id);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const [statsData, coursesData] = await Promise.all([
          teacherService.getTeacherStats(id),
          teacherService.getTeacherCourses(id)
        ]);
        
        setTeacherAPI(statsData);
        setCourses(coursesData);
      } catch (error) {
        console.error("Error al cargar datos del docente:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-5">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400 opacity-40" />
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.5em] animate-pulse">
          Cargando informacion...
        </p>
      </div>
    );
  }

  if (!teacherAPI && !teacherLocal) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-gray-500 font-black uppercase tracking-widest border border-white/10 p-10 rounded-[2rem]">
          Identificador de docente no válido
        </p>
      </div>
    );
  }

  return (
    <div className="relative z-0 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">

      <div className="px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all active:scale-95 backdrop-blur-xl"
        >
          ← Volver al listado
        </button>
      </div>

      <div className="px-6 py-6 max-w-[1300px] mx-auto space-y-8">
          <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl shadow-xl">
          <Header teacher={teacherAPI || teacherLocal} />
          <div className="mt-8">
            <StatsCards teacher={teacherAPI} />
          </div>
        </div>

        <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-5 backdrop-blur-2xl">
          <Tabs tab={tab} setTab={setTab} />
        </div>

        
        {tab === "resumen" && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid lg:grid-cols-2 gap-6">
              
                <HistoryTrend facultyId={facultyId}/>
              
                <RadarChartComp />
            
            </div>

            <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
              <CoursesList courses={courses} isLoading={loading}/>
            </div>

            
          </div>
        )}

        {tab === "semestres" && (
          <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl animate-in slide-in-from-right-4 duration-500">
            <SemesterRatings />
          </div>
        )}

        {tab === "comentarios" && (
          <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl animate-in slide-in-from-right-4 duration-500">
            <ComentariosTab teacherId={id!}/>
          </div>
        )}

        {tab === "acciones" && (
          <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl animate-in slide-in-from-right-4 duration-500">
            <Recommendations teacherId={id!} />
          </div>
        )}

      </div>
    </div>
  );
}