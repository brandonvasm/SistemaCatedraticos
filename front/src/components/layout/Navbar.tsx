import { useState } from "react";
import { Bell, Download, Search, School } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ExportModal from "../common/ExportModal";
import NotificationsDrawer from "../notifications/NotificationsDrawer";

export default function Navbar() {
  const { user } = useAuth();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const currentFacultad = localStorage.getItem("currentFacultad") || localStorage.getItem("pendingFacultad") || "DASHBOARD GENERAL";

  const userRole = localStorage.getItem("user_role")?.toLowerCase().trim();

  return (
    <>
      <nav className="fixed top-0 right-0 left-64 h-20 flex items-center justify-between px-10 bg-transparent border-b border-white/5 z-[40]">
        
        <div className="flex-1 flex justify-center max-w-xl">
          <div className="relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors" size={16} />
            <input
              type="text"
              placeholder="BUSCAR DOCENTE, CURSO O SECCIÓN..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] outline-none focus:border-yellow-400/20 transition-all text-white backdrop-blur-md"
            />
          </div>
        </div>

        <div className="flex items-center gap-6">
          
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-xl shadow-xl">
            <School size={12} className="text-yellow-400" />
            <span>{currentFacultad}</span>
          </div>

          <button 
            onClick={() => setIsExportOpen(true)} 
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-400/10 border-none"
          >
            <Download size={12} /> EXPORTAR
          </button>

          <div onClick={() => setIsNotificationsOpen(true)} className="relative cursor-pointer group p-1.5">
            <Bell size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0b101f]" />
          </div>
          
          <div className="flex items-center gap-3 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-white text-[10px] font-bold tracking-tight leading-none uppercase">
                {user?.username || "Usuario"}
              </p>
              <p className="text-yellow-400/70 text-[8px] uppercase font-bold tracking-[0.2em] mt-1">
                {userRole || "Personal"}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-300 to-yellow-600 text-black flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-yellow-500/10">
              {(user?.username || "UR").substring(0, 2)}
            </div>
          </div>
        </div>
      </nav>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
    </>
  );
}