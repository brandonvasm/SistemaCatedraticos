import { useEffect, useState } from "react";
import { dashboardService } from "../../services/dashboardServiceCourse";
import type { DashboardStatsCourses } from "../../types/dashboardCourses";
import { BookOpen, TrendingUp } from "lucide-react";

export default function StatsCards() {
  const [stats, setStats] = useState<DashboardStatsCourses>({
    totalCourses: 0,
    globalAverage: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await dashboardService.getStats();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-10">
      
      <div className="bg-[#1e2230]/60 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 blur-[80px] rounded-full -ml-20 -mt-20 opacity-20 pointer-events-none" />

        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-blue-500/10 text-blue-400">
          <BookOpen size={20} />
        </div>

        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
          Total Cursos
        </p>

        <span className="text-4xl font-bold text-white tracking-tighter">
          {stats.totalCourses}
        </span>
      </div>

      <div className="bg-[#1e2230]/60 border border-white/5 p-6 rounded-2xl backdrop-blur-md shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-40 h-40 bg-yellow-400/10 blur-[80px] rounded-full -ml-20 -mt-20 opacity-20 pointer-events-none" />

        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-yellow-400/10 text-yellow-400">
          <TrendingUp size={20} />
        </div>

        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">
          Promedio Global
        </p>

        <span className="text-4xl font-bold text-yellow-400 tracking-tighter">
          {stats.globalAverage}
        </span>
      </div>

    </div>
  );
}