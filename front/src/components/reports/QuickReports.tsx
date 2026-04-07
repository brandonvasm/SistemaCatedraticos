import { TrendingUp, BookOpen, CheckCircle, Calendar } from "lucide-react";
import ReportQuickCard from "./ReportQuickCard";

export default function QuickReports() {
  return (
    <div className="grid md:grid-cols-4 gap-4 mb-6">

      <ReportQuickCard
        icon={<TrendingUp />}
        title="Top 10 Docentes"
        desc="Mejores evaluados del semestre"
        color="bg-green-500/20 text-green-400"
      />

      <ReportQuickCard
        icon={<BookOpen />}
        title="Cursos Críticos"
        desc="Requieren atención inmediata"
        color="bg-orange-500/20 text-orange-400"
      />

      <ReportQuickCard
        icon={<CheckCircle />}
        title="Resumen Ejecutivo"
        desc="Métricas clave y decisiones"
        color="bg-blue-500/20 text-blue-400"
      />

      <ReportQuickCard
        icon={<Calendar />}
        title="Comparativa Semestral"
        desc="vs semestre anterior"
        color="bg-purple-500/20 text-purple-400"
      />

    </div>
  );
}