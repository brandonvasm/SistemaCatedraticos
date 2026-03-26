import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout"
import { Filters } from "../components/dashboard/Filters";
import { TeachersTable } from "../components/dashboard/TeachersTable";
import { Download } from "lucide-react";



export default function DocentesViews() {
  const [activeFilter, setActiveFilter] = useState("Todos");

  return (
    <DashboardLayout>
      <div className="min-h-screen text-white p-4 md:p-6">

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold">
              Gestión de Docentes
            </h1>

            <p className="text-gray-400 text-sm">
              Evaluación y seguimiento del cuerpo docente
            </p>
          </div>

          <button className="
            flex items-center gap-2
            px-4 py-2 rounded-lg font-medium w-fit
            bg-yellow-400
            text-black
            border border-yellow-500
            hover:bg-yellow-500
            transition
            shadow-lg
          ">
            <Download size={16} />
            Exportar
          </button>

        </div>

        <Filters active={activeFilter} setActive={setActiveFilter} />

        <TeachersTable filter={activeFilter} />

      </div>
    </DashboardLayout>
  );
}