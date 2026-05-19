import { Edit2, Trash2, Shield, Mail, User, Circle, RotateCcw, School } from "lucide-react";
import type { UserData } from "../../types/user";

interface Props {
  users: UserData[];
  loading: boolean;
  onEdit: (user: UserData) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, loading, onEdit, onDelete }: Props) {
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-8 h-8 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin" />
      <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.3em]">Sincronizando Usuarios...</p>
    </div>
  );

  return (
    <div className="w-full rounded-[2.5rem] border border-white/10 bg-[#0f111a]/50 backdrop-blur-2xl shadow-2xl overflow-hidden">
      <style>{`
        .force-scrollbar::-webkit-scrollbar {
          width: 6px !important;
          height: 6px !important;
          display: block !important;
        }
        .force-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02) !important;
          border-radius: 10px !important;
        }
        .force-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 10px !important;
        }
        .force-scrollbar {
          scrollbar-width: thin !important;
          scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.02) !important;
        }
      `}</style>

      <div 
        className="w-full overflow-x-scroll overflow-y-scroll max-h-[500px] force-scrollbar"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <table className="w-full text-left border-collapse min-w-[950px]">
          <thead className="bg-[#121420] text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-white/5 sticky top-0 z-20">
            <tr>
              <th className="px-8 py-6 text-center">Usuario</th>
              <th className="px-8 py-6">Facultad</th>
              <th className="px-8 py-6">Rol</th>
              <th className="px-8 py-6">Estado</th> 
              <th className="px-8 py-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="group hover:bg-white/[0.03] transition-all duration-300">
                
                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 flex items-center justify-center text-yellow-400 border border-yellow-400/20 transition-all flex-shrink-0">
                      <User size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white group-hover:text-yellow-400 transition-colors tracking-tight">
                        {user.username}
                      </div>
                      <div className="text-[10px] text-gray-500 flex items-center gap-1.5 font-medium">
                        <Mail size={12} className="text-gray-700" /> {user.email}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="px-8 py-5 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-300">
                    <School size={14} className="text-yellow-400/50" />
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {user.faculty_name || "N/A"}
                    </span>
                  </div>
                </td>

                <td className="px-8 py-5 whitespace-nowrap">
                  <span className={`text-[9px] font-black uppercase px-3 py-1.5 rounded-xl flex items-center gap-2 w-fit border ${
                    user.role === 'admin' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                  }`}>
                    <Shield size={12} />
                    {user.role}
                  </span>
                </td>

                <td className="px-8 py-5 whitespace-nowrap">
                  {user.is_active ? (
                    <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/5 border border-emerald-500/20 w-fit px-3 py-1.5 rounded-xl shadow-inner">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-wider">Activo</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-red-400 bg-red-500/5 border border-red-500/20 w-fit px-3 py-1.5 rounded-xl opacity-60">
                      <Circle size={8} className="fill-red-500" />
                      <span className="text-[10px] font-black uppercase tracking-wider">Inactivo</span>
                    </div>
                  )}
                </td>

                <td className="px-8 py-5 text-right whitespace-nowrap">
                  <div className="flex justify-end gap-3">
                    <button 
                      onClick={() => onEdit(user)} 
                      className="p-3 bg-white/5 hover:bg-blue-500/20 rounded-2xl text-blue-400 border border-white/5 hover:border-blue-500/30 transition-all active:scale-90"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>

                    {user.is_active === true ? (
                      <button 
                        onClick={() => onDelete(user.id!)} 
                        className="p-3 bg-white/5 hover:bg-red-500/20 rounded-2xl text-red-400 border border-white/5 hover:border-red-500/30 transition-all active:scale-90"
                        title="Desactivar"
                      >
                        <Trash2 size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={() => onDelete(user.id!)} 
                        className="p-3 bg-white/5 hover:bg-emerald-500/20 rounded-2xl text-emerald-400 border border-white/5 hover:border-emerald-500/30 transition-all active:scale-90"
                        title="Reactivar"
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}