import { FileText, FileSpreadsheet, File } from "lucide-react";

export default function ExportOptions() {
  return (
    <div
      className="
        relative
        bg-[#0f111a]/50
        border border-white/10
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 mb-6">
        <div className="h-px w-10 bg-yellow-400/30" />
        <h2 className="text-sm font-black text-white uppercase tracking-tighter">
          Opciones de Exportación
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        <div
          className="
            group
            bg-white/[0.03]
            border border-white/10
            p-5
            rounded-[1.6rem]
            hover:bg-white/[0.06]
            hover:border-red-400/30
            hover:scale-[1.03]
            transition-all
            cursor-pointer
          "
        >
          <div
            className="
              w-fit
              p-3
              rounded-2xl
              mb-4
              bg-red-500/10
              border border-red-500/20
              text-red-400
              shadow-inner
              group-hover:scale-110
              transition
            "
          >
            <FileText size={18} />
          </div>

          <p className="font-black text-white text-sm uppercase tracking-tight">
            Formato PDF
          </p>

          <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
            Para presentación
          </p>
        </div>

        <div
          className="
            group
            bg-white/[0.03]
            border border-white/10
            p-5
            rounded-[1.6rem]
            hover:bg-white/[0.06]
            hover:border-emerald-400/30
            hover:scale-[1.03]
            transition-all
            cursor-pointer
          "
        >
          <div
            className="
              w-fit
              p-3
              rounded-2xl
              mb-4
              bg-emerald-500/10
              border border-emerald-500/20
              text-emerald-400
              shadow-inner
              group-hover:scale-110
              transition
            "
          >
            <FileSpreadsheet size={18} />
          </div>

          <p className="font-black text-white text-sm uppercase tracking-tight">
            Formato Excel
          </p>

          <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
            Para análisis
          </p>
        </div>

        <div
          className="
            group
            bg-white/[0.03]
            border border-white/10
            p-5
            rounded-[1.6rem]
            hover:bg-white/[0.06]
            hover:border-blue-400/30
            hover:scale-[1.03]
            transition-all
            cursor-pointer
          "
        >
          <div
            className="
              w-fit
              p-3
              rounded-2xl
              mb-4
              bg-blue-500/10
              border border-blue-500/20
              text-blue-400
              shadow-inner
              group-hover:scale-110
              transition
            "
          >
            <File size={18} />
          </div>

          <p className="font-black text-white text-sm uppercase tracking-tight">
            Formato CSV
          </p>

          <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">
            Compatible con sistemas
          </p>
        </div>

      </div>
    </div>
  );
}