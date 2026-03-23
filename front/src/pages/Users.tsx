import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import UserTable from "../components/users/UserTable";
import UserModal from "../components/users/UserModal";
import { userService } from "../services/userService";
import type { UserData } from "../types/user";
import { UserPlus, Search, RefreshCcw } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await userService.getUsers(search, roleFilter);
    setUsers(data);
    setLoading(false);
  }, [search, roleFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar usuario?")) {
      await userService.deleteUser(id);
      loadData();
    }
  };

  return (
    <DashboardLayout>
      <div className="p-10 max-w-7xl mx-auto space-y-10">
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter">Usuarios</h1>
            <p className="text-gray-500 font-medium mt-2">Personal administrativo y coordinadores.</p>
          </div>
          <button 
            onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
            className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-yellow-400/20 transition-all active:scale-95"
          >
            <UserPlus size={22}/> NUEVO REGISTRO
          </button>
        </header>

        {/* Filtros */}
        <div className="flex gap-4 bg-white/5 p-4 rounded-[2rem] border border-white/10 backdrop-blur-md">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20}/>
            <input 
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por nombre..." 
              className="w-full bg-black/40 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:border-yellow-400/30 transition-all"
            />
          </div>
          <select 
            value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="bg-black/40 border border-white/5 rounded-2xl px-8 py-4 text-gray-300 outline-none cursor-pointer hover:border-white/20 transition-all"
          >
            <option value="Todos">Todos los roles</option>
            <option value="admin">Administradores</option>
            <option value="coordinator">Coordinadores</option>
          </select>
          <button onClick={loadData} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-500 hover:text-white transition-all">
            <RefreshCcw size={20}/>
          </button>
        </div>

        <UserTable 
          users={users} 
          loading={loading} 
          onEdit={(user) => { setSelectedUser(user); setIsModalOpen(true); }}
          onDelete={handleDelete}
        />

        <UserModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={loadData} 
          selectedUser={selectedUser}
        />
      </div>
    </DashboardLayout>
  );
}