import { motion, AnimatePresence } from "framer-motion";
import {
  Table,
  Info,
  X,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({
  isOpen,
  onClose,
}: ExportModalProps) {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);

  const formats = [
    {
      id: "excel",
      name: "Hoja Excel (XLSX)",
      desc: "Datos crudos para análisis externo.",
      icon: Table,
      color: "text-green-400",
    },
  ];

  const generarReporte = async () => {
    if (!user?.faculty_id) {
      console.error("Sin facultad");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `http://localhost:8000/api/reports/general-reports/?faculty=${user.faculty_id}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error al generar el reporte");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;
      a.download = "reporte_general.xlsx";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

      onClose();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="relative w-full max-w-2xl bg-[#11141d]/90 border border-white/10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl overflow-hidden p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-5 mb-10">
              <div className="w-14 h-14 bg-yellow-400/10 rounded-2xl flex items-center justify-center text-yellow-400 border border-yellow-400/20 shadow-inner">
                <Info size={28} />
              </div>

              <div>
                <h2 className="text-3xl font-black text-white uppercase">
                  Exportar Reportes
                </h2>

                <p className="text-gray-500 text-sm font-bold mt-2 uppercase tracking-tight opacity-70">
                  Configura tu documento antes de la descarga
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/5 rounded-[2rem] p-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-yellow-400/10 transition-colors" />

                  <h4 className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] mb-5">
                    Contenido del archivo
                  </h4>

                  <ul className="space-y-4 relative z-10">
                    {[
                      "Métricas de desempeño docente",
                      "Ranking de las mejores facultades",
                      "Alertas de umbral de rendimiento",
                      "Gráficos históricos",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-xs text-gray-300 font-bold"
                      >
                        <div className="w-5 h-5 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                          <CheckCircle2 size={12} />
                        </div>

                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 border-l-2 border-yellow-500/30 bg-yellow-500/5 rounded-r-2xl">
                  <p className="text-[10px] text-gray-500 leading-relaxed font-medium uppercase tracking-tight">
                    * Los reportes se sincronizan con los filtros actuales del dashboard.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em] mb-5">
                  Selecciona el formato
                </h4>

                {formats.map((f) => (
                  <button
                    key={f.id}
                    className="w-full flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group text-left relative overflow-hidden"
                  >
                    <div
                      className={`${f.color} p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform`}
                    >
                      <f.icon size={18} />
                    </div>

                    <div>
                      <p className="text-xs font-black text-white uppercase tracking-tight">
                        {f.name}
                      </p>

                      <p className="text-[9px] text-gray-500 font-bold uppercase mt-0.5">
                        {f.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-white/5 flex justify-end">
              <button
                onClick={generarReporte}
                disabled={loading}
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 px-12 rounded-2xl shadow-[0_10px_30px_rgba(250,204,21,0.2)] transition-all active:scale-95 uppercase text-[11px] tracking-[0.2em] disabled:opacity-50 flex items-center gap-3"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    GENERANDO...
                  </>
                ) : (
                  "INICIAR GENERACIÓN"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}