import LineChartCourse from "./LineChartCourse";
import BarChartTeachers from "./BarChartTeachers";

interface CourseChartsProps {
  courseId?: string;
}

export default function CourseCharts({ courseId }: CourseChartsProps) {
  if (!courseId) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-white/[0.02] border border-white/5 rounded-[2.5rem] animate-pulse">
        <p className="text-gray-500 font-black uppercase tracking-[0.4em] text-xs">
          Cargando análisis...
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      
      <div className="grid lg:grid-cols-2 gap-6">

        <LineChartCourse courseId={courseId} />
        <BarChartTeachers courseId={courseId} />
      </div>

     

    </div>
  );
}