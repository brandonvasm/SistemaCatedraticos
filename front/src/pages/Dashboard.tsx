import DashboardLayout from "../components/layout/DashboardLayout"
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
    <DashboardLayout>
      <div className="min-h-screen p-10">
        
        <div className="max-w-[1400px] mx-auto pb-20 space-y-12">
          
          <header className="mb-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard General</h1>
            <p className="text-gray-400 mt-1">Vista completa de evaluación docente - Facultad de Ingeniería</p>
          </header>

          <section>
            <StatsSection />
          </section>

          <section className="bg-secondary/10 border border-white/5 p-6 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-200 tracking-tight">Tablero de Docentes</h2>
              <div className="text-xs text-gray-500 font-bold uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full">
                12 Docentes
              </div>
            </div>
            <TeachersGrid />
          </section>
          
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RankingCard title="Mejores Valorados" icon={Award} color="green" teachers={topTeachers} />
            <ThresholdCard />
            <RankingCard title="Requieren Atención" icon={AlertCircle} color="red" teachers={alertTeachers} />
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <PerformanceScatter />
            </div>
            <div className="h-full">
              <EfficiencyPanel />
            </div>
          </section>

          <section className="pt-10 border-t border-white/5 space-y-10">
            <div>
              <h2 className="text-xl font-bold text-gray-200 tracking-tight">Análisis de Tendencia y Rendimiento</h2>
              <p className="text-gray-500 text-sm mt-1">Métricas históricas y por asignatura</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <HistoryTrend />
              <PerformancePie />
            </div>

            <div className="w-full">
              <CourseBarChart />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  )
}