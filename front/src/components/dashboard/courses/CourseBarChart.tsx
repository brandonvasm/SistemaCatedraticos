import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { BarChart3, Zap } from "lucide-react";
import type { CourseData } from '../../../types/health';

const data: CourseData[] = [
  { name: 'Prog. I', valor: 4.2 },
  { name: 'Prog. II', valor: 3.9 },
  { name: 'Base Datos', valor: 4.5 },
  { name: 'Redes', valor: 4.0 },
  { name: 'Software', valor: 3.8 },
  { name: 'IA', valor: 4.1 },
];

const CourseBarChart: React.FC = () => (
  <div className="bg-[#11141d]/50 border border-white/5 rounded-[2.5rem] p-10 backdrop-blur-xl shadow-2xl w-full relative overflow-hidden group">
    
    <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-500/5 blur-[120px] rounded-full -mr-32 -mt-32 opacity-60 pointer-events-none" />

    <div className="relative z-10 flex items-center justify-between mb-12">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-yellow-500/10 rounded-xl text-yellow-500 border border-yellow-500/20">
          <BarChart3 size={22} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight ">Rendimiento por curso</h3>
        
          <p className="text-sm text-gray-500 font-medium tracking-tight">
            Comparativa de evaluaciones por materia — Facultad de Ingeniería
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
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#facc15" stopOpacity={1} />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity={0.8} />
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="4 4" 
            stroke="#374151" 
            vertical={false} 
            opacity={0.2}
          />
          
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9ca3af', fontSize: 11, fontWeight: 900 }} 
            dy={15}
          />
          
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 800 }} 
            domain={[0, 5]}
            ticks={[0, 2, 5]}
          />
          
          <Tooltip 
            cursor={{ fill: 'rgba(255, 255, 255, 0.03)', radius: 12 }} 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-gray-950 border border-white/10 p-3 rounded-xl shadow-2xl backdrop-blur-md">
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">
                      {payload[0].payload.name}
                    </p>
                    <p className="text-xl font-black text-yellow-400 italic">
                      {payload[0].value} <span className="text-[10px] text-gray-400 ml-1">Puntos</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          
          <Bar 
            dataKey="valor" 
            fill="url(#yellowGradient)" 
            radius={[12, 12, 4, 4]} 
            barSize={60}
          >
            {data.map((_, index) => (
              <Cell 
                key={`cell-${index}`} 
                className="hover:brightness-110 transition-all duration-300 cursor-pointer"
                style={{ filter: 'drop-shadow(0px 4px 10px rgba(250, 204, 21, 0.2))' }}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default CourseBarChart;