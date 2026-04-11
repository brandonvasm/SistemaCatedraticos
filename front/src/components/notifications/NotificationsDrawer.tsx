import { X, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const notifications = [
  {
    title: "Evaluación Crítica Detectada",
    desc: "El Ing. Roberto Mejía tiene un promedio de 2.8 en Ecuaciones Diferenciales",
    tag: "Ecuaciones Diferenciales",
    time: "Hace 5 min",
    type: "warning",
  },
  {
    title: "Excelencia Docente",
    desc: "La Dra. Ana Rodríguez alcanzó 4.9 de promedio este semestre",
    tag: "Cálculo I",
    time: "Hace 1 hora",
    type: "success",
  },
];

export default function NotificationsDrawer({ isOpen, onClose }: Props) {
  const navigate = useNavigate();

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 bg-black/60 backdrop-blur-md z-40 transition-opacity
          ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}
        `}
      />

      <div
        className={`
          fixed top-0 right-0 h-full w-[420px]
          bg-[#0b101f]
          border-l border-white/5
          z-50
          transform transition-transform duration-500 ease-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >

        <div className="p-6 flex justify-between items-center border-b border-white/5">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">
              Notificaciones
            </h2>
            <p className="text-[9px] text-gray-500 uppercase tracking-[0.3em] mt-1">
              Centro de alertas
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/[0.03] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">

          {notifications.map((n, i) => {
            const isWarning = n.type === "warning";

            return (
              <div
                key={i}
                className={`
                  p-5 rounded-[1.5rem] border transition-all duration-300
                  ${
                    isWarning
                      ? "bg-red-500/10 border-red-500/20 hover:bg-red-500/15"
                      : "bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15"
                  }
                `}
              >
                <div className="flex gap-4">

                  <div
                    className={`
                      w-11 h-11 flex items-center justify-center
                      rounded-2xl border shrink-0
                      ${
                        isWarning
                          ? "bg-red-500/20 border-red-500/30"
                          : "bg-emerald-500/20 border-emerald-500/30"
                      }
                    `}
                  >
                    {isWarning ? (
                      <AlertTriangle size={18} className="text-red-400" />
                    ) : (
                      <CheckCircle size={18} className="text-emerald-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight">
                      {n.title}
                    </p>

                    <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                      {n.desc}
                    </p>

                    <div className="flex gap-2 mt-3 text-[10px] uppercase tracking-widest">
                      <span className="bg-white/[0.05] border border-white/10 px-2 py-1 rounded-md text-gray-400">
                        {n.tag}
                      </span>
                      <span className="text-gray-500">
                        {n.time}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}

        </div>

        <div className="p-5 border-t border-white/5">
          <button
            onClick={() => {
              onClose();
              navigate("/notificaciones");
            }}
            className="
              w-full
              bg-white/[0.03]
              border border-white/10
              py-3
              rounded-2xl
              text-[10px]
              font-bold
              uppercase
              tracking-widest
              text-gray-300
              hover:bg-white/10 hover:text-white hover:border-white/20
              active:scale-95
              transition-all
            "
          >
            Ver Todas las Notificaciones
          </button>
        </div>

      </div>
    </>
  );
}