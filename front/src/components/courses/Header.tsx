import { Download } from "lucide-react";

export default function Header() {
  return (
    <div className="flex justify-between items-center mb-6">

      <div>
        <h1 className="text-5xl font-black text-white tracking-tighter ">Gestion de Cursos</h1>
        <p className="text-gray-400 text-sm">
          Análisis detallado por materia y sección
        </p>
      </div>

      <button className="
        flex items-center gap-2
        bg-yellow-400
        text-black
        px-4 py-2
        rounded-lg
        font-medium
        hover:bg-yellow-300
        transition
      ">
        <Download size={16} />
        Exportar
      </button>

    </div>
  );
}