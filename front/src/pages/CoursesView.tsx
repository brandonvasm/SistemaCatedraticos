import Header from "../components/courses/Header";
import StatsCards from "../components/courses/StatsCards";
import CoursesChart from "../components/courses/CoursesChart";
import CoursesTable from "../components/courses/CoursesTable";

export default function CoursesView() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Header />
      <StatsCards />
      <CoursesChart />
      <CoursesTable />
    </div>
  );
}