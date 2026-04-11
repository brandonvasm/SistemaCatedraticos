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
    <div
      className="
        flex flex-col md:flex-row
        justify-between
        md:items-center
        gap-5
        py-5
        px-3
        rounded-2xl
        hover:bg-white/[0.04]
        transition-all
      "
    >
      <div className="flex gap-4 items-start">

        <div
          className="
            bg-blue-500/10
            border border-blue-500/20
            p-3
            rounded-2xl
            shadow-inner
          "
        >
          <FileText className="text-blue-400" size={18} />
        </div>

        <div>
          <p className="font-black text-white tracking-tight uppercase text-sm">
            {title}
          </p>

          <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
            {desc}
          </p>

          <div className="flex flex-wrap gap-3 text-[10px] text-gray-500 mt-3 uppercase tracking-wide">

            <span>{date}</span>

            <span className="bg-white/[0.03] border border-white/10 px-2 py-0.5 rounded-md">
              {format}
            </span>

            <span>{size}</span>

            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              ● Listo
            </span>

          </div>
        </div>
      </div>

      <div className="flex gap-2">

        <button
          className="
            flex items-center gap-2
            bg-white/[0.03]
            border border-white/10
            px-4 py-2
            rounded-xl
            text-[11px]
            text-gray-300
            uppercase
            tracking-wide
            hover:bg-white/[0.06]
            hover:text-white
            hover:border-white/20
            transition-all
          "
        >
          <Eye size={14} />
          Vista
        </button>

        <button
          className="
            flex items-center gap-2
            bg-yellow-400
            text-black
            px-4 py-2
            rounded-xl
            text-[11px]
            font-black
            uppercase
            tracking-wide
            shadow-lg shadow-yellow-400/20
            hover:bg-yellow-300
            hover:scale-[1.03]
            active:scale-95
            transition-all
          "
        >
          <Download size={14} />
          Descargar
        </button>

      </div>
    </div>
  );
}