import GlobalHeader from "../components/globalActions/GlobalHeader";
import ReportCard from "../components/globalActions/ReportCard";
import CategoryDecisions from "../components/globalActions/CategoryCard";
import MassOperations from "../components/globalActions/MassOperations";

export default function GlobalActionsView() {
	return (
		<div className="min-h-screen bg-[#0b1324] text-white p-6">

			<GlobalHeader />

			<div className="mb-6">
				<ReportCard />
			</div>
			<CategoryDecisions />
			<MassOperations />

		</div>
	);
}