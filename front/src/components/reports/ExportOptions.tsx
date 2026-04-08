import { FileText, FileSpreadsheet, File } from "lucide-react";

export default function ExportOptions() {
  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-6
      rounded-2xl
      backdrop-blur-2xl
      shadow-xl
    ">

      <h2 className="mb-5 font-bold text-gray-200 tracking-tight">
        Opciones de Exportación
      </h2>

      <div className="grid md:grid-cols-3 gap-4">

        {/* PDF */}
        <div className="
          group
          bg-white/5
          border border-white/10
          p-4
          rounded-xl
          hover:bg-white/10
          hover:border-red-400/30
          transition-all
          cursor-pointer
        ">
          <div className="
            w-fit
            p-3
            rounded-xl
            mb-3
            bg-red-500/10
            border border-red-500/20
            text-red-400
            group-hover:scale-110
            transition
          ">
            <FileText size={18} />
          </div>

          <p className="font-semibold text-gray-200">
            Formato PDF
          </p>

          <p className="text-sm text-gray-500">
            Para presentación
          </p>
        </div>

        {/* EXCEL */}
        <div className="
          group
          bg-white/5
          border border-white/10
          p-4
          rounded-xl
          hover:bg-white/10
          hover:border-emerald-400/30
          transition-all
          cursor-pointer
        ">
          <div className="
            w-fit
            p-3
            rounded-xl
            mb-3
            bg-emerald-500/10
            border border-emerald-500/20
            text-emerald-400
            group-hover:scale-110
            transition
          ">
            <FileSpreadsheet size={18} />
          </div>

          <p className="font-semibold text-gray-200">
            Formato Excel
          </p>

          <p className="text-sm text-gray-500">
            Para análisis
          </p>
        </div>

        {/* CSV */}
        <div className="
          group
          bg-white/5
          border border-white/10
          p-4
          rounded-xl
          hover:bg-white/10
          hover:border-blue-400/30
          transition-all
          cursor-pointer
        ">
          <div className="
            w-fit
            p-3
            rounded-xl
            mb-3
            bg-blue-500/10
            border border-blue-500/20
            text-blue-400
            group-hover:scale-110
            transition
          ">
            <File size={18} />
          </div>

          <p className="font-semibold text-gray-200">
            Formato CSV
          </p>

          <p className="text-sm text-gray-500">
            Compatible con sistemas
          </p>
        </div>

      </div>
    </div>
  );
}