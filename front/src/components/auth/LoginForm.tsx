import { useState } from 'react';
import { Mail, Lock, LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
   
    console.log("Login intent:", { email, password });
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
              placeholder="usuario@universidad.edu"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
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
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-gray-600 outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>


        <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium">
          <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
            <input type="checkbox" className="w-3 h-3 rounded border-white/10 bg-white/5 accent-accent" /> 
            Recordarme
          </label>
          <a href="#" className="hover:text-accent transition-colors">¿Olvidaste tu contraseña?</a>
        </div>


        <button 
          type="submit"
          className="w-full bg-accent hover:bg-yellow-500 text-black font-bold py-3.5 rounded-xl shadow-lg shadow-accent/10 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
        >
          <LogIn size={18} />
          Iniciar Sesión
        </button>
      </form>


      <div className="mt-8 pt-6 border-t border-white/5 text-center">
        <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em]">
          Facultad de Ingeniería URL
        </p>
      </div>
    </div>
  );
}