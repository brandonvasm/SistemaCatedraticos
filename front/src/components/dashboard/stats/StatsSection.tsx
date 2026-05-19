import { useEffect } from "react";
import { Users, Trophy, AlertTriangle, TrendingUp } from "lucide-react"
import StatCard from "../../ui/StatCard"
import type { TeacherStats } from "../../../types/teacher";
import { notificationService } from "../../../services/notificationService";
import { useAuth } from "../../../context/AuthContext";

interface StatsSectionProps {
  teachers: TeacherStats[];
  facultyName?: string;
}

export default function StatsSection({ teachers, facultyName }: StatsSectionProps) {
  const { user } = useAuth();

  const totalTeachers = teachers.length;
  const evaluatedTeachers = teachers.filter(t => t.promedio_general > 0);

  const averageScore = evaluatedTeachers.length > 0
    ? (evaluatedTeachers.reduce((acc, t) => acc + t.promedio_general, 0) / evaluatedTeachers.length).toFixed(1)
    : "0.0";

  const highPerformance = teachers.filter(t => t.promedio_general >= 85).length;
  const needsAttention = teachers.filter(t => t.promedio_general > 0 && t.promedio_general < 70).length;

  useEffect(() => {
    if (!user?.id || teachers.length === 0) return;

    const triggerNotifications = async () => {
      const storageKey = `stats_notif_${facultyName || 'general'}`;
      
      const savedStats = localStorage.getItem(storageKey);
      const { lastHigh, lastLow } = savedStats ? JSON.parse(savedStats) : { lastHigh: null, lastLow: null };

      let dataChanged = false;
      const newStorageData = { lastHigh, lastLow };

      if (highPerformance > 0 && highPerformance !== lastHigh) {
        try {
          await notificationService.createNotification({
            subject: "Excelencia Docente Detectada",
            message: `Hay ${highPerformance} docentes con desempeño superior a 85 en ${facultyName || 'la facultad'}.`,
            focus: "Rendimiento",
            type: "success",
            user: user.id
          });
          newStorageData.lastHigh = highPerformance;
          dataChanged = true;
        } catch (e) { console.error(e); }
      }

      if (needsAttention > 0 && needsAttention !== lastLow) {
        try {
          await notificationService.createNotification({
            subject: "Alerta de Desempeño",
            message: `Atención: ${needsAttention} docentes tienen promedio bajo en ${facultyName || 'la facultad'}.`,
            focus: "Evaluación",
            type: "warning",
            user: user.id
          });
          newStorageData.lastLow = needsAttention;
          dataChanged = true;
        } catch (e) { console.error(e); }
      }

      if (dataChanged) {
        localStorage.setItem(storageKey, JSON.stringify(newStorageData));
      }
    };

    triggerNotifications();
    
  }, [highPerformance, needsAttention, user?.id, facultyName, teachers.length]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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