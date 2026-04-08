import { FileText, Eye, Download } from "lucide-react";

type Props = {
  title: string;
  desc: string;
  date: string;
  format: string;
  size: string;
};

export default function ReportItem({
  title,
  desc,
  date,
  format,
  size,
}: Props) {
  return (
    <div className="
      flex flex-col md:flex-row
      justify-between
      md:items-center
      gap-4
      py-4
      hover:bg-white/[0.03]
      px-2
      rounded-xl
      transition-all
    ">

      {/* LEFT */}
      <div className="flex gap-4 items-start">

        <div className="
          bg-blue-500/10
          border border-blue-500/20
          p-3
          rounded-xl
        ">
          <FileText className="text-blue-400" size={18} />
        </div>

        <div>
          <p className="font-semibold text-gray-200 tracking-tight">
            {title}
          </p>

          <p className="text-sm text-gray-500">
            {desc}
          </p>

          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mt-2">

            <span>{date}</span>

            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
              {format}
            </span>

            <span>{size}</span>

            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              ● Listo
            </span>

          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex gap-2">

        <button className="
          flex items-center gap-2
          bg-white/5
          border border-white/10
          px-3 py-1.5
          rounded-lg
          text-sm
          text-gray-300
          hover:bg-white/10 hover:text-white
          transition-all
        ">
          <Eye size={14} />
          Vista
        </button>

        <button className="
          flex items-center gap-2
          bg-yellow-400/90
          text-black
          px-3 py-1.5
          rounded-lg
          text-sm font-semibold
          hover:bg-yellow-300
          active:scale-95
          transition-all
        ">
          <Download size={14} />
          Descargar
        </button>

      </div>
    </div>
  );
}