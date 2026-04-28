import { Users, Trophy, AlertTriangle, TrendingUp } from "lucide-react"
import StatCard from "../../ui/StatCard"
import type { TeacherStats } from "../../../types/teacher";

interface StatsSectionProps {
  teachers: TeacherStats[];
  facultyName?: string;
}

export default function StatsSection({ teachers, facultyName }: StatsSectionProps) {
  const totalTeachers = teachers.length;

  const evaluatedTeachers = teachers.filter(t => t.promedio_general > 0);

  const averageScore = evaluatedTeachers.length > 0
    ? (evaluatedTeachers.reduce((acc, t) => acc + t.promedio_general, 0) / evaluatedTeachers.length).toFixed(1)
    : "0.0";

  const highPerformance = teachers.filter(t => t.promedio_general >= 85).length;

  const needsAttention = teachers.filter(t => t.promedio_general > 0 && t.promedio_general < 70).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        title="Total Docentes" 
        value={totalTeachers.toString()} 
        description={facultyName || "Facultad"} 
        icon={<Users size={20} className="text-yellow-400" />} 
      />
      
      <StatCard 
        title="Promedio General" 
        value={averageScore} 
        description={`De ${teachers.length} docentes`}
        icon={<TrendingUp size={20} className="text-yellow-400" />} 
      />
      
      <StatCard 
        title="Sobre 85 Puntos" 
        value={highPerformance.toString()} 
        description="Excelente desempeño" 
        icon={<Trophy size={20} className="text-yellow-400" />} 
      />
      
      <StatCard 
        title="Bajo Desempeño" 
        value={needsAttention.toString()} 
        description="Promedio < 70" 
        icon={<AlertTriangle size={20} className="text-yellow-400" />} 
      />
    </div>
  )
}