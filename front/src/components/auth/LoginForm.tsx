import React, { useState } from 'react';
import { Mail, Lock, LogIn, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState(localStorage.getItem('remembered_email') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleEmailChange = (value: string) => {
    setEmail(value);
    localStorage.setItem('remembered_email', value);
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsLoading(true);
    setError(null);

    if (!email.includes('@')) {
      setError("El correo debe incluir un '@' (ejemplo@url.edu.gt)");
      setIsLoading(false);
      return;
    }

    try {
      const loggedInUser = await loginUser({ email, password });
      setUser(loggedInUser);
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.detail || err.message || "Correo o contraseña incorrectos");
      setPassword(''); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] min-h-[600px] p-10 bg-[#0b101f]/60 border border-white/10 backdrop-blur-[30px] rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10 flex flex-col justify-center relative overflow-hidden">
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className="absolute -top-[30%] -left-[10%] w-[120%] h-[120%] bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.05)_0%,transparent_50%)] pointer-events-none" />

      <div className="text-center mb-4 flex flex-col items-center relative z-10">
        <div className="w-full h-24 flex items-center justify-center mb-8 relative">
          <img src="/letraslandivar.png" alt="Logo Landívar" className="h-full w-auto object-contain transform scale-[2.5] transition-transform duration-300" />
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase leading-none">BIENVENIDO</h2>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-4">EVALDOCENTE · FACULTAD DE INGENIERÍA</p>
      </div>

      <div className="h-24 mb-2 flex items-center relative z-10">
        {error && (
          <div className="w-full p-5 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-4 animate-in fade-in zoom-in duration-300">
            <AlertCircle size={20} className="shrink-0" />
            <p className="leading-tight">{error}</p>
          </div>
        )}
      </div>

      <form className="space-y-7 relative z-10" onSubmit={handleSubmit} noValidate>
        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-2">CORREO INSTITUCIONAL</label>
          <div className="relative group">
            <Mail className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-red-400/60' : 'text-gray-600 group-focus-within:text-yellow-400'}`} size={20} />
            <input type="email" placeholder="usuario@url.edu.gt" className={`w-full bg-white/[0.02] border rounded-2xl py-5 pl-16 pr-6 text-xs font-bold text-white outline-none transition-all tracking-widest shadow-inner ${error ? 'border-red-500/40 bg-red-500/5' : 'border-white/5 focus:border-yellow-400/40 focus:bg-white/[0.05]'}`} value={email} onChange={(e) => handleEmailChange(e.target.value)} />
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] ml-2">CONTRASEÑA</label>
          <div className="relative group">
            <Lock className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors duration-300 ${error ? 'text-red-400/60' : 'text-gray-600 group-focus-within:text-yellow-400'}`} size={20} />
            <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={`w-full bg-white/[0.02] border rounded-2xl py-5 pl-16 pr-16 text-xs font-bold text-white outline-none transition-all tracking-widest shadow-inner ${error ? 'border-red-500/40 bg-red-500/5' : 'border-white/5 focus:border-yellow-400/40 focus:bg-white/[0.05]'}`} value={password} onChange={(e) => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors p-1">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-5 rounded-[2rem] shadow-[0_10px_30px_rgba(250,204,21,0.2)] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-[0.2em] text-[11px] mt-4">
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} /><span>ENTRAR AL SISTEMA</span></>}
        </button>
      </form>
      <p className="text-center text-[9px] text-gray-600 font-bold uppercase tracking-widest mt-10 relative z-10">© UNIVERSIDAD RAFAEL LANDÍVAR</p>
    </div>
  );
}