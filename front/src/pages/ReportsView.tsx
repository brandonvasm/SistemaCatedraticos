import { useState } from "react";

import ReportsHeader from "../components/reports/ReportsHeader";
import QuickReports from "../components/reports/QuickReports";
import ReportFilters from "../components/reports/ReportFilters";
import ReportsList from "../components/reports/ReportsList";
import ExportOptions from "../components/reports/ExportOptions";

export default function ReportsView() {
  const [filter, setFilter] = useState("general");

  return (
    <div className="relative z-0 space-y-10 animate-in fade-in duration-700">

      <ReportsHeader />

      <QuickReports />

      <ReportFilters filter={filter} setFilter={setFilter} />

      <ReportsList filter={filter} />

      <ExportOptions />

    </div>
  );
}