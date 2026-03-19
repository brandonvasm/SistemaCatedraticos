import DashboardLayout from "../components/layout/DashboardLayout"
import StatsSection from "../components/dashboard/StatsSection"
import TeachersGrid from "../components/dashboard/TeachersGrid"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard General</h1>
          <p className="text-gray-400 mt-1">Vista completa de evaluación docente - Facultad de Ingeniería</p>
        </header>

        <StatsSection />

        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-200 tracking-tight">Tablero de Docentes</h2>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest">👤 12 Docentes</div>
          </div>
          <TeachersGrid />
        </div>
      </div>
    </DashboardLayout>
  )
}