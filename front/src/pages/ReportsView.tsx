import ReportsHeader from "../components/reports/ReportsHeader";
import QuickReports from "../components/reports/QuickReports";
import CustomReport from "../components/reports/CustomReport";
import ReportFilters from "../components/reports/ReportFilters";
import ReportsList from "../components/reports/ReportsList";
import ExportOptions from "../components/reports/ExportOptions";

export default function ReportsView() {
  return (
    <div className="min-h-screen bg-[#0b1324] text-white p-6">

      <ReportsHeader />

      <QuickReports />

      <CustomReport />

      <ReportFilters />

      <ReportsList />

      <ExportOptions />

    </div>
  );
}