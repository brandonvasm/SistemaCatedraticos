import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { logoutUser } from "../../services/authService"; 
import { notificationService } from "../../services/notificationService";

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
  FolderClock,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotificationCount = async () => {
    try {
      const data = await notificationService.getNotifications();
      if (data.length !== notificationCount) {
        setNotificationCount(data.length);
      }
    } catch (error) {
      console.error("Error al sincronizar notificaciones:", error);
    }
  };

  useEffect(() => {
    fetchNotificationCount();

    const interval = setInterval(() => {
      fetchNotificationCount();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const menu = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard"
    },
    {
      name: "Usuarios",
      icon: Users,
      path: "/usuarios" 
    },
    {
      name: "Docentes",
      icon: Users,
      path: "/docentes"
    },
    {
      name: "Cursos",
      icon: BookOpen,
      path: "/cursos" 
    },
    {
      name: "Salud de la Facultad",
      icon: Activity,
      path: "/salud" 
    },
    {
      name: "Recomendaciones",
      icon: Lightbulb,
      path: "/recomendaciones" 
    },
    {
      name: "Acciones Globales",
      icon: Zap,
      path: "/acciones" 
    },
    {
      name: "Historial de Datos", 
      icon: FolderClock,
      path: "/historial" 
    },
    {
      name: "Reportes",
      icon: FileText,
      path: "/reportes" 
    },
    {
      name: "Notificaciones",
      icon: Bell,
      badge: notificationCount, 
      path: "/notificaciones"
    },
  ];

  const userRole = localStorage.getItem("user_role")?.toLowerCase().trim();

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate("/"); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      localStorage.clear();
      navigate("/");
    }
  };

  const filteredMenu = menu.filter(item => {
    if (item.name === "Usuarios") {
      return userRole === "admin";
    }
    return true;
  });

  return (
    <div className="sidebar fixed top-0 left-0 h-screen w-64 z-50 flex flex-col">
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center overflow-hidden">
          <img
            src="/logo-url.png"
            alt="Universidad Rafael Landivar"
            className="w-8 h-8 object-contain"
          />
        </div>
        <div>
          <p className="font-semibold text-sm">Universidad Rafael Landivar</p>
        </div>
      </div>

      <div className="flex-1 px-3 py-4">
        {filteredMenu.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <div
              key={index}
              onClick={() => navigate(item.path)} 
              className={`
                sidebar-item
                ${isActive ? "sidebar-active" : ""}
                flex items-center justify-between
                mb-1 cursor-pointer
              `}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} />
                <span className="text-sm">{item.name}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-red-500 text-xs px-2 py-0.5 rounded-full text-white">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-white/10">
        <div 
          className={`sidebar-item cursor-pointer ${location.pathname === "/configuracion" ? "sidebar-active" : ""}`} 
          onClick={() => navigate("/configuracion")} 
        >
          <Settings size={18} />
          <span className="text-sm">Configuración</span>
        </div>

        <div 
          className="sidebar-item mt-1 cursor-pointer" 
          onClick={handleLogout}
        >
          <LogOut size={18} />
          <span className="text-sm">Cerrar sesión</span>
        </div>
      </div>
    </div>
  );
}