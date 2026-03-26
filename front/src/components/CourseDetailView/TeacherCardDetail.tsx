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
    <div className="bg-white/5 border border-white/10 p-5 rounded-xl">

      <div className="flex justify-between items-center mb-4">

        <div className="flex items-center gap-3">

          <div className="bg-green-500 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white">
            {t.short}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">

              <p className="font-semibold">{t.name}</p>

              <span className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded-md">
                {t.section}
              </span>

              {t.best && (
                <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-1 rounded-md">
                  Mejor Docente
                </span>
              )}
            </div>

            <p className="text-xs text-gray-400">
              Experiencia: {t.experience} • Fortaleza: {t.strength}
            </p>
          </div>
        </div>

        <div className={`flex items-center gap-1 text-sm ${t.isTrendUp ? "text-green-400" : "text-red-400"}`}>
          {t.isTrendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          +{t.trend}
          <span className="text-xs text-gray-400 ml-1">tendencia</span>
        </div>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">

        <Box icon={<Users size={14} />} label="Estudiantes" value={t.students} />

        <Box icon={<Star size={14} />} label="Calificación" value={t.score} highlight />

        <Box icon={<CheckCircle size={14} />} label="Recomendado" value={`${t.rec}%`} highlight />

        <Box icon={<BarChart3 size={14} />} label="Asistencia" value={`${t.attendance}%`} />

        <Box icon={<MessageSquare size={14} />} label="Comentarios" value={t.comments} />

        <Box icon={<Clock size={14} />} label="Tiempo Respuesta" value={t.response} />

      </div>

      <div className="flex justify-between items-center">

        <span className="text-green-400 text-xs font-medium">
          ● Desempeño Excelente
        </span>

        <button className="bg-blue-500/20 border border-blue-400 text-blue-300 px-4 py-1.5 rounded-lg text-xs hover:bg-blue-400 hover:text-black transition">
          Ver Perfil Completo
        </button>

      </div>
    </div>
  );
}

function Box({ icon, label, value, highlight = false }: any) {
  return (
    <div className="bg-white/5 border border-white/10 p-3 rounded-lg">

      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
        {icon}
        {label}
      </div>

      <p className={`font-bold ${highlight ? "text-green-400" : "text-white"}`}>
        {value}
      </p>

    </div>
  );
}