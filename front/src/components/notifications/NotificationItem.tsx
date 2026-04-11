import { AlertTriangle, CheckCircle } from "lucide-react";

type Props = {
  title: string;
  description: string;
  time: string;
  type: "warning" | "success";
};

export default function NotificationItem({
  title,
  description,
  time,
  type,
}: Props) {
  const isWarning = type === "warning";

  return (
    <div className="
      bg-white/[0.02]
      border border-white/10
      p-5
      rounded-2xl
      flex justify-between items-start gap-4
      hover:bg-white/10
      hover:border-white/20
      transition-all duration-300
    ">

      <div className="flex gap-4 items-start">

        <div className={`
          w-11 h-11 flex items-center justify-center
          rounded-2xl shrink-0
          border
          ${isWarning
            ? "bg-red-500/10 border-red-500/20"
            : "bg-emerald-500/10 border-emerald-500/20"}
        `}>
          {isWarning ? (
            <AlertTriangle size={18} className="text-red-400" />
          ) : (
            <CheckCircle size={18} className="text-emerald-400" />
          )}
        </div>

        <div>
          <h3 className="text-sm font-black text-white tracking-tight uppercase">
            {title}
          </h3>

          <p className="text-xs text-gray-400 mt-2 leading-relaxed max-w-md">
            {description}
          </p>

          <p className="text-[10px] text-gray-500 mt-3 uppercase tracking-widest">
            {time}
          </p>
        </div>

      </div>

      <div className="flex items-center gap-2 shrink-0">

        {isWarning && (
          <button className="
            bg-yellow-400
            text-black
            px-3 py-1.5
            rounded-xl
            text-[10px]
            font-bold
            uppercase
            tracking-widest
            shadow-md
            hover:bg-yellow-300
            active:scale-95
            transition-all
          ">
            Acción
          </button>
        )}

        <button className="
          w-8 h-8 flex items-center justify-center
          rounded-lg
          text-gray-500
          hover:text-white hover:bg-white/10
          active:scale-95
          transition-all
        ">
          ✕
        </button>

      </div>

    </div>
  );
}