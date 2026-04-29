import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, Zap } from "lucide-react";

interface CourseBarChartProps {
  courses: {
    course_id: number;
    course_name: string;
    punteo: number;
  }[];
}

const CourseBarChart: React.FC<CourseBarChartProps> = ({ courses }) => {
  const chartData = courses.map(course => ({
    name: course.course_name,
    valor: course.punteo
  }));

  return (
    <div className="bg-[#11141d]/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl w-full relative overflow-hidden group h-full">
      
      <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 blur-[120px] rounded-full -mr-32 -mt-32 opacity-60 pointer-events-none" />

      <div className="relative z-10 flex items-center justify-between mb-12 text-white">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20">
            <BarChart3 size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight uppercase">Rendimiento por curso</h3>
            <p className="text-sm text-gray-500 font-medium tracking-tight">
              Top cursos con mejores punteos de control docente
            </p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 text-[10px] text-yellow-400 font-black uppercase tracking-[0.2em] bg-yellow-400/10 px-4 py-1.5 rounded-full border border-yellow-400/20">
          <Zap size={12} fill="currentColor" />
          Métricas Activas
        </div>
      </div>

      <div className="h-[380px] w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <defs>
              <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" stopOpacity={1} />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            
            <CartesianGrid strokeDasharray="4 4" stroke="#374151" vertical={false} opacity={0.2} />
            
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 900 }} dy={15} />
            
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 800 }} domain={[0, 100]} ticks={[0, 50, 100]} />
            
            <Tooltip 
              cursor={{ fill: 'rgba(255, 255, 255, 0.03)', radius: 12 }} 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-gray-950 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">{payload[0].payload.name}</p>
                      <p className="text-xl font-black text-yellow-400 ">{payload[0].value} <span className="text-[10px] text-gray-400 ml-1 text-normal uppercase">Pts</span></p>
                    </div>
                  );
                }
                return null;
              }}
            />
            
            <Bar dataKey="valor" fill="url(#yellowGradient)" radius={[12, 12, 4, 4]} barSize={60}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} className="hover:brightness-110 transition-all duration-300 cursor-pointer" style={{ filter: 'drop-shadow(0px 4px 10px rgba(250, 204, 21, 0.2))' }} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {chartData.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#11141d]/40 z-20 rounded-[2.5rem] backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Sincronizando Cursos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBarChart;