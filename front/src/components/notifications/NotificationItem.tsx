import { AlertTriangle, CheckCircle, X, Trophy } from "lucide-react";

type Props = {
  id: number;
  title: string;
  description: string;
  type: "warning" | "success" | "performance"; 
  onDelete: (id: number) => void;
};

export default function NotificationItem({ id, title, description, type, onDelete }: Props) {
  const getStyles = () => {
    switch (type) {
      case "warning":
        return {
          container: "bg-red-500/10 border-red-500/20 text-red-400",
          icon: <AlertTriangle size={18} />,
          button: "bg-yellow-400 text-black hover:bg-yellow-300"
        };
      case "performance":
        return {
          container: "bg-yellow-400/10 border-yellow-400/20 text-yellow-400",
          icon: <Trophy size={18} />,
          button: "bg-white/10 text-white hover:bg-white/20"
        };
      case "success":
      default:
        return {
          container: "bg-emerald-500/10 border-emerald-500/20 text-emerald-500",
          icon: <CheckCircle size={18} />,
          button: "bg-white/10 text-white hover:bg-white/20"
        };
    }
  };

  const styles = getStyles();

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-5 rounded-2xl flex justify-between items-start gap-4 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 overflow-hidden">
      <div className="flex gap-4 items-start relative z-10">
        <div className={`w-11 h-11 flex items-center justify-center rounded-2xl shrink-0 border shadow-inner ${styles.container}`}>
          {styles.icon}
        </div>

        <div>
          <h3 className="text-[11px] font-black text-white tracking-tight uppercase">{title}</h3>
          <p className="text-[10px] text-gray-400 mt-2 leading-relaxed max-w-md">{description}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 relative z-10">
        {type === "warning" && (
          <button className={`${styles.button} px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md transition-all active:scale-95`}>
            Revisar
          </button>
        )}

        <button
          onClick={() => onDelete(id)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/10 active:scale-95 transition-all"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}