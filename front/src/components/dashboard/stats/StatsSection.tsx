import { Users, Trophy, AlertTriangle, TrendingUp } from "lucide-react"
import StatCard from "../../ui/StatCard"

export default function StatsSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard title="Total Docentes" value="12" description="Facultad de Ingeniería" icon={<Users size={20}/>} />
      <StatCard title="Promedio General" value="4.1" description="De 5.0 posibles" icon={<TrendingUp size={20}/>} />
      <StatCard title="Sobre 80%" value="9" description="Excelente desempeño" icon={<Trophy size={20}/>} />
      <StatCard title="Requieren Atención" value="1" description="Promedio < 3.5" icon={<AlertTriangle size={20}/>} />
    </div>
  )
}