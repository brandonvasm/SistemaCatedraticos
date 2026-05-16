import type { ReactNode } from "react";
import { Download } from "lucide-react";

type Props = {
  icon: ReactNode;
  title: string;
  desc: string;
  variant?: "yellow" | "green";
  disabled?: boolean;
  onClick?: () => void;
};

export default function ReportQuickCard({
  icon,
  title,
  desc,
  variant = "yellow",
  disabled = false,
  onClick,
}: Props) {
  const variants = {
    yellow:
      "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 shadow-yellow-400/10",
    green:
      "bg-green-500/10 text-green-500 border border-green-500/20 shadow-green-500/10",
  };

  return (
    <div
      className="
        group relative
        bg-white/[0.02]
        backdrop-blur-2xl
        p-6
        rounded-[1.8rem]
        border border-white/5
        shadow-xl
        hover:bg-white/[0.05]
        hover:border-white/20
        hover:scale-[1.04]
        transition-all duration-300
        overflow-hidden
      "
    >
      {/* glow */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      {/* icon */}
      <div className={`w-fit p-3 rounded-2xl mb-5 shadow-inner ${variants[variant]}`}>
        {icon}
      </div>

      {/* content */}
      <h3 className="font-black text-white text-[11px] mb-1 tracking-tight uppercase">
        {title}
      </h3>

      <p className="text-[10px] text-gray-500 mb-5 uppercase tracking-wider">
        {desc}
      </p>

      {/* button */}
      <button
        onClick={onClick}
        disabled={disabled}
        className="
          w-full
          bg-white/[0.03]
          border border-white/10
          py-2.5
          rounded-xl
          text-[10px]
          text-gray-400
          flex items-center justify-center gap-2
          hover:bg-white/10
          hover:border-white/20
          hover:text-white
          active:scale-95
          transition-all
          disabled:opacity-40
          disabled:cursor-not-allowed
        "
      >
        <Download size={14} />
        Descargar
      </button>
    </div>
  );
}