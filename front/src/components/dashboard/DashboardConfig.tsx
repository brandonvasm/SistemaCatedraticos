import { Settings2, Eye, EyeOff } from "lucide-react";

interface DashboardConfigProps {
  visible: Record<string, boolean>;
  toggleSection: (section: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const sectionLabels: Record<string, string> = {
  stats: "ESTADÍSTICAS",
  teachers: "TABLERO DOCENTES",
  rankings: "RANKINGS",
  charts: "GRÁFICOS",
  history: "ANÁLISIS HISTÓRICO"
};

export default function DashboardConfig({ visible, toggleSection, isOpen, setIsOpen }: DashboardConfigProps) {
  return (
    <>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-10 right-10 z-[50] p-4 bg-yellow-400 text-black rounded-2xl shadow-2xl hover:scale-110 transition-all active:scale-95 border-none"
      >
        <Settings2 size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-28 right-10 z-[50] w-64 bg-[#0b101f]/95 backdrop-blur-2xl border border-white/10 p-6 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-5">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
            Personalizar Vista
          </h3>
          <div className="space-y-3">
            {Object.keys(visible).map((key) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {sectionLabels[key]}
                </span>
                <button 
                  onClick={() => toggleSection(key)}
                  className={`p-2 rounded-lg transition-colors ${visible[key] ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-600 bg-white/5'}`}
                >
                  {visible[key] ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}