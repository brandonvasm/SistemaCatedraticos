import { User, Target} from "lucide-react";

export const RecomendacionDetalleCard = ({ titulo, tipo }: { titulo: string, tipo: 'curso' | 'docente' }) => {
  const Icono = tipo === 'docente' ? User : Target;

  return (
    <div className="glass-card group p-6 flex gap-6 items-start hover:bg-white/10 transition-all duration-500 rounded-[2rem]">
      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:border-yellow-400/40 transition-colors">
        <Icono size={22} className={tipo === 'docente' ? "text-yellow-400" : "text-blue-400"} />
      </div>
      <div className="space-y-2">
        <h4 className="text-white font-black text-xs tracking-wider">{titulo}</h4>

      </div>
    </div>
  );
};