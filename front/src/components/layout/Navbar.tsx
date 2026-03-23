import { Bell, Download } from "lucide-react"

export default function Navbar() {

	return (

		<div className="h-16 flex items-center justify-between px-8 border-b border-white/10">



			<input
				type="text"
				placeholder="Buscar docente, curso, o sección..."
				className="
				w-96
				bg-white/5
				border border-white/10
				rounded-xl
				px-4 py-2
				text-sm
				outline-none
				"
			/>



			<div className="flex items-center gap-4">

				<div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm">
					Facultad de Ingenieria
				</div>

				<div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm">
					Semestre I - 2026
				</div>

				<button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm">

					<Download size={16} />

					Exportar

				</button>

				<div className="relative">

					<Bell />

					<span className="absolute -top-2 -right-2 bg-red-500 w-2 h-2 rounded-full" />

				</div>

				<div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center font-semibold">

					AS

				</div>

			</div>

		</div>

	)

}