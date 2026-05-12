import {
  TrendingUp,
  BookOpen,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

import ReportQuickCard from "./ReportQuickCard";
import api from "../../api/axios";

export default function QuickReports() {

  const { user } = useAuth();
  const facultyId = user?.faculty_id;

  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const downloadFile = async (
    url: string,
    filename: string,
    reportId: string
  ) => {
    try {
      setLoadingReport(reportId);

      const response = await api.get(url, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);

      const link = document.createElement("a");

      link.href = window.URL.createObjectURL(blob);
      link.download = filename;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(link.href);

    } catch (error) {
      console.error("Error descargando reporte:", error);
    } finally {
      setLoadingReport(null);
    }
  };

  const handleTopCoursesDownload = async () => {
    const semester = prompt("Ingrese el ID del semestre");
    if (!semester || !facultyId) return;

    await downloadFile(
      `/reports/courses-top-reports/?semester=${semester}&faculty=${facultyId}`,
      `top_4_cursos_semestre_${semester}.xlsx`,
      "top-courses"
    );
  };

  const handleEvolutionDownload = async () => {
    if (!facultyId) return;

    await downloadFile(
      `/reports/courses-evolution-reports/?faculty=${facultyId}`,
      "evolucion_cursos.xlsx",
      "course-evolution"
    );
  };

  const handleFilesDownload = async () => {
    if (!facultyId) return;

    await downloadFile(
      `/reports/files-reports/?faculty=${facultyId}`,
      "reporte_files.xlsx",
      "files-report"
    );
  };

  return (
    <div className="mb-10 space-y-6">

      <div className="flex items-center gap-4 ml-1">
        <div className="h-px w-10 bg-yellow-400/30" />

        <h2 className="text-xl font-black text-white uppercase tracking-tighter">
          Reportes Rápidos
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

        <ReportQuickCard
          icon={
            loadingReport === "top-courses"
              ? <Loader2 size={18} className="animate-spin" />
              : <TrendingUp size={18} />
          }
          title={
            loadingReport === "top-courses"
              ? "Generando..."
              : "Top 4 Cursos"
          }
          desc={
            loadingReport === "top-courses"
              ? "Preparando Excel"
              : "Mejores punteos"
          }
          variant="green"
          disabled={loadingReport !== null}
          onClick={handleTopCoursesDownload}
        />

        <ReportQuickCard
          icon={
            loadingReport === "course-evolution"
              ? <Loader2 size={18} className="animate-spin" />
              : <BookOpen size={18} />
          }
          title={
            loadingReport === "course-evolution"
              ? "Generando..."
              : "Evolución de Cursos"
          }
          desc={
            loadingReport === "course-evolution"
              ? "Preparando Excel"
              : "Datos históricos"
          }
          variant="yellow"
          disabled={loadingReport !== null}
          onClick={handleEvolutionDownload}
        />

        <ReportQuickCard
          icon={
            loadingReport === "files-report"
              ? <Loader2 size={18} className="animate-spin" />
              : <CheckCircle size={18} />
          }
          title={
            loadingReport === "files-report"
              ? "Generando..."
              : "Reporte de Archivos"
          }
          desc={
            loadingReport === "files-report"
              ? "Preparando Excel"
              : "Archivos del sistema"
          }
          variant="green"
          disabled={loadingReport !== null}
          onClick={handleFilesDownload}
        />

      </div>
    </div>
  );
}