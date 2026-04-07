import { FileText } from "lucide-react";

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
    <div className="flex justify-between items-center py-4 border-b border-slate-700">

      <div className="flex gap-4 items-start">

        <div className="bg-blue-500/20 p-3 rounded-xl">
          <FileText className="text-blue-400" />
        </div>

        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-gray-400">{desc}</p>

          <div className="flex gap-3 text-xs text-gray-400 mt-1">
            <span>{date}</span>
            <span>{format}</span>
            <span>{size}</span>
            <span className="text-green-400">● Listo</span>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button className="bg-blue-500/20 px-3 py-1 rounded-lg text-sm">
          Vista Previa
        </button>

        <button className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-sm">
          Descargar
        </button>
      </div>

    </div>
  );
}