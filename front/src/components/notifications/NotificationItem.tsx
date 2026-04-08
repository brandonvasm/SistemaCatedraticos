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
      bg-white/5
      border border-white/10
      p-4 rounded-xl
      flex justify-between items-start gap-4
      hover:bg-white/10
      transition
    ">

      <div className="flex gap-3 items-start">

        {/* ICONO ARREGLADO (NO MÁS ESTIRADO) */}
        <div className={`
          w-10 h-10 flex items-center justify-center
          rounded-lg shrink-0
          ${isWarning
            ? "bg-red-500/10 border border-red-500/20"
            : "bg-emerald-500/10 border border-emerald-500/20"}
        `}>
          {isWarning ? (
            <AlertTriangle size={18} className="text-red-400" />
          ) : (
            <CheckCircle size={18} className="text-emerald-400" />
          )}
        </div>

        {/* CONTENIDO */}
        <div>
          <h3 className="font-semibold text-gray-200">
            {title}
          </h3>

          <p className="text-sm text-gray-400 mt-1 leading-relaxed">
            {description}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {time}
          </p>
        </div>

      </div>

      {/* ACCIONES */}
      <div className="flex items-center gap-2 shrink-0">

        {isWarning && (
          <button className="
            bg-yellow-400/90
            text-black
            px-3 py-1.5
            rounded-lg text-xs font-medium
            hover:bg-yellow-300
            transition
          ">
            Acción
          </button>
        )}

        <button className="
          w-7 h-7 flex items-center justify-center
          rounded-md
          text-gray-500
          hover:text-white hover:bg-white/10
          transition
        ">
          ✕
        </button>

      </div>

    </div>
  );
}