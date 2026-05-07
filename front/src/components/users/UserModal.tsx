import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Save, Shield, Mail, User, Lock, School, Plus } from "lucide-react";
import { userService } from "../../services/userService";
import { academicsService } from "../../services/academicsService";
import FacultyModal from "../common/FacultyModal";
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
  const [faculties, setFaculties] = useState<any[]>([]);
  const [isFacultyModalOpen, setIsFacultyModalOpen] = useState(false);

  const [formData, setFormData] = useState<Partial<UserData & { password?: string; faculty_id?: number }>>({
    username: "",
    email: "",
    role: "coordinator" as UserRole,
    password: "",
    faculty_id: undefined
  });

  const loadFaculties = async () => {
    try {
      const data = await academicsService.getFaculties();
      setFaculties(data);
    } catch (err) {
      setError("ERROR AL CARGAR FACULTADES");
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadFaculties();
      setError(null);
      if (selectedUser) {
        setFormData({
          username: selectedUser.username,
          email: selectedUser.email,
          role: selectedUser.role,
          password: "",
          faculty_id: selectedUser.faculty_id
        });
      } else {
        setFormData({
          username: "",
          email: "",
          role: "coordinator",
          password: "",
          faculty_id: undefined
        });
      }
    }
  }, [selectedUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = selectedUser 
        ? { role: formData.role }
        : {
            username: formData.username,
            email: formData.email,
            role: formData.role,
            password: formData.password || undefined,
            faculty_id: formData.faculty_id ? Number(formData.faculty_id) : undefined
          };

      if (selectedUser) {
        await userService.updateUser(selectedUser.id, dataToSend as any);
      } else {
        await userService.createUser(dataToSend as any);
      }
      
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.detail || "ERROR AL GUARDAR");
    } finally {
      setLoading(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#0f111a] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X size={24}/>
        </button>

        <div className="mb-8 text-center sm:text-left">
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">
            {selectedUser ? "Editar Usuario" : "Nuevo Usuario"}
          </h2>
          <p className="text-[10px] text-yellow-400/50 font-black uppercase tracking-[0.3em] mt-2">Gestión de Personal Académico</p>
          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[10px] font-bold uppercase tracking-widest animate-shake">
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
                disabled={!!selectedUser}
                required
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
                className={`w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none transition-all ${selectedUser ? 'opacity-50 cursor-not-allowed border-none' : 'focus:border-yellow-400/40'}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
              <input 
                disabled={!!selectedUser}
                required
                type="email"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className={`w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none transition-all ${selectedUser ? 'opacity-50 cursor-not-allowed border-none' : 'focus:border-yellow-400/40'}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-end mb-1">
                <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">Facultad</label>
                {!selectedUser && (
                    <button 
                        type="button"
                        onClick={() => setIsFacultyModalOpen(true)}
                        className="text-[10px] text-yellow-400 font-black uppercase hover:text-yellow-500 transition-colors flex items-center gap-1"
                    >
                        <Plus size={12}/> Nueva Facultad
                    </button>
                )}
            </div>
            <div className="relative">
              <School className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
              <select 
                disabled={!!selectedUser}
                required
                value={formData.faculty_id || ""}
                onChange={e => setFormData({...formData, faculty_id: e.target.value ? Number(e.target.value) : undefined})}
                className={`w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-10 py-4 text-gray-300 outline-none appearance-none transition-all font-bold text-[12px] ${selectedUser ? 'opacity-50 cursor-not-allowed border-none' : 'focus:border-yellow-400/40'}`}
              >
                <option value="">Seleccionar Facultad</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!selectedUser && (
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18}/>
                <input 
                  required
                  type="password"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white outline-none focus:border-yellow-400/40 transition-all"
                  placeholder="Min. 6 caracteres"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1 tracking-widest">Rol del Sistema</label>
            <div className="relative border-2 border-yellow-400/20 rounded-2xl">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400" size={18}/>
              <select 
                value={formData.role}
                onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                className="w-full bg-yellow-400/5 rounded-2xl pl-12 pr-10 py-4 text-white outline-none appearance-none font-bold text-[12px] focus:border-yellow-400/40"
              >
                <option value="coordinator">Coordinador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-800 disabled:text-gray-500 text-black font-black py-5 rounded-[1.5rem] flex items-center justify-center gap-3 transition-all active:scale-[0.97] uppercase tracking-widest shadow-xl shadow-yellow-400/10"
          >
            {loading ? <div className="w-6 h-6 border-4 border-black/20 border-t-black rounded-full animate-spin" /> : <><Save size={20}/> CONFIRMAR {selectedUser ? "CAMBIOS" : "REGISTRO"}</>}
          </button>
        </form>
      </div>

      <FacultyModal 
        isOpen={isFacultyModalOpen}
        onClose={() => setIsFacultyModalOpen(false)}
        onSuccess={() => {
            loadFaculties();
            setIsFacultyModalOpen(false);
        }}
      />
    </div>
  );

  return createPortal(modalContent, document.body);
}