import { useParams, useNavigate } from "react-router-dom";
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

  if (!teacher) return <p className="text-white">No encontrado</p>;

  return (
    <div className="relative z-0 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      <div className="px-6 pt-8">
        <button
          onClick={() => navigate(-1)}
          className="
            bg-white/5
            hover:bg-white/10
            border border-white/10
            px-6 py-3
            rounded-2xl
            text-[11px]
            font-black
            uppercase
            tracking-widest
            text-gray-400
            hover:text-white
            transition-all
            active:scale-95
            backdrop-blur-xl
          "
        >
          ← Volver al listado
        </button>
      </div>

      <div className="px-6 py-6 max-w-[1300px] mx-auto space-y-8">

        <div className="
          bg-[#0f111a]/50
          border border-white/10
          rounded-[2.5rem]
          p-8
          backdrop-blur-2xl
          shadow-xl
        ">
          <Header teacher={teacher} />
          <StatsCards teacher={teacher} />
        </div>

        <div className="
          bg-[#0f111a]/50
          border border-white/10
          rounded-[2.5rem]
          p-5
          backdrop-blur-2xl
        ">
          <Tabs tab={tab} setTab={setTab} />
        </div>

        {tab === "resumen" && (
          <>
            <div className="grid lg:grid-cols-2 gap-6">

              <div className="
                bg-[#0f111a]/50
                border border-white/10
                rounded-[2.5rem]
                p-5
                backdrop-blur-2xl
              ">
                <LineChartComp />
              </div>

              <div className="
                bg-[#0f111a]/50
                border border-white/10
                rounded-[2.5rem]
                p-5
                backdrop-blur-2xl
              ">
                <RadarChartComp />
              </div>

            </div>

            <div className="
              bg-[#0f111a]/50
              border border-white/10
              rounded-[2.5rem]
              p-8
              backdrop-blur-2xl
            ">
              <CoursesList />
            </div>

            <div className="
              bg-[#0f111a]/50
              border border-white/10
              rounded-[2.5rem]
              p-8
              backdrop-blur-2xl
            ">
              <Tags />
            </div>
          </>
        )}

        {tab === "semestres" && (
          <div className="
            bg-[#0f111a]/50
            border border-white/10
            rounded-[2.5rem]
            p-8
            backdrop-blur-2xl
          ">
            <SemesterRatings />
          </div>
        )}

        {tab === "comentarios" && (
          <div className="
            bg-[#0f111a]/50
            border border-white/10
            rounded-[2.5rem]
            p-8
            backdrop-blur-2xl
          ">
            <ComentariosTab />
          </div>
        )}

        {tab === "acciones" && (
          <div className="
            bg-[#0f111a]/50
            border border-white/10
            rounded-[2.5rem]
            p-8
            backdrop-blur-2xl
          ">
            <Recommendations />
          </div>
        )}

      </div>
    </div>
  );
}