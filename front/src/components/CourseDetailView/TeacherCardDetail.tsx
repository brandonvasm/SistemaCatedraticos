import {
  TrendingUp,
  TrendingDown,
  Users,
  Star,
  CheckCircle,
  BarChart3,
  MessageSquare,
  Clock,
} from "lucide-react";

type Props = {
  teacher?: any;
};
export default function TeacherCardDetail({ teacher }: Props) {
  const t = teacher || {
    name: "Ing. Luis García",
    short: "ILG",
    section: "Sección A",
    best: true,
    experience: "8 años",
    strength: "Metodologías Ágiles",
    students: 28,
    score: 4.8,
    rec: 96,
    attendance: 98,
    comments: 24,
    response: "Excelente",
    trend: 0.3,
    isTrendUp: true,
  };

  return (
    <div className="
      bg-[#0f111a]/50
      border border-white/10
      p-6
      rounded-[1.8rem]
      backdrop-blur-2xl
      shadow-xl
      hover:border-yellow-400/20
      transition-all duration-300
    ">

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">

        <div className="flex items-center gap-4">

          <div className="
            bg-gradient-to-br from-yellow-400/20 to-yellow-600/5
            border border-yellow-400/20
            text-yellow-400
            w-14 h-14
            rounded-2xl
            flex items-center justify-center
            font-bold
            text-sm
          ">
            {t.short}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">

              <p className="font-bold text-white tracking-tight text-sm">
                {t.name}
              </p>

              <span className="
                bg-purple-500/10
                text-purple-300
                text-[10px]
                px-2 py-1
                rounded-xl
                border border-purple-500/20
                font-semibold
              ">
                {t.section}
              </span>

              {t.best && (
                <span className="
                  bg-yellow-500/10
                  text-yellow-300
                  text-[10px]
                  px-2 py-1
                  rounded-xl
                  border border-yellow-500/20
                  font-semibold
                ">
                  Mejor Docente
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-500 mt-1">
              {t.experience} • {t.strength}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-xl border ${
            t.isTrendUp
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-red-400 bg-red-500/10 border-red-500/20"
          }`}
        >
          {t.isTrendUp ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          {t.trend}
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">

        <Box icon={<Users size={14} />} label="Estudiantes" value={t.students} />

        <Box icon={<Star size={14} />} label="Calificación" value={t.score} highlight />

        <Box icon={<CheckCircle size={14} />} label="Recomendado" value={`${t.rec}%`} highlight />

        <Box icon={<BarChart3 size={14} />} label="Asistencia" value={`${t.attendance}%`} />

        <Box icon={<MessageSquare size={14} />} label="Comentarios" value={t.comments} />

        <Box icon={<Clock size={14} />} label="Respuesta" value={t.response} />

      </div>

      <div className="flex justify-between items-center">

        <span className="text-emerald-400 text-[11px] font-semibold tracking-wide">
          ● Desempeño Excelente
        </span>

        <button className="
          px-4 py-2
          bg-white/5
          border border-white/10
          text-gray-300
          rounded-xl
          text-xs font-semibold
          hover:bg-yellow-400/20
          hover:border-yellow-400/30
          hover:text-yellow-400
          transition-all
          active:scale-95
        ">
          Ver Perfil Completo
        </button>

      </div>
    </div>
  );
}

function Box({ icon, label, value, highlight = false }: any) {
  return (
    <div className="
      bg-white/[0.03]
      border border-white/10
      p-3
      rounded-2xl
      hover:bg-white/[0.06]
      transition-all
    ">

      <div className="flex items-center gap-1 text-gray-500 text-[10px] uppercase tracking-wider mb-1">
        {icon}
        {label}
      </div>

      <p
        className={`font-bold text-sm ${
          highlight ? "text-yellow-400" : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}