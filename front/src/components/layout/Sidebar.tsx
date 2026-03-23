
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Activity,
  Lightbulb,
  Zap,
  FileText,
  Bell,
  Settings,
  LogOut,

} from "lucide-react"

const menu = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    active: true
  },
  {
    name: "Usuarios",
    icon: Users
  },
  {
    name: "Docentes",
    icon: Users
  },
  {
    name: "Cursos",
    icon: BookOpen
  },
  {
    name: "Salud de la carrera",
    icon: Activity
  },
  {
    name: "Recomendaciones",
    icon: Lightbulb
  },
  {
    name: "Acciones Globales",
    icon: Zap
  },
  {
    name: "Reportes",
    icon: FileText
  },
  {
    name: "Notificaciones",
    icon: Bell,
    badge: 5
  }
]

export default function Sidebar() {

  return (

    <div className="sidebar">



      <div className="p-6 flex items-center gap-3 border-b border-white/10">

        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">

          <img
            src="/logo-url.png"
            alt="Universidad Rafael Landivar"
            className="w-8 h-8 object-contain"
          />

        </div>

        <div>

          <p className="font-semibold">
            Universidad Rafael Landivar
          </p>

          <p className="text-xs text-gray-300">
            Facultad Ingeniería
          </p>

        </div>

      </div>



      <div className="flex-1 px-3 py-4">

        {menu.map((item, index) => {

          const Icon = item.icon

          return (

            <div
              key={index}
              className={`
              sidebar-item
              ${item.active ? "sidebar-active" : ""}
              flex items-center justify-between
              mb-1
              `}
            >

              <div className="flex items-center gap-3">

                <Icon size={18} />

                <span className="text-sm">
                  {item.name}
                </span>

              </div>

              {item.badge && (

                <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full">

                  {item.badge}

                </span>

              )}

            </div>

          )

        })}

      </div>



      <div className="p-4 border-t border-white/10">

        <div className="sidebar-item">

          <Settings size={18} />

          Configuración

        </div>

        <div className="sidebar-item mt-1">

          <LogOut size={18} />

          Cerrar sesión

        </div>

      </div>

    </div>

  )

}