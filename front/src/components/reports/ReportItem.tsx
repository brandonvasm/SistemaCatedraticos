import { FileText, Download, Loader2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

import { reportesServices } from "../../services/reportesServices";

type Props = {
  title: string;
  desc: string;
  date: string;
  format: string;
  size: string;
  endpoint: string;
};

export default function ReportItem({
  title,
  desc,
  date,
  format,
  endpoint,
}: Props) {

  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const descargar = async () => {

    setLoading(true);

    try {

      const blob = await reportesServices.descargarReporte(endpoint);

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = `${endpoint}.xlsx`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  return (
    <div
      className="
        flex justify-between items-center
        py-5 px-3
        hover:bg-white/[0.04]
        rounded-2xl
        transition-all
      "
    >

      <div className="flex gap-4 items-start">

        <div className="bg-blue-500/10 border border-blue-500/20 p-3 rounded-2xl">
          <FileText className="text-blue-400" size={18} />
        </div>

        <div>

          <p className="font-black text-white uppercase text-sm">
            {title}
          </p>

          <p className="text-[11px] text-gray-500 uppercase">
            {desc}
          </p>

          <div className="text-[10px] text-gray-500 mt-2">
            {date} • {format}
          </div>

          <p className="text-[10px] text-yellow-400 mt-1 uppercase">
            Facultad: {user?.faculty_name || "N/A"}
          </p>

        </div>

      </div>

      <button
        onClick={descargar}
        disabled={loading}
        className={`
          flex items-center gap-2
          px-4 py-2
          rounded-xl
          text-[11px]
          font-black
          uppercase
          transition-all
          ${loading
            ? "bg-gray-400 cursor-not-allowed text-black"
            : "bg-yellow-400 text-black hover:bg-yellow-300"}
        `}
      >

        {loading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Download size={14} />
            Descargar
          </>
        )}

      </button>

    </div>
  );
}