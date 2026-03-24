import LineChartCourse from "./LineChartCourse";
import BarChartTeachers from "./BarChartTeachers";
import RadarChartTeachers from "./RadarChartTeachers";

export default function CourseCharts() {
  return (
    <div className="grid gap-6">

      <div className="grid lg:grid-cols-2 gap-6">
        <LineChartCourse />
        <BarChartTeachers />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <RadarChartTeachers />
        </div>
      </div>

    </div>
  );
}