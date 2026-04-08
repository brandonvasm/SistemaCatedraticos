import { TrendingUp, BookOpen, CheckCircle, Calendar } from "lucide-react";
import ReportQuickCard from "./ReportQuickCard";

export default function QuickReports() {
  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">

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
  );
}