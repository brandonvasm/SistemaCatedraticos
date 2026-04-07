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
      
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            GESTIÓN DE USUARIOS
          </h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
            ADMINISTRACIÓN DE PERSONAL · CONTROL DE ACCESOS
          </p>
        </div>
        <button 
          onClick={() => { setSelectedUser(null); setIsModalOpen(true); }}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-yellow-400/10 text-[11px] uppercase tracking-widest shrink-0"
        >
          <UserPlus size={18}/> <span>Nuevo Usuario</span>
        </button>
      </header>

      <div className="glass-card p-2 flex flex-col lg:flex-row gap-2 relative overflow-hidden group border-white/5 bg-white/[0.02]">
        <div className="flex-1 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-yellow-400 transition-colors" size={18}/>
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            placeholder="BUSCAR POR NOMBRE O CORREO..." 
            className="w-full bg-transparent border-none py-5 pl-16 pr-6 text-[10px] font-bold text-white outline-none placeholder:text-gray-600 tracking-widest uppercase"
          />
        </div>
        
        <div className="flex gap-2 p-2">
          <select 
            value={roleFilter} 
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-gray-400 outline-none cursor-pointer hover:border-yellow-400/20 transition-all appearance-none font-bold text-[10px] uppercase tracking-widest min-w-[180px]"
          >
            <option value="Todos" className="bg-[#0b101f] text-gray-300">Todos los roles</option>
            <option value="admin" className="bg-[#0b101f] text-gray-300">Administradores</option>
            <option value="coordinator" className="bg-[#0b101f] text-gray-300">Coordinadores</option>
          </select>

          <button 
            onClick={loadData} 
            className="p-4 bg-white/5 hover:bg-white/10 rounded-xl text-gray-600 hover:text-white transition-all border border-white/10"
            title="Refrescar datos"
          >
            <RefreshCcw size={18} className={`${loading ? "animate-spin text-yellow-400" : ""}`}/>
          </button>
        </div>
      </div>

      <div className="glass-card overflow-hidden relative border-white/5 bg-white/[0.01]">
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
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
        title="¿DESACTIVAR USUARIO?"
        message="Esta acción revocará el acceso del usuario al sistema de forma inmediata. Podrás reactivarlo editando su perfil más adelante."
      />
    </div>
  );
}