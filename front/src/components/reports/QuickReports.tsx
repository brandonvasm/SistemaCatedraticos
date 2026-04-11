import { TrendingUp, BookOpen, CheckCircle, Calendar } from "lucide-react";
import ReportQuickCard from "./ReportQuickCard";

export default function QuickReports() {
  return (
    <div className="mb-10 space-y-6">

      <div className="flex items-center gap-4 ml-1">
        <div className="h-px w-10 bg-yellow-400/30" />
        <h2 className="
          text-xl
          font-black
          text-white
          uppercase
          tracking-tighter
        ">
          Reportes Rápidos
        </h2>
      </div>

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-5
      ">

        <ReportQuickCard
          icon={<TrendingUp size={18} />}
          title="Top 10 Docentes"
          desc="Mejores evaluados"
          color="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
        />

        <ReportQuickCard
          icon={<BookOpen size={18} />}
          title="Cursos Críticos"
          desc="Requieren atención"
          color="bg-orange-500/10 text-orange-400 border border-orange-500/20"
        />

        <ReportQuickCard
          icon={<CheckCircle size={18} />}
          title="Resumen Ejecutivo"
          desc="Métricas clave"
          color="bg-blue-500/10 text-blue-400 border border-blue-500/20"
        />

        <ReportQuickCard
          icon={<Calendar size={18} />}
          title="Comparativa"
          desc="Semestre anterior"
          color="bg-purple-500/10 text-purple-400 border border-purple-500/20"
        />

      </div>
    </div>
  );
}