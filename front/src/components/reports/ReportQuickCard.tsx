import { Download } from "lucide-react";

type Props = {
	icon: React.ReactNode;
	title: string;
	desc: string;
	color: string;
};

export default function ReportQuickCard({
	icon,
	title,
	desc,
	color,
}: Props) {
	return (
		<div className="bg-[#1c2746] p-5 rounded-xl border border-slate-700">

			<div className={`w-fit p-3 rounded-xl mb-4 ${color}`}>
				{icon}
			</div>

			<h3 className="font-semibold">{title}</h3>
			<p className="text-sm text-gray-400 mb-4">{desc}</p>

			<button className="w-full bg-white/5 hover:bg-white/10 py-2 rounded-lg text-sm flex items-center justify-center gap-2">
				<Download size={16} />
				Descargar
			</button>
		</div>
	);
}