import { useState, useEffect, useCallback } from "react";
import UserTable from "../components/users/UserTable";
import UserModal from "../components/users/UserModal";
import ConfirmModal from "../components/common/ConfirmModal";
import { userService } from "../services/userService";
import type { UserData } from "../types/user";
import { UserPlus, Search, RefreshCcw } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [userToDisable, setUserToDisable] = useState<number | null>(null);
  const [isDisabling, setIsDisabling] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("Todos");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getUsers(search, roleFilter);
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter]); 

  useEffect(() => {
    const handler = setTimeout(() => {
      loadData();
    }, 300); 
    return () => clearTimeout(handler); 
  }, [search, roleFilter, loadData]);

  const handleDeleteClick = (id: number) => {
    setUserToDisable(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDisable = async () => {
    if (!userToDisable) return;
    setIsDisabling(true);
    try {
      await userService.deleteUser(userToDisable);
      await loadData();
      setIsConfirmOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDisabling(false);
      setUserToDisable(null);
    }
  };

  const handleEdit = (user: UserData) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Administración de personal y control de accesos al sistema.
          </p>
        </div>
        <button 
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          className="bg-yellow-400 hover:bg-yellow-500 text-black px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-xl shadow-yellow-400/10 transition-all active:scale-95 text-sm uppercase tracking-widest"
        >
          <UserPlus size={20}/> Nuevo Usuario
        </button>
      </header>


      <div className="flex flex-col lg:flex-row gap-4 bg-white/[0.01] p-4 rounded-[2.5rem] border border-white/5 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
        
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        <div className="flex-1 relative z-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={20}/>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nombre o correo..." 
            className="w-full bg-black/20 border border-white/5 rounded-2xl pl-14 pr-6 py-4 text-white outline-none focus:border-yellow-400/30 transition-all placeholder:text-gray-700 backdrop-blur-sm"
          />
        </div>
        
        <select 
          value={roleFilter} 
          onChange={e => setRoleFilter(e.target.value)}
          className="bg-black/20 border border-white/5 rounded-2xl px-8 py-4 text-gray-400 outline-none cursor-pointer hover:border-yellow-400/20 transition-all appearance-none backdrop-blur-sm z-10"
        >
          <option value="Todos" className="bg-[#0b101f] text-gray-300">Todos los roles</option>
          <option value="admin" className="bg-[#0b101f] text-gray-300">Administradores</option>
          <option value="coordinator" className="bg-[#0b101f] text-gray-300">Coordinadores</option>
        </select>

        <button 
          onClick={loadData} 
          className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-gray-600 hover:text-white transition-all z-10 backdrop-blur-sm border border-white/5"
          title="Refrescar datos"
        >
          <RefreshCcw size={20} className={`${loading ? "animate-spin text-yellow-400" : ""}`}/>
        </button>
      </div>

      <div className="bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-2xl shadow-2xl relative">
        
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        
        <UserTable 
          users={users} 
          loading={loading} 
          onEdit={handleEdit}
          onDelete={handleDeleteClick} 
        />
      </div>

      <UserModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }} 
        onSuccess={loadData} 
        selectedUser={selectedUser}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDisable}
        loading={isDisabling}
        title="¿Desactivar Usuario?"
        message="Esta acción revocará el acceso del usuario al sistema de forma inmediata. Podrás reactivarlo editando su perfil más adelante."
      />
    </div>
  );
}