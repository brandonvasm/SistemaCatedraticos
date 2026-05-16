import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, Zap, Database, MousePointer2 } from "lucide-react"; 

interface CourseBarChartProps {
  courses: {
    course_id: number;
    course_name: string;
    punteo: number;
  }[];
}

const CourseBarChart: React.FC<CourseBarChartProps> = ({ courses }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const hasData = courses && courses.length > 0;

  const chartData = courses.map(course => ({
    name: course.course_name,
    valor: course.punteo
  }));

  return (
    <div className="bg-[#1e2230]/60 border border-white/5 rounded-[2.5rem] p-8 h-full shadow-2xl relative overflow-hidden backdrop-blur-2xl group/main">
      
      <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 blur-[120px] rounded-full -mr-32 -mt-32 opacity-60 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-10 text-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/20 rounded-2xl flex items-center justify-center text-yellow-500">
            <BarChart3 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight leading-none">Rendimiento por curso</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Métricas de control docente</p>
          </div>
        </div>
        
        {hasData && (
          <div className="hidden md:flex items-center gap-2 text-[10px] text-yellow-400 font-black uppercase tracking-[0.2em] bg-yellow-400/10 px-4 py-2 rounded-full border border-yellow-400/20">
            <Zap size={12} fill="currentColor" className="animate-pulse" />
            Métricas Activas
          </div>
        )}
      </div>

      <div className="h-[380px] w-full relative z-10">
        {!hasData ? (
          <div className="h-full w-full flex flex-col items-center justify-center space-y-4">
            <div className="p-6 bg-white/[0.02] border border-white/5 rounded-full">
              <Database size={40} className="text-gray-700" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.4em]">
                No hay datos disponibles
              </p>
            </div>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData} 
                margin={{ top: 10, right: 10, left: -25, bottom: 20 }}
                onMouseMove={(state) => {
                  if (state && typeof state.activeTooltipIndex === 'number') {
                    setActiveIndex(state.activeTooltipIndex);
                  }
                }}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <defs>
                  <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#facc15" stopOpacity={1} />
                    <stop offset="100%" stopColor="#ca8a04" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="4 4" stroke="#374151" vertical={false} opacity={0.1} />
                
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 9, fontWeight: 900 }} 
                  dy={15}
                  tickFormatter={(val) => val.toUpperCase()} 
                />
                
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 800 }} 
                  domain={[0, 100]} 
                  ticks={[0, 50, 100]} 
                />
                
                <Tooltip 
                  cursor={{ fill: 'rgba(255, 255, 255, 0.02)', radius: 15 }} 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#11141d]/90 border border-white/10 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                          <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1">Asignatura</p>
                          <p className="text-xs font-black text-white uppercase mb-2">{payload[0].payload.name}</p>
                          <div className="h-px w-full bg-white/5 mb-2" />
                          <p className="text-2xl font-black text-yellow-400">
                            {payload[0].value} <span className="text-[10px] text-gray-500 uppercase">Pts</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                <Bar dataKey="valor" radius={[12, 12, 4, 4]} barSize={55}>
                  {chartData.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="url(#yellowGradient)"
                      className="transition-all duration-500 cursor-pointer"
                      style={{ 
                        filter: activeIndex === index 
                          ? 'drop-shadow(0px 0px 15px rgba(250, 204, 21, 0.4))' 
                          : 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.2))',
                        opacity: activeIndex === null || activeIndex === index ? 1 : 0.4
                      }} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-20 group-hover:opacity-100 transition-opacity duration-500">
              <MousePointer2 size={12} className="text-gray-500" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Explorar Datos</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseBarChart;