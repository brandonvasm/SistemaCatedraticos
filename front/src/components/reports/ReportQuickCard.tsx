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
        bg-[#0f111a]/50
        backdrop-blur-2xl
        p-5
        rounded-2xl
        border border-white/10
        shadow-xl
        hover:bg-[#0f111a]/70
        hover:border-white/20
        hover:scale-[1.02]
        transition-all duration-300
        cursor-pointer
      "
    >

      <div
        className={`
          w-fit
          p-3
          rounded-xl
          mb-4
          ${color}
        `}
      >
        {icon}
      </div>

      <h3 className="font-bold text-white text-sm mb-1 tracking-tight">
        {title}
      </h3>

      <p className="text-xs text-gray-500 mb-4">
        {desc}
      </p>

      <button
        className="
          w-full
          bg-white/5
          border border-white/10
          py-2
          rounded-lg
          text-xs
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