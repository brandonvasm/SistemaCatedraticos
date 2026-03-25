import { useState } from 'react';
import { Mail, Lock, LogIn, Loader2, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

export default function LoginForm() {
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
      const data = await loginUser({ email, password });
      localStorage.setItem("user_id", data.user_id.toString());
      if (data.role) localStorage.setItem("user_role", data.role.toLowerCase().trim());
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.detail || err.message || "Correo o contraseña incorrectos");
      setPassword(''); 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[500px] min-h-[600px] p-10 bg-[#11141d]/50 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl z-10 flex flex-col justify-center">
      
      <div className="text-center mb-4 flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden mb-6 shadow-2xl shadow-white/5">
          <img
            src="/logo-url.png"
            alt="Logo"
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-3xl font-black text-white tracking-tight uppercase leading-none">Bienvenido</h2>
        <p className="text-gray-500 font-medium mt-3">Ingresa a EvalDocente Ingeniería</p>
      </div>

      <div className="h-20 mb-2 flex items-center">
        {error && (
          <div className="w-full p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-in fade-in zoom-in duration-200">
            <AlertCircle size={18} className="shrink-0" />
            <p className="font-semibold leading-tight text-balance">{error}</p>
          </div>
        )}
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
            Correo Electrónico
          </label>
          <div className="relative group">
            <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400/60' : 'text-gray-500 group-focus-within:text-yellow-400'}`} size={20} />
            <input 
              type="email" 
              placeholder="ejemplo@universidad.edu"
              className={`w-full bg-black/40 border rounded-2xl py-4 pl-14 pr-6 text-white outline-none transition-all ${error ? 'border-red-500/40' : 'border-white/5 focus:border-yellow-400/40'}`}
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 ml-1">
            Contraseña
          </label>
          <div className="relative group">
            <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${error ? 'text-red-400/60' : 'text-gray-500 group-focus-within:text-yellow-400'}`} size={20} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              className={`w-full bg-black/40 border rounded-2xl py-4 pl-14 pr-14 text-white outline-none transition-all ${error ? 'border-red-500/40' : 'border-white/5 focus:ring-yellow-400/20 focus:border-yellow-400/40'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-4 rounded-2xl shadow-xl shadow-yellow-400/10 flex items-center justify-center gap-3 transition-all active:scale-[0.97] disabled:opacity-50 uppercase tracking-widest text-sm mt-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><LogIn size={20} /><span>Entrar al Sistema</span></>}
        </button>
      </form>
    </div>
  );
}