import Card from "../ui/Card"
import type { Teacher } from "../../types/teacher"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function TeacherCard({ teacher }: { teacher: Teacher }) {
  const isLow = teacher.score < 3.5;

  return (
    <Card className="hover:bg-white/5 transition-all duration-300 group cursor-pointer">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-200 group-hover:text-white transition-colors">{teacher.name}</h3>
          <p className="text-[11px] text-gray-500">{teacher.students} estudiantes</p>
        </div>
        <div className={teacher.isTrendUp ? "text-success" : "text-danger"}>
          {teacher.isTrendUp ? <TrendingUp size={16}/> : <TrendingDown size={16}/>}
        </div>
      </div>

      <div className="flex gap-0.5 mt-3">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xs ${i < 4 ? "text-accent" : "text-gray-700"}`}>★</span>
        ))}
      </div>

      <div className="mt-6 flex justify-between items-end">
        <span className="text-[10px] text-gray-500 font-bold uppercase">{teacher.courses} cursos</span>
        <div className="text-right">
          <span className={`text-3xl font-bold tracking-tighter block leading-none ${isLow ? 'text-danger' : 'text-success'}`}>
            {teacher.score.toFixed(1)}
          </span>
          <span className={`text-[10px] font-bold ${teacher.isTrendUp ? 'text-success' : 'text-danger'}`}>
            {teacher.trend}
          </span>
        </div>
      </div>
    </Card>
  )
}