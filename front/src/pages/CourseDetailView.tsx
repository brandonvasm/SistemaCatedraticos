import CourseHeader from "../components/CourseDetailView/CourseHeader";
import CourseStats from "../components/CourseDetailView/CourseStats";
import CourseCharts from "../components/CourseDetailView/CourseCharts";
import TeachersList from "../components/CourseDetailView/TeachersList";


export default function CourseDetailView() {
  return (
      <div className="min-h-screen w-full px-6 py-6 text-white">
        <div className="max-w-7xl mx-auto space-y-6">

          <CourseHeader />

          <CourseStats />

          <CourseCharts />

          <TeachersList />

        </div>
      </div>

  );
}