import GlobalHeader from "../components/globalActions/GlobalHeader";
import ReportCard from "../components/globalActions/ReportCard";
import CategoryDecisions from "../components/globalActions/CategoryDecisions";
import MassOperations from "../components/globalActions/MassOperations";

import { useAuth } from "../context/AuthContext";

export default function GlobalActionsView() {
  const { user } = useAuth();

  const facultyId = user?.faculty_id;

  return (
    <div className="relative z-0 space-y-10 animate-in fade-in duration-700">

      <GlobalHeader />

      <div className="mb-6">
        <ReportCard />
      </div>

      {facultyId ? (
        <CategoryDecisions facultyId={facultyId} />
      ) : (
        <div className="text-gray-500 text-center py-10">
          Cargando facultad...
        </div>
      )}

      <MassOperations />

    </div>
  );
}