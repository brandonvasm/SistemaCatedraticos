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
    <div className="bg-[#0f111a]/50 border border-white/10 p-5 rounded-2xl backdrop-blur-2xl shadow-xl">

      <div className="flex justify-between items-center mb-5 flex-wrap gap-3">

        <div className="flex items-center gap-4">

          <div className="bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 w-12 h-12 rounded-xl flex items-center justify-center font-bold">
            {t.short}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">

              <p className="font-bold text-white tracking-tight">
                {t.name}
              </p>

              <span className="bg-purple-500/10 text-purple-300 text-[10px] px-2 py-1 rounded-lg border border-purple-500/20">
                {t.section}
              </span>

              {t.best && (
                <span className="bg-yellow-500/10 text-yellow-300 text-[10px] px-2 py-1 rounded-lg border border-yellow-500/20">
                  Mejor Docente
                </span>
              )}
            </div>

            <p className="text-[11px] text-gray-500">
              {t.experience} • {t.strength}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 text-sm font-semibold ${
            t.isTrendUp ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {t.isTrendUp ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          {t.trend}
          <span className="text-[10px] text-gray-500 ml-1 uppercase tracking-wider">
            tendencia
          </span>
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-5">

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

        <button className="bg-white/5 border border-white/10 text-gray-300 px-4 py-1.5 rounded-lg text-xs hover:bg-blue-500/20 hover:border-blue-500/30 hover:text-blue-300 transition-all">
          Ver Perfil Completo
        </button>

      </div>
    </div>
  );
}

function Box({ icon, label, value, highlight = false }: any) {
  return (
    <div className="bg-white/[0.03] border border-white/10 p-3 rounded-xl hover:bg-white/[0.06] transition-all">

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