import { FileText, Download } from "lucide-react";

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
  size,
  endpoint,
}: Props) {

  const descargar = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/reports/${endpoint}/?faculty=7`
      );

      if (!response.ok) throw new Error("Error al descargar");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${endpoint}.xlsx`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
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
        </div>

      </div>

      <button
        onClick={descargar}
        className="
          flex items-center gap-2
          bg-yellow-400
          text-black
          px-4 py-2
          rounded-xl
          text-[11px]
          font-black
          uppercase
          hover:bg-yellow-300
          transition-all
        "
      >
        <Download size={14} />
        Descargar
      </button>

    </div>
  );
}