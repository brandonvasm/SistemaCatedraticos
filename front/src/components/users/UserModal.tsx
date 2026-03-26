import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; 
import { X, Save, Shield, Mail, User, Lock } from "lucide-react";
import { userService } from "../../services/userService";
import type { UserData, UserRole } from "../../types/user";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedUser?: UserData | null;
}

export default function UserModal({ isOpen, onClose, onSuccess, selectedUser }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<UserData>>({
    username: "",
    email: "",
    password: "",
    role: "coordinator" as UserRole
  });

  useEffect(() => {
    setError(null);
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role,
        password: "" 
      });
    } else {
      setFormData({ username: "", email: "", password: "", role: "coordinator" });
    }
  }, [selectedUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = { ...formData };
      if (selectedUser) {
        if (!payload.password || payload.password.trim() === "") {
          delete payload.password;
        }
        await userService.updateUser(selectedUser.id, payload);
      } else {
        if (!payload.password) {
          setError("CONTRASEÑA REQUERIDA");
          setLoading(false);
          return;
        }
        await userService.createUser(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError("ERROR AL PROCESAR");
    } finally {
      setLoading(false);
    }
  };


  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">

      <div 
        className="fixed inset-0 bg-white/1 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />


      <div className="relative w-full max-w-lg bg-[#0f111a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X size={24}/>
        </button>

        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold">
               {error}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
              <input 
                required
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-yellow-400/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-yellow-400/40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">Rol</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-gray-300 outline-none appearance-none"
                >
                  <option value="admin">Admin</option>
                  <option value="coordinator">Coordinador</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-yellow-400/40"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-800 text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-[0.97]"
          >
            {loading ? <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" /> : <><Save size={20}/> CONFIRMAR REGISTRO</>}
          </button>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}