import StatsSection from "../components/dashboard/stats/StatsSection"
import TeachersGrid from "../components/dashboard/stats/TeachersGrid"
import RankingCard from "../components/dashboard/stats/RankingCard";
import ThresholdCard from "../components/dashboard/stats/ThresholdCard";
import PerformanceScatter from "../components/dashboard/charts/PerformanceScatter";
import EfficiencyPanel from "../components/dashboard/insights/EfficiencyPanel";
import HistoryTrend from "../components/dashboard/charts/HistoryTrend";
import PerformancePie from "../components/dashboard/charts/PerformancePie";
import CourseBarChart from "../components/dashboard/courses/CourseBarChart";
import { Award, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const topTeachers = [
    { name: "Dr. Juan Pérez", score: "4.9", students: "168" },
    { name: "Dr. Carlos Méndez", score: "4.8", students: "187" }
  ];

  const alertTeachers = [
    { name: "Lic. Roberto Mejía", score: "3.2", students: "118" },
    { name: "Lic. María González", score: "3.6", students: "128" }
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      
      <header>
       <h1 className="text-5xl font-black text-white tracking-tighter ">Dashboard General</h1>
        <p className="text-gray-500 font-medium mt-1">
          Vista completa de evaluación docente — Facultad de Ingeniería
        </p>
      </header>

      <section>
        <StatsSection />
      </section>

      <section className="bg-[#11141d]/50 border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-xl shadow-2xl">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-200 tracking-tight uppercase">
            Tablero de Docentes
          </h2>
          <div className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.2em] bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/20">
            12 Docentes Activos
          </div>
        </div>
        <TeachersGrid />
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <RankingCard title="Mejores Valorados" icon={Award} color="green" teachers={topTeachers} />
        <ThresholdCard />
        <RankingCard title="Requieren Atención" icon={AlertCircle} color="red" teachers={alertTeachers} />
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <PerformanceScatter />
        </div>
        <div>
          <EfficiencyPanel />
        </div>
      </section>

      <section className="pt-10 border-t border-white/5 space-y-10 pb-20">
        <div>
          <h2 className="text-xl font-bold text-gray-200 tracking-tight uppercase">
            Análisis de Tendencia y Rendimiento
          </h2>
          <p className="text-gray-500 font-medium mt-1">Métricas históricas y por asignatura</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <HistoryTrend />
          <PerformancePie />
        </div>

        <div className="bg-[#11141d]/50 border border-white/5 p-8 rounded-[2.5rem]">
          <CourseBarChart />
        </div>
      </section>
    </div>
  );
}