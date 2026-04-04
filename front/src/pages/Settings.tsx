import React, { useState, useEffect } from 'react';
import { Save, ShieldCheck, Fingerprint, Loader2 } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { updateProfile } from '../services/authService';

export default function Settings() {
  const { user, setUser, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '',
        confirmPassword: ''
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    setIsSaving(true);
    try {
      const updateData: any = {
        username: formData.username.trim(),
        email: formData.email.trim(),
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await updateProfile(updateData);

      setUser({
        ...user,
        ...updatedUser,
      } as any);
      
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      
    } catch (error: any) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return null;

  const userInitials = (formData.username || user?.username || "UR").substring(0, 2).toUpperCase();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            CONFIGURACIÓN
          </h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
            PERFIL DE USUARIO · SEGURIDAD DE ACCESO
          </p>
        </div>
        
        <button 
          type="submit"
          form="settings-form"
          disabled={isSaving}
          className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-8 py-4 rounded-2xl flex items-center gap-3 transition-all active:scale-95 shadow-xl shadow-yellow-400/10 text-[11px] uppercase tracking-widest shrink-0 disabled:opacity-50"
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <>
              <Save size={18} />
              <span>Guardar cambios</span>
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-1">
          <div className="glass-card p-10 flex flex-col items-center text-center relative overflow-hidden h-full justify-center bg-white/[0.02] border-white/5">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-50 pointer-events-none" />
            
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-yellow-300 to-yellow-600 text-black flex items-center justify-center font-black text-4xl shadow-2xl uppercase">
                {userInitials}
              </div>
              <div className="absolute -bottom-2 -right-2 p-3 bg-[#0b101f] border border-white/10 rounded-2xl text-green-400 shadow-xl">
                <ShieldCheck size={20} />
              </div>
            </div>

            <h3 className="text-xl font-black text-white tracking-tight uppercase">
              {formData.username || "Usuario"}
            </h3>
            
            <div className="mt-8 flex flex-col gap-3 w-full">
              <div className="px-4 py-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center gap-3">
                <Fingerprint size={14} className="text-gray-500" />
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">ID: {user?.id}</span>
              </div>
              <div className="px-4 py-3 bg-yellow-400/10 border border-yellow-400/10 rounded-xl">
                <span className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.2em]">{user?.role || 'Personal'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="glass-card p-10 relative overflow-hidden bg-white/[0.01] border-white/5">
            <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <form id="settings-form" onSubmit={handleSave} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                
                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 tracking-[0.2em]">Nombre de usuario</label>
                  <input 
                    type="text" 
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-[11px] font-bold text-white outline-none focus:border-yellow-400/30 transition-all tracking-widest shadow-inner" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 tracking-[0.2em]">Correo Institucional</label>
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-[11px] font-bold text-white outline-none focus:border-yellow-400/30 transition-all tracking-widest shadow-inner" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 tracking-[0.2em]">Nueva contraseña</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-[11px] font-bold text-white outline-none focus:border-yellow-400/30 transition-all tracking-widest shadow-inner placeholder:text-gray-700"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-2 tracking-[0.2em]">Confirmar contraseña</label>
                  <input 
                    type="password" 
                    placeholder="••••••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 px-6 text-[11px] font-bold text-white outline-none focus:border-yellow-400/30 transition-all tracking-widest shadow-inner placeholder:text-gray-700"
                  />
                </div>

              </div>

              <div className="mt-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex items-start gap-5 shadow-inner">
                <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                  <ShieldCheck size={20} className="text-blue-400" />
                </div>
                <p className="text-[9px] font-bold text-gray-500 leading-relaxed uppercase tracking-[0.1em]">
                  Al actualizar tus credenciales, las sesiones activas en otros dispositivos se cerrarán automáticamente para proteger tu cuenta institucional.
                </p>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}