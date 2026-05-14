import {
  TrendingUp,
  BookOpen,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import ReportQuickCard from "./ReportQuickCard";

import { reportesServices } from "../../services/reportesServices";

export default function QuickReports() {

  const { user } = useAuth();

  const facultyId = user?.faculty_id;
  const semesterId = user?.semester_id;

  const [loadingReport, setLoadingReport] = useState<string | null>(null);

  const descargarArchivo = (
    blob: Blob,
    filename: string
  ) => {

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
  };

  const handleTopCoursesDownload = async () => {

    if (!semesterId || !facultyId) return;

    try {

      setLoadingReport("top-courses");

      const blob =
        await reportesServices.descargarTopCursos(
          semesterId,
          facultyId
        );

      descargarArchivo(
        blob,
        `top_4_cursos_semestre_${semesterId}.xlsx`
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingReport(null);
    }
  };

  const handleEvolutionDownload = async () => {

    if (!facultyId) return;

    try {

      setLoadingReport("course-evolution");

      const blob =
        await reportesServices.descargarEvolucionCursos(
          facultyId
        );

      descargarArchivo(
        blob,
        "evolucion_cursos.xlsx"
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingReport(null);
    }
  };

  const handleFilesDownload = async () => {

    if (!facultyId) return;

    try {

      setLoadingReport("files-report");

      const blob =
        await reportesServices.descargarReporteArchivos(
          facultyId
        );

      descargarArchivo(
        blob,
        "reporte_files.xlsx"
      );

    } catch (error) {

      console.error(error);

    } finally {

      setLoadingReport(null);
    }
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