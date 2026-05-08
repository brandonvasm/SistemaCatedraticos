import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState, useRef } from "react";
import { chartService } from "../../services/chartService";
import { Filter, Check } from "lucide-react";

export default function CoursesChart() {
  const [data, setData] = useState<any[]>([]);
  const [availableCourses, setAvailableCourses] = useState<string[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const colors = ["#facc15", "#ef4444", "#3b82f6", "#10b981", "#a855f7", "#ec4899", "#fb923c", "#22d3ee"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await chartService.getCoursesEvolution();
        if (!res || !Array.isArray(res)) return;


        const allCourseNames = new Set<string>();
        res.forEach(semester => {
          Object.keys(semester).forEach(key => {
            if (key !== 'name' && key !== 'sortKey') {
              allCourseNames.add(key);
            }
          });
        });

        const namesArray = Array.from(allCourseNames);
        setAvailableCourses(namesArray);
        setSelectedCourses(namesArray);

        const sortedData = [...res].sort((a, b) => (a.sortKey || 0) - (b.sortKey || 0));
        setData(sortedData);
        
      } catch (error) {
        console.error("Error cargando evolución de cursos:", error);
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

  const toggleCourse = (name: string) => {
    setSelectedCourses(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  return (
    <div className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] backdrop-blur-2xl mb-10">
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
            <span className="text-[10px] font-black uppercase tracking-widest">Filtrar Cursos</span>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-3 w-64 bg-[#0f111a] border border-white/10 rounded-[1.5rem] shadow-2xl p-4 backdrop-blur-xl z-50 animate-in fade-in zoom-in duration-200">
              <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-3 px-2">Seleccionar Cursos</p>
              <div className="flex flex-col gap-1 max-h-60 overflow-y-auto custom-scrollbar">
                {availableCourses.map((course, idx) => (
                  <label
                    key={`filter-${course}`}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: colors[idx % colors.length] }}
                      />
                      <span className="text-[11px] font-bold text-gray-300 group-hover:text-white transition-colors uppercase tracking-tight">
                        {course}
                      </span>
                    </div>
                    
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedCourses.includes(course)}
                        onChange={() => toggleCourse(course)}
                      />
                      <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
                        selectedCourses.includes(course)
                          ? "bg-yellow-400 border-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]"
                          : "bg-transparent border-white/10"
                      }`}>
                        {selectedCourses.includes(course) && <Check size={12} strokeWidth={4} className="text-black" />}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="h-[320px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
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
              .map((name, _) => (
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
    </div>
  );
}