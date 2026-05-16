import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState, useRef, useMemo } from "react";
import { chartService } from "../../services/chartService";
import { Filter, Check, Search, BarChart3, MousePointerClick, SearchX } from "lucide-react";

export default function CoursesChart() {
  const [data, setData] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  const colors = ["#facc15", "#ef4444", "#3b82f6", "#10b981", "#a855f7", "#ec4899", "#fb923c", "#22d3ee"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await chartService.getCoursesEvolution();
        if (!res || !Array.isArray(res) || res.length === 0) {
          setData([]);
          return;
        }

        const allCourseNames = new Set<string>();
        res.forEach(semester => {
          Object.keys(semester).forEach(key => {
            if (key !== 'name' && key !== 'sortKey') {
              allCourseNames.add(key);
            }
          });
        });

        const namesArray = Array.from(allCourseNames).sort();
        setAvailableCourses(namesArray);
        setSelectedCourses([]);

        const sortedData = [...res].sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
        setData(sortedData);
        
      } catch (error) {
        console.error("Error cargando evolución de cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCoursesMenu = useMemo(() => {
    return availableCourses.filter(course => 
      course.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [availableCourses, searchTerm]);

  const toggleCourse = (name: string) => {
    setSelectedCourses(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-2xl mb-10 min-h-[480px] flex flex-col">
      <div className="mb-8 flex items-start justify-between relative z-20">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tighter uppercase leading-none">
            EVOLUCIÓN DE CURSOS
          </h2>
          <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] mt-3 ml-1">
            ANÁLISIS HISTÓRICO DE NOTAS
          </p>
        </div>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border transition-all duration-300 ${
              showMenu 
                ? "bg-yellow-400 border-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.3)]" 
                : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
            }`}
          >
            <Filter size={14} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {selectedCourses.length > 0 ? `Cursos (${selectedCourses.length})` : "Seleccionar Cursos"}
            </span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-72 bg-[#0f111a] border border-white/10 rounded-[1.5rem] shadow-2xl p-4 backdrop-blur-xl z-50 animate-in fade-in zoom-in duration-200">
              {/* Buscador interno */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={12} />
                <input 
                  type="text"
                  placeholder="BUSCAR CURSO..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold text-white placeholder:text-gray-600 outline-none focus:border-yellow-400/30 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {filteredCoursesMenu.length > 0 ? (
                  filteredCoursesMenu.map((course) => {
                    const originalIdx = availableCourses.indexOf(course);
                    const isSelected = selectedCourses.includes(course);
                    return (
                      <label
                        key={`filter-${course}`}
                        className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ backgroundColor: colors[originalIdx % colors.length] }}
                          />
                          <span className={`text-[11px] font-bold transition-colors uppercase tracking-tight ${isSelected ? "text-white" : "text-gray-500"}`}>
                            {course}
                          </span>
                        </div>
                        
                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                          isSelected ? "bg-yellow-400 border-yellow-400" : "bg-transparent border-white/10"
                        }`}>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleCourse(course)} />
                          {isSelected && <Check size={12} strokeWidth={4} className="text-black" />}
                        </div>
                      </label>
                    );
                  })
                ) : (
                  <div className="py-8 text-center">
                    <SearchX size={20} className="mx-auto text-gray-700 mb-2" />
                    <p className="text-[9px] font-black text-gray-600 uppercase">Sin resultados</p>
                  </div>
                )}
              </div>
              
              {selectedCourses.length > 0 && (
                <button 
                  onClick={() => setSelectedCourses([])}
                  className="w-full mt-3 pt-3 border-t border-white/5 text-[9px] font-black text-red-400/70 hover:text-red-400 uppercase tracking-widest transition-colors"
                >
                  Limpiar Selección
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 w-full relative z-10 flex items-center justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
             <div className="w-8 h-8 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin" />
             <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Cargando Datos...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center text-center">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-full mb-6">
              <BarChart3 size={40} className="text-gray-800" />
            </div>
            <p className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">No hay datos históricos</p>
            <p className="text-[10px] text-gray-600 font-bold uppercase mt-2">No se encontró información de cursos para este periodo.</p>
          </div>
        ) : selectedCourses.length === 0 ? (
          <div className="flex flex-col items-center text-center group/empty">
            <div className="relative mb-6">
               <div className="absolute inset-0 bg-yellow-400/10 blur-2xl rounded-full group-hover/empty:bg-yellow-400/20 transition-all duration-500" />
               <div className="relative p-6 bg-white/[0.03] border border-white/10 rounded-full">
                <MousePointerClick size={40} className="text-yellow-400/50 group-hover/empty:text-yellow-400 transition-colors duration-500" />
              </div>
            </div>
            <p className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Visualización Vacía</p>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-3 max-w-[280px] leading-relaxed">
              Por favor, utiliza el filtro superior para elegir los cursos que deseas analizar en la línea de tiempo.
            </p>
          </div>
        ) : (
          <div className="h-full w-full">
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                  dy={10}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#6b7280"
                  tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 700 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15,17,26,0.95)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: "16px",
                    backdropFilter: "blur(10px)",
                  }}
                  itemStyle={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold', color: '#fff' }}
                />
                {availableCourses
                  .filter(name => selectedCourses.includes(name))
                  .map((name) => (
                    <Line
                      key={`line-${name}`}
                      type="monotone"
                      dataKey={name}
                      stroke={colors[availableCourses.indexOf(name) % colors.length]}
                      strokeWidth={3}
                      dot={{ r: 4, fill: colors[availableCourses.indexOf(name) % colors.length], strokeWidth: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                      connectNulls
                      animationDuration={1000}
                    />
                  ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}