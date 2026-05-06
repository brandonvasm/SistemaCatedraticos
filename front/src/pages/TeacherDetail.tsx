import { useParams, useNavigate } from "react-router-dom";
import teachers from "../data/teachers";
import Header from "../components/teacherDetail/Header";
import StatsCards from "../components/teacherDetail/StatsCards";
import Tabs from "../components/teacherDetail/Tabs";
import RadarChartComp from "../components/teacherDetail/charts/RadarChart";
import SemesterRatings from "../components/teacherDetail/SemesterRatings";
import CoursesList from "../components/teacherDetail/CoursesList";
import Tags from "../components/teacherDetail/Tags";
import { useState, useEffect } from "react";
import ComentariosTab from "../components/teacherDetail/CommentsSection";
import Recommendations from "../components/teacherDetail/Recommendations";
import HistoryTrend from "../components/dashboard/charts/HistoryTrend";
import { teacherService } from "../services/teacherService";
import type { Courses } from "../types/teacher";
import { useAuth } from "../context/AuthContext";

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("resumen");
  const [teacherAPI, setTeacherAPI] = useState<any>(null);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const { user } = useAuth();
  const facultyId = user?.faculty_id;
  
  const teacherLocal = teachers.find((t) => t.id === id);

  useEffect(() => {
    async function loadData() {
      if (id) {
        try {
          const [statsData, coursesData] = await Promise.all([
            teacherService.getTeacherStats(id),
            teacherService.getTeacherCourses(id)
          ]);
          
          setTeacherAPI(statsData);
          setCourses(coursesData);
        } catch (error) {
          console.error("Error al cargar datos del docente:", error);
        } finally {
          setLoadingCourses(false);
        }
      }
    }
    loadData();
  }, [id]);

  if (!teacherLocal && !teacherAPI && loadingCourses) return <p className="text-white">Cargando...</p>;
  if (!teacherLocal && !teacherAPI && !loadingCourses) return <p className="text-white">No encontrado</p>;

  return (
    <div className="relative z-0 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

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
          <Header teacher={teacherAPI} />
          
       
          <StatsCards teacher={teacherAPI} />
        </div>

        <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-5 backdrop-blur-2xl">
          <Tabs tab={tab} setTab={setTab} />
        </div>

        {tab === "resumen" && (
          <>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-5 backdrop-blur-2xl">
                <HistoryTrend facultyId={facultyId}/>
              </div>
              <div className="p-5 backdrop-blur-2xl">
                <RadarChartComp />
              </div>
            </div>

            <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
              <CoursesList courses={courses} isLoading={loadingCourses}/>
            </div>

            <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
              <Tags />
            </div>
          </>
        )}

        {tab === "semestres" && (
          <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
            <SemesterRatings />
          </div>
        )}

        {tab === "comentarios" && (
          <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
            <ComentariosTab teacherId={id}/>
          </div>
        )}

        {tab === "acciones" && (
          <div className="bg-[#0f111a]/50 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-2xl">
            <Recommendations />
          </div>
        )}

      </div>
    </div>
  );
}