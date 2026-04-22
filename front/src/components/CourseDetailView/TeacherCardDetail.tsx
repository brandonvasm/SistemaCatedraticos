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
    <div
      className="
        group relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[1.8rem]
        backdrop-blur-2xl
        shadow-xl
        overflow-hidden
      "
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

      <div className="flex justify-between items-center mb-6 flex-wrap gap-4 relative z-10">
        <div className="flex items-center gap-4">
          <div
            className="
              bg-yellow-400/10
              border border-yellow-400/20
              text-yellow-400
              w-14 h-14
              rounded-2xl
              flex items-center justify-center
              font-black
              text-sm
              shadow-lg shadow-yellow-400/10
            "
          >
            {t.short}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-black text-white tracking-tight text-sm uppercase">
                {t.name}
              </p>

              <span
                className="
                  bg-white/5
                  text-gray-300
                  text-[10px]
                  px-2 py-1
                  rounded-xl
                  border border-white/10
                  font-bold uppercase
                "
              >
                {t.section}
              </span>

              {t.best && (
                <span
                  className="
                    bg-yellow-400/10
                    text-yellow-400
                    text-[10px]
                    px-2 py-1
                    rounded-xl
                    border border-yellow-400/20
                    font-bold uppercase
                  "
                >
                  Mejor Docente
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-500 mt-1 uppercase tracking-wider">
              {t.experience} · {t.strength}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 text-[11px] font-black px-3 py-1 rounded-xl border ${
            t.isTrendUp
              ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
              : "text-red-400 bg-red-500/10 border-red-500/20"
          }`}
        >
          {t.isTrendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {t.trend}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6 relative z-10">
        <Box icon={<Users size={14} />} label="Estudiantes" value={t.students} />

        <Box icon={<Star size={14} />} label="Calificación" value={t.score} highlight />

        <Box icon={<CheckCircle size={14} />} label="Recomendado" value={`${t.rec}%`} highlight />

        <Box icon={<BarChart3 size={14} />} label="Asistencia" value={`${t.attendance}%`} />

        <Box icon={<MessageSquare size={14} />} label="Comentarios" value={t.comments} />

        <Box icon={<Clock size={14} />} label="Respuesta" value={t.response} />
      </div>

      <div className="flex justify-between items-center relative z-10">
        <span className="text-emerald-400 text-[11px] font-black uppercase tracking-wider">
          ● Desempeño Excelente
        </span>

        <button
          className="
            px-4 py-2
            bg-white/5
            border border-white/10
            text-gray-300
            rounded-xl
            text-[10px]
            font-black
            uppercase
            tracking-widest
            hover:bg-yellow-400/20
            hover:border-yellow-400/30
            hover:text-yellow-400
            transition-all
            active:scale-95
          "
        >
          Ver Perfil Completo
        </button>
      </div>
    </div>
  );
}

function Box({ icon, label, value, highlight = false }: any) {
  return (
    <div
      className="
        bg-white/[0.03]
        border border-white/5
        p-3
        rounded-2xl
        hover:bg-white/[0.06]
        transition-all
      "
    >
      <div className="flex items-center gap-1 text-gray-500 text-[9px] font-black uppercase tracking-widest mb-1">
        {icon}
        {label}
      </div>

      <p
        className={`font-black text-sm ${
          highlight ? "text-yellow-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}