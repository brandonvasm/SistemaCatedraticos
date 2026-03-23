import { Edit2, Trash2, Shield, Mail, User } from "lucide-react";
import type { UserData } from "../../types/user";

interface Props {
  users: UserData[];
  loading: boolean;
  onEdit: (user: UserData) => void;
  onDelete: (id: number) => void;
}

export default function UserTable({ users, loading, onEdit, onDelete }: Props) {
  if (loading) return <div className="text-center py-10 text-gray-400">Cargando usuarios...</div>;

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-white/10 bg-[#11141d]/50 backdrop-blur-xl shadow-2xl">
      <table className="w-full text-left">
        <thead className="bg-white/5 text-gray-500 text-[10px] font-black uppercase tracking-widest">
          <tr>
            <th className="px-8 py-5">Identidad</th>
            <th className="px-8 py-5">Rol</th>
            <th className="px-8 py-5 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
              <td className="px-8 py-5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-yellow-400/10 flex items-center justify-center text-yellow-400 font-bold border border-yellow-400/20">
                    <User size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{user.username}</div>
                    <div className="text-[10px] text-gray-500 flex items-center gap-1">
                      <Mail size={10} /> {user.email}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-5">
                <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${
                  user.role === 'admin' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'
                }`}>
                  <Shield size={10} className="inline mr-1" />
                  {user.role}
                </span>
              </td>
              <td className="px-8 py-5 text-right">
                <div className="flex justify-end gap-2">
                  <button onClick={() => onEdit(user)} className="p-2 hover:bg-blue-500/10 rounded-lg text-blue-400 transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => onDelete(user.id!)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400 transition-colors"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}