import { useState } from "react";
import { Bell, Download, Search } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import ExportModal from "../common/ExportModal";
import NotificationsDrawer from "../notifications/NotificationsDrawer";

export default function Navbar() {
  const { user } = useAuth();
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 right-0 left-64 h-24 flex items-center justify-between px-10 bg-transparent z-[40]">
        
        <div className="flex-1 flex justify-center max-w-xl">
          <div className="relative w-full group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
            <input
              type="text"
              placeholder="BUSCAR DOCENTE, CURSO O SECCIÓN..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-[1.5rem] pl-14 pr-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.15em] outline-none focus:border-yellow-400/20 transition-all text-white backdrop-blur-md shadow-2xl"
            />
          </div>
        </div>

        <div className="flex items-center gap-8">

          <button 
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all active:scale-95 shadow-xl shadow-yellow-400/10"
          >
            <Download size={14} /> EXPORTAR
          </button>

          <div
            onClick={() => setIsNotificationsOpen(true)}
            className="relative cursor-pointer group p-2"
          >
            <Bell size={22} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0b101f]" />
          </div>

          <div className="flex items-center gap-4 pl-8 border-l border-white/5">
            <div className="text-right">
              <p className="text-white text-[11px] font-bold tracking-tight leading-none">
                {user?.username || "Usuario"}
              </p>
              <p className="text-yellow-400/70 text-[9px] uppercase font-bold tracking-[0.2em] mt-1.5">
                {user?.role || "Personal"}
              </p>
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 text-black flex items-center justify-center font-black text-sm shadow-xl uppercase">
              {(user?.username || "UR").substring(0, 2)}
            </div>
          </div>
        </div>
      </nav>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}