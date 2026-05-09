import Header from "../components/courses/Header";
import StatsCards from "../components/courses/StatsCards";
import CoursesChart from "../components/courses/CoursesChart";
import CoursesTable from "../components/courses/CoursesTable";
import { useState, useEffect } from "react";
import CourseBarChart from "../components/dashboard/courses/CourseBarChart";
import { useAuth } from "../context/AuthContext";
import { courseService } from "../services/courseService";

export default function CoursesView() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const facultyId = user?.faculty_id;
  const semesterId = user?.semester_id;

  useEffect(() => {
    const fetchCoursesData = async () => {
      if (facultyId && semesterId) {
        try {
          setLoading(true);
          const data = await courseService.getTopCourses(facultyId, semesterId);
          setCourses(data || []);
        } catch (err) {
          console.error("Error al cargar cursos en la vista:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchCoursesData();
  }, [facultyId, semesterId]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Header />
      
      <StatsCards  />

      <div className="bg-[#11141d]/50 border border-white/5 p-0 rounded-[2.5rem] overflow-hidden min-h-[300px] flex items-center justify-center relative">
        {loading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin" />
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cargando gráfico...</span>
          </div>
        ) : (
          <div className="w-full h-full animate-in fade-in duration-700">
            <CourseBarChart courses={courses} />
          </div>
        )}
      </div>

      <div className="min-h-[250px] flex items-center justify-center relative">
        {loading ? (
          <div className="w-full h-full bg-[#11141d]/30 border border-white/5 rounded-[2.5rem] flex items-center justify-center">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Cargando analítica...</span>
          </div>
        ) : (
          <div className="w-full animate-in fade-in duration-700">
            <CoursesChart />
          </div>
        )}
      </div>

      <div className={loading ? "opacity-50 pointer-events-none" : "animate-in fade-in duration-700"}>
        <CoursesTable  />
      </div>
    </div>
  );
}