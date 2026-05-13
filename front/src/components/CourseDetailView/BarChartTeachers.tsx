import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { useEffect, useState, useRef, useMemo } from "react";
import { courseService } from "../../services/courseService";
import { Filter, Check, Search, SearchX } from "lucide-react";

const colors = ["#facc15", "#34d399", "#60a5fa", "#f87171", "#a78bfa"];

export default function BarChartTeachers({ courseId }: { courseId?: string }) {
  const [rawData, setRawData] = useState<any[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadStats = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const res = await courseService.getCourseTeachersStats(courseId);
        
        if (Array.isArray(res) && res.length > 0) {
          const formatted = res.map((item) => ({
            name: item.teacher_name?.split(" ")[0] || "Docente", 
            value: parseFloat(item.average_rating) || 0,
            fullName: item.teacher_name
          }));
          setRawData(formatted);
          setSelectedTeachers(formatted.map(d => d.name));
        } else {
          setRawData([]);
        }
      } catch (error) {
        console.error("Error cargando stats de docentes:", error);
        setRawData([]);
      } finally {
        setLoading(false);
      }
    };
    loadStats();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [courseId]);

  const filteredMenu = useMemo(() => {
    return rawData.filter(t => 
      t.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [rawData, searchTerm]);

  const chartData = useMemo(() => {
    return rawData.filter(d => selectedTeachers.includes(d.name));
  }, [rawData, selectedTeachers]);

  const toggleTeacher = (name: string) => {
    setSelectedTeachers(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl h-80 overflow-hidden flex flex-col">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-yellow-400/[0.01] blur-[80px] rounded-full pointer-events-none" />
      
      <div className="mb-4 flex items-start justify-between relative z-20">
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
            DOCENTES
          </h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3 ml-1">
            {loading ? "Sincronizando..." : "Rendimiento"}
          </p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`p-2 rounded-xl border transition-all duration-300 ${
              showMenu 
                ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.2)]" 
                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            <Filter size={14} strokeWidth={3} />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0f111a] border border-white/10 rounded-[1.2rem] shadow-2xl p-3 backdrop-blur-xl z-50 animate-in fade-in zoom-in duration-200">
              <div className="relative mb-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-500" size={10} />
                <input 
                  type="text"
                  placeholder="BUSCAR..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg py-1.5 pl-8 pr-3 text-[9px] font-bold text-white placeholder:text-gray-600 outline-none focus:border-yellow-400/30 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1 max-h-32 overflow-y-auto custom-scrollbar pr-1">
                {filteredMenu.length > 0 ? (
                  filteredMenu.map((teacher, idx) => {
                    const isSelected = selectedTeachers.includes(teacher.name);
                    return (
                      <label key={idx} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 cursor-pointer group/item">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                          <span className={`text-[9px] font-bold uppercase transition-colors ${isSelected ? "text-white" : "text-gray-500 group-hover/item:text-gray-300"}`}>
                            {teacher.name}
                          </span>
                        </div>
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-all ${isSelected ? "bg-yellow-400 border-yellow-400" : "bg-transparent border-white/10"}`}>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleTeacher(teacher.name)} />
                          {isSelected && <Check size={8} strokeWidth={5} className="text-black" />}
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="py-4 text-center">
                    <SearchX size={14} className="mx-auto text-gray-700 mb-1" />
                    <p className="text-[8px] font-black text-gray-600 uppercase">Sin resultados</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-10 flex-grow flex items-center justify-center h-[60%]">
        {loading ? (
          <div className="text-[10px] text-gray-500 font-black uppercase animate-pulse">
            Sincronizando...
          </div>
        ) : chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 10, left: -30, bottom: 0 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tick={{ fill: "#6b7280", fontSize: 9, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
                dy={8}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#6b7280"
                tick={{ fill: "#6b7280", fontSize: 9, fontWeight: 700 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(15,17,26,0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "12px",
                  backdropFilter: "blur(10px)",
                }}
                itemStyle={{ fontSize: '9px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase' }}
                cursor={{ fill: "rgba(255,255,255,0.03)" }}
              />
              <Bar dataKey="value" name="Promedio" radius={[6, 6, 0, 0]} barSize={32} minPointSize={4}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.value === 0 ? "#374151" : colors[index % colors.length]} 
                    fillOpacity={entry.value === 0 ? 0.4 : 1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center gap-2 opacity-30">
            <p className="text-[9px] text-white font-black uppercase tracking-[0.2em]">
              {rawData.length > 0 ? "Selección vacía" : "Sin docentes asignados"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}