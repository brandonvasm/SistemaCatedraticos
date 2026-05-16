import { FileText } from "lucide-react";

import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

import { reportesServices } from "../../services/reportesServices";

export default function ReportCard() {

  const [loading, setLoading] = useState(false);

  const { user } = useAuth();

  const generarReporte = async () => {

    if (!user?.faculty_id) {

      console.error("Sin facultad");

      return;
    }

    try {

      setLoading(true);

      const blob =
        await reportesServices.generarReporteGeneral(
          user.faculty_id
        );

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download = "reporte_general.xlsx";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(
        "Error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <div className="bg-secondary/40 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-xl w-full md:w-[380px] relative overflow-hidden">

      <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-400/10 blur-[80px] rounded-full -ml-20 -mt-20 opacity-20 pointer-events-none" />

      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-yellow-400/10 text-yellow-400">
        <FileText size={20} />
      </div>

      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
        Generar Reportes Globales
      </p>

      <div className="flex items-baseline gap-2 mb-4">

        <span className="text-4xl font-bold text-yellow-400 tracking-tighter">
          1
        </span>

        <span className="text-gray-500 text-[10px] leading-tight font-medium">
          Crear reportes ejecutivos para junta directiva
        </span>

      </div>

      <p className="text-[10px] text-yellow-400 mb-3 uppercase">
        Facultad: {user?.faculty_name || "N/A"}
      </p>

      <button
        onClick={generarReporte}
        disabled={loading}
        className="
          px-5 py-2.5
          bg-yellow-400
          text-black
          rounded-xl
          text-[10px]
          font-bold
          tracking-widest
          uppercase
          hover:bg-yellow-300
          transition-all
          shadow-lg
          shadow-yellow-400/20
          disabled:opacity-50
        "
      >
        {loading
          ? "GENERANDO..."
          : "GENERAR REPORTE"}
      </button>

    </div>
  );
}