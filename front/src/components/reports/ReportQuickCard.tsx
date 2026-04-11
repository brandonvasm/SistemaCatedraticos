import { Download } from "lucide-react";

type Props = {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
};

export default function ReportQuickCard({
  icon,
  title,
  desc,
  color,
}: Props) {
  return (
    <div
      className="
        relative
        bg-[#0f111a]/50
        backdrop-blur-2xl
        p-6
        rounded-[1.8rem]
        border border-white/10
        shadow-xl
        hover:bg-[#0f111a]/70
        hover:border-white/20
        hover:scale-[1.03]
        transition-all duration-300
        cursor-pointer
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div
        className={`
          w-fit
          p-3
          rounded-2xl
          mb-5
          shadow-inner
          ${color}
        `}
      >
        {icon}
      </div>

      <h3 className="font-black text-white text-sm mb-1 tracking-tight uppercase">
        {title}
      </h3>

      <p className="text-[11px] text-gray-500 mb-5 uppercase tracking-wider">
        {desc}
      </p>

      <button
        className="
          w-full
          bg-white/[0.03]
          border border-white/10
          py-2.5
          rounded-xl
          text-[11px]
          text-gray-300
          flex items-center justify-center gap-2
          hover:bg-blue-500/20
          hover:border-blue-500/30
          hover:text-blue-300
          active:scale-95
          transition-all
        "
      >
        <Download size={14} />
        Descargar
      </button>
    </div>
  );
}