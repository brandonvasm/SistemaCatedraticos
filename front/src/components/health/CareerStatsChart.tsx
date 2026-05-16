import { useEffect, useState, useRef, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend} from "recharts";
import { Loader2, Inbox, BarChart3, Target, Filter, Check, Search, SearchX } from "lucide-react";
import { motion } from "framer-motion";
import { careerService } from "../../services/careerService";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f111a] border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-md z-50">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 border-b border-white/5 pb-1">
          {label}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-[11px] font-bold flex justify-between gap-4" style={{ color: entry.fill }}>
              <span className="uppercase opacity-60">{entry.name}:</span>
              <span>{entry.value ? entry.value.toFixed(1) : "0.0"}</span>
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function CareerStatsChart() {
  const [data, setData] = useState<any[]>([]); 
  const [selectedCareers, setSelectedCareers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await careerService.getCareerAverages();
        if (Array.isArray(res) && res.length > 0) {
          const sanitized = res.map(item => ({
            ...item,
            name: item.name || "N/A",
            avg_teacher_score: Number(item.avg_teacher_score) || 0,
            avg_course_control_score: Number(item.avg_course_control_score) || 0
          }));
          setData(sanitized);
          setSelectedCareers(sanitized.slice(0, 3).map(c => c.name));
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error cargando estadísticas de carreras:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setShowMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMenu = useMemo(() => {
    return data.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [data, searchTerm]);

  const chartData = useMemo(() => {
    return data.filter(c => selectedCareers.includes(c.name));
  }, [data, selectedCareers]);

  const toggleCareer = (name: string) => {
    setSelectedCareers(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1e2230]/60 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl h-[520px] flex flex-col backdrop-blur-2xl relative"
    >
      <div className="flex items-start justify-between mb-8 relative z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 border border-white/10">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight leading-none">Promedios Facultad</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 ">Rendimiento por Carrera</p>
          </div>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all duration-300 ${
              showMenu ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.2)]" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            <Filter size={14} strokeWidth={3} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {selectedCareers.length > 0 ? `CARRERAS (${selectedCareers.length})` : "FILTRAR"}
            </span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-[#0f111a] border border-white/10 rounded-[1.5rem] shadow-2xl p-4 backdrop-blur-xl z-50 animate-in fade-in zoom-in duration-200">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                <input 
                  type="text"
                  placeholder="BUSCAR CARRERA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[9px] font-bold text-white outline-none focus:border-yellow-400/30 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {filteredMenu.length > 0 ? (
                  filteredMenu.map((career, idx) => {
                    const isSelected = selectedCareers.includes(career.name);
                    return (
                      <label key={idx} className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 cursor-pointer group">
                        <span className={`text-[10px] font-bold uppercase transition-colors ${isSelected ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                          {career.name}
                        </span>
                        <div className={`w-4 h-4 rounded-lg border flex items-center justify-center transition-all ${isSelected ? "bg-yellow-400 border-yellow-400" : "bg-transparent border-white/10"}`}>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleCareer(career.name)} />
                          {isSelected && <Check size={10} strokeWidth={4} className="text-black" />}
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="py-6 text-center">
                    <SearchX size={18} className="mx-auto text-gray-700 mb-2" />
                    <p className="text-[8px] font-black text-gray-600 uppercase">Sin resultados</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 relative z-10">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="animate-spin text-yellow-400" size={32} />
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 9, fontWeight: 900 }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 9 }}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
              <Legend 
                verticalAlign="top" 
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingTop: '0', paddingBottom: '20px', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase' }}
              />
              <Bar 
                name="Puntaje Docente" 
                dataKey="avg_teacher_score" 
                fill="#34d399" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
                minPointSize={2} 
              />
              <Bar 
                name="Control Cursos" 
                dataKey="avg_course_control_score" 
                fill="#60a5fa" 
                radius={[4, 4, 0, 0]} 
                barSize={12}
                minPointSize={2} 
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-700">
            <Inbox size={40} className="mb-4 opacity-10" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {data.length > 0 ? "Selecciona carreras para comparar" : "Sin datos disponibles"}
            </span>
          </div>
        )}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 gap-4 relative z-10">
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
          <Target size={16} className="text-emerald-400" />
          <div>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1">Métrica Clave</p>
            <p className="text-[11px] font-bold text-white uppercase">Eficiencia</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
          <BarChart3 size={16} className="text-blue-400" />
          <div>
            <p className="text-[8px] text-gray-500 font-black uppercase tracking-tighter leading-none mb-1">Visualizando</p>
            <p className="text-[11px] font-bold text-white uppercase">{chartData.length} Carreras</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}