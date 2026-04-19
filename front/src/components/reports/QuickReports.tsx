import { TrendingUp, BookOpen, CheckCircle, Calendar } from "lucide-react";
import ReportQuickCard from "./ReportQuickCard";

export default function QuickReports() {
  return (
    <div className="mb-10 space-y-6">
      
      <div className="flex items-center gap-4 ml-1">
        <div className="h-px w-10 bg-yellow-400/30" />
        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
          Reportes Rápidos
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <ReportQuickCard
          icon={<TrendingUp size={18} />}
          title="Top 10 Docentes"
          desc="Mejores evaluados"
          variant="green"
        />

        <ReportQuickCard
          icon={<BookOpen size={18} />}
          title="Cursos Críticos"
          desc="Requieren atención"
          variant="yellow"
        />

        <ReportQuickCard
          icon={<CheckCircle size={18} />}
          title="Resumen Ejecutivo"
          desc="Métricas clave"
          variant="green"
        />

        <ReportQuickCard
          icon={<Calendar size={18} />}
          title="Comparativa"
          desc="Semestre anterior"
          variant="yellow"
        />

      </div>
    </div>
  );
}