import GlobalHeader from "../components/globalActions/GlobalHeader";
import ReportCard from "../components/globalActions/ReportCard";
import CategoryDecisions from "../components/globalActions/CategoryCard";
import MassOperations from "../components/globalActions/MassOperations";

export default function GlobalActionsView() {
	return (
    <div className="relative z-0 space-y-10 animate-in fade-in duration-700">

			<GlobalHeader />

			<div className="mb-6">
				<ReportCard />
			</div>
			<CategoryDecisions />
			<MassOperations />

		</div>
	);
}