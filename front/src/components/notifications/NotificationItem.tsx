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
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-5
        rounded-2xl
        flex justify-between items-start gap-4
        hover:bg-white/[0.05]
        hover:border-white/20
        transition-all duration-300
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex gap-4 items-start relative z-10">
        <div
          className={`
            w-11 h-11 flex items-center justify-center
            rounded-2xl shrink-0
            border shadow-inner
            ${
              isWarning
                ? "bg-red-500/10 border-red-500/20 text-red-400"
                : "bg-green-500/10 border-green-500/20 text-green-500"
            }
          `}
        >
          {isWarning ? (
            <AlertTriangle size={18} />
          ) : (
            <CheckCircle size={18} />
          )}
        </div>

        <div>
          <h3 className="text-[11px] font-black text-white tracking-tight uppercase">
            {title}
          </h3>

          <p className="text-[10px] text-gray-400 mt-2 leading-relaxed max-w-md">
            {description}
          </p>

          <p className="text-[9px] text-gray-500 mt-3 uppercase tracking-widest">
            {time}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 relative z-10">
        {isWarning && (
          <button
            className="
              bg-yellow-400
              text-black
              px-3 py-1.5
              rounded-xl
              text-[10px]
              font-black
              uppercase
              tracking-widest
              shadow-md shadow-yellow-400/20
              hover:bg-yellow-300
              hover:scale-[1.05]
              active:scale-95
              transition-all
            "
          >
            Acción
          </button>
        )}

        <button
          className="
            w-8 h-8 flex items-center justify-center
            rounded-lg
            text-gray-500
            hover:text-white
            hover:bg-white/10
            active:scale-95
            transition-all
          "
        >
          ✕
        </button>
      </div>
    </div>
  );
}