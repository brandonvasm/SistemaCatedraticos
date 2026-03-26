import Header from "../components/courses/Header";
import StatsCards from "../components/courses/StatsCards";
import CoursesChart from "../components/courses/CoursesChart";
import CoursesTable from "../components/courses/CoursesTable";
import DashboardLayout from "../components/layout/DashboardLayout";

export default function CoursesView() {
  return (
    <DashboardLayout>
      <div className="min-h-screen w-full px-6 py-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header />
          <StatsCards />
          <CoursesChart />
          <CoursesTable />
        </div>
      </div>
    </DashboardLayout>
  );
}