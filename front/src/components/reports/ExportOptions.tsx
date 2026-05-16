import {  FileSpreadsheet } from "lucide-react";

export default function ExportOptions() {
  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        overflow-hidden
      "
    >
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <div className="h-px w-10 bg-yellow-400/30" />
        <h2 className="text-[11px] font-black text-white uppercase tracking-tighter">
          Opciones de Exportación
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">

        <div
          className="
            group
            bg-white/[0.02]
            border border-white/5
            p-5
            rounded-[1.6rem]
            hover:bg-white/[0.05]
            hover:border-green-400/30
            hover:scale-[1.04]
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
              bg-green-500/10
              border border-green-500/20
              text-green-500
              shadow-inner
              group-hover:scale-110
              transition
            "
          >
            <FileSpreadsheet size={18} />
          </div>

          <p className="font-black text-white text-[11px] uppercase tracking-tight">
            Formato Excel
          </p>

          <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">
            Para análisis
          </p>
        </div>

      </div>
    </div>
  );
}