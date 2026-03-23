import { useParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout"
import teachers from "../data/teachers";
import Header from "../components/teacherDetail/Header";
import StatsCards from "../components/teacherDetail/StatsCards";
import Tabs from "../components/teacherDetail/Tabs";
import LineChartComp from "../components/teacherDetail/charts/LineChart";
import RadarChartComp from "../components/teacherDetail/charts/RadarChart";
import SemesterRatings from "../components/teacherDetail/SemesterRatings";
import CoursesList from "../components/teacherDetail/CoursesList";
import Tags from "../components/teacherDetail/Tags";
import { useState } from "react";
import ComentariosTab from "../components/teacherDetail/CommentsSection";
import Recommendations from "../components/teacherDetail/Recommendations";

export default function TeacherDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("resumen");

  const teacher = teachers.find((t) => t.id === id);

  if (!teacher) return <p>No encontrado</p>;

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-[#0b1324] text-white w-full">

        <div className="px-6 pt-4">
          <button
            onClick={() => navigate(-1)}
            className="bg-slate-700 px-4 py-2 rounded-lg text-sm"
          >
            ← Volver al listado
          </button>
        </div>

        <div className="px-6 py-4">

          <Header teacher={teacher} />
          <StatsCards teacher={teacher} />
          <Tabs tab={tab} setTab={setTab} />

          {tab === "resumen" && (
            <>
              <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <LineChartComp />
                <RadarChartComp />
              </div>

              <CoursesList />
              <Tags />
            </>
          )}

          {tab === "semestres" && <SemesterRatings />}

          {tab === "comentarios" && <ComentariosTab />}

          {tab === "acciones" && <Recommendations />}
        </div>
      </div>
    </DashboardLayout>
  );
}