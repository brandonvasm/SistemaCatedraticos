import React from 'react';
import StatCard from '../components/ui/StatCard';
import PerformanceBar from '../components/ui/PerformanceBar';
import CourseHealthBarChart from '../components/dashboard/courses/CourseBarChart';
import StudentGradeLineChart from '../components/health/StudentGradeLineChart';
import HealthLegend from '../components/health/HealthLegend';
import { ShieldCheck, AlertOctagon, Activity } from 'lucide-react';

const SaludCarrera: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header>
        <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
          Salud de la carrera
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Métricas de cumplimiento y estado académico — Facultad de Ingeniería
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Indicadores Saludables" 
          value="2" 
          description="Cursos con rendimiento óptimo"
          icon={<ShieldCheck size={20} />} 
        />
        <StatCard 
          title="Advertencias" 
          value="2" 
          description="Revisiones de sílabo pendientes"
          icon={<Activity size={20} />} 
        />
        <StatCard 
          title="Críticos" 
          value="1" 
          description="Acción inmediata requerida"
          icon={<AlertOctagon size={20} />} 
        />
      </div>

      <section className="glass-card p-8 relative overflow-hidden group">

        <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mt-32 opacity-20 pointer-events-none" />

        <div className="relative z-10 flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">

            <div className="w-1.5 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]" />
            
            <div>
              <h2 className="text-lg font-black text-white tracking-tight uppercase">
                Indicadores de desempeño
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                Métricas de satisfacción y calidad académica
              </p>
            </div>
          </div>

          <div className="variant-blue px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
            Métricas Actualizadas
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          <PerformanceBar label="Satisfacción estudiantil" percentage={65} />
          <PerformanceBar label="Calidad docente" percentage={82} />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
        <div className="bg-[#11141d]/50 border border-white/5 p-0 rounded-[2.5rem]">
          <CourseHealthBarChart />
        </div>

        <div className="bg-[#11141d]/50 border border-white/5 p-8 rounded-[2.5rem]">
          <h3 className="text-sm font-black text-gray-500 tracking-widest mb-8 text-center">
            Calificación promedio
          </h3>
          <StudentGradeLineChart />
        </div>
      </div>

      <footer className="pt-10 border-t border-white/5">
        <div className="bg-[#11141d]/50 border border-white/5 p-8 rounded-[2.5rem]">
            <h2 className="text-lg font-bold text-white tracking-tight mb-6 uppercase">Recomendaciones y acciones </h2>

          <HealthLegend />
        </div>
      </footer>
    </div>
  );
};

export default SaludCarrera;