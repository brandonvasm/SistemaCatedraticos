import { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState<Partial<UserData>>({
    username: "",
    email: "",
    password: "",
    role: "coordinator" as UserRole
  });

  // Efecto para cargar datos si estamos editando
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        username: selectedUser.username,
        email: selectedUser.email,
        role: selectedUser.role,
        password: "" // No mostramos la contraseña actual por seguridad
      });
    } else {
      setFormData({ username: "", email: "", password: "", role: "coordinator" });
    }
  }, [selectedUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de guardado estático
    setTimeout(async () => {
      if (selectedUser) {
        await userService.updateUser(selectedUser.id, formData);
      } else {
        await userService.createUser(formData);
      }
      setLoading(false);
      onSuccess(); // Refresca la tabla
      onClose();   // Cierra el modal
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0f111a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl shadow-black">
        
        {/* Botón Cerrar */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-all"
        >
          <X size={24}/>
        </button>

        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">
            {selectedUser ? "Editar Usuario" : "Nuevo Registro"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">Completa la información del personal académico.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Username */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-[0.2em]">Nombre de Usuario</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
              <input 
                required
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                placeholder="ej: jdoe_ing"
                className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder:text-gray-700 outline-none focus:border-yellow-400/40 transition-all shadow-inner"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-[0.2em]">Correo Institucional</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
              <input 
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                placeholder="usuario@url.edu.gt"
                className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder:text-gray-700 outline-none focus:border-yellow-400/40 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Rol Selector */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-[0.2em]">Rol</label>
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                  className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-gray-300 outline-none appearance-none focus:border-yellow-400/40 cursor-pointer"
                >
                  <option value="admin">Admin</option>
                  <option value="coordinator">Coordinador</option>
                </select>
              </div>
            </div>

            {/* Password (Solo si es nuevo) */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-[0.2em]">
                {selectedUser ? "Nueva Clave (Opcional)" : "Contraseña"}
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                <input 
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white placeholder:text-gray-700 outline-none focus:border-yellow-400/40 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Botón Acción */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-700 text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-[0.97] shadow-xl shadow-yellow-400/10"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <Save size={20}/>
                {selectedUser ? "GUARDAR CAMBIOS" : "CONFIRMAR REGISTRO"}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}