import { useParams, useNavigate } from "react-router-dom";

import Header from "../components/teacherDetail/Header";
import StatsCards from "../components/teacherDetail/StatsCards";
import Tabs from "../components/teacherDetail/Tabs";
import TrainingRadarChart from "../components/teacherDetail/charts/RadarChart";
import SemesterRatings from "../components/teacherDetail/SemesterRatings";
import CoursesList from "../components/teacherDetail/CoursesList";
import { useState, useEffect } from "react";
import ComentariosTab from "../components/teacherDetail/CommentsSection";
import Recommendations from "../components/teacherDetail/Recommendations";
import PerformanceScatter from "../components/dashboard/charts/PerformanceScatter";
import { teacherService } from "../services/teacherService";
import type { Courses } from "../types/teacher";

export default function TeacherDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tab, setTab] = useState("resumen");
  const [teacherAPI, setTeacherAPI] = useState<any>(null);
  const [courses, setCourses] = useState<Courses[]>([]);
  const [loading, setLoading] = useState(true);


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
          <Header teacher={teacherAPI} />
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
                <PerformanceScatter teacherId={id!}/>
                <TrainingRadarChart teacherId={id!} />
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