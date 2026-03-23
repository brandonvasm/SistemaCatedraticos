import { useState } from 'react';
import { Mail, Lock, LogIn, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/authService";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {

      const data = await loginUser({ email, password });
    
      localStorage.setItem("user_id", data.user_id.toString());
      navigate("/dashboard");
      
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[400px] p-8 bg-secondary/30 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl z-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-accent rounded-2xl text-black text-3xl mb-4 shadow-lg shadow-accent/20 font-bold">
          🎓
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Bienvenido</h2>
        <p className="text-gray-400 text-sm mt-1">Ingresa a EvalDocente Ingeniería</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Correo Electrónico
          </label>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
            <input 
              type="email" 
              required
              disabled={isLoading}
              placeholder="usuario@universidad.edu"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all disabled:opacity-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">
            Contraseña
          </label>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent transition-colors" size={18} />
            <input 
              type="password" 
              required
              disabled={isLoading}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all disabled:opacity-50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent hover:bg-yellow-500 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-accent/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
          {isLoading ? "Verificando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
}