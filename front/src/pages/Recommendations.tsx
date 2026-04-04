import { useState } from "react";
import { Search, Target, BrainCircuit, CheckCircle } from "lucide-react";
import { CourseCard } from "../components/recommendations/CourseCard";
import { TeacherMatchCard } from "../components/recommendations/TeacherMatchCard";

const COURSES = [
  { id: 1, name: "Cálculo I", status: "Necesita 2" },
  { id: 2, name: "Cálculo II", status: "Necesita 1" },
  { id: 3, name: "Ecuaciones Diferenciales", status: "Necesita 3" },
  { id: 4, name: "Cálculo III", status: "Necesita 1" },
  { id: 5, name: "Ingeniería de Software", status: "Necesita 2" },
];

const TEACHER_DATA = {
  name: "Ing. Ana Patricia Rodríguez Santos",
  initials: "AR",
  match: 98,
  specialty: "Análisis Matemático",
  experience: "12 años",
  rating: 4.7,
  currentCourses: ["Ecuaciones Diferenciales", "Cálculo III"],
  strengths: ["Experiencia directa en la materia", "Excelente evaluación histórica"],
  reason: "Ya imparte este curso con excelentes resultados. Su dominio del tema y disponibilidad horaria la convierten en la opción ideal."
};

export default function Recommendations() {
  const [selectedId, setSelectedId] = useState(3);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <header className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="w-full md:w-auto">
          <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">
            RECOMENDACIONES
          </h1>
          <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.4em] mt-4 ml-1">
            ANÁLISIS INTELIGENTE · ASIGNACIÓN DOCENTE
          </p>
        </div>
        
        <div className="relative group w-full md:w-72">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors" size={18} />
          <input 
            className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-[10px] font-bold text-white outline-none focus:border-yellow-400/20 backdrop-blur-md transition-all uppercase tracking-widest placeholder:text-gray-600" 
            placeholder="BUSCAR CURSO..." 
          />
        </div>
      </header>

      <div className="space-y-5">
        <div className="flex items-center gap-3 text-yellow-500 font-black text-[10px] uppercase tracking-[0.3em] ml-2">
          <Target size={16} />
          <span>Selecciona un curso para analizar</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {COURSES.map(course => (
            <CourseCard 
              key={course.id}
              name={course.name}
              status={course.status}
              isSelected={selectedId === course.id}
              onClick={() => setSelectedId(course.id)}
            />
          ))}
        </div>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 bg-white/[0.01] border border-white/5 p-10 rounded-[3rem] backdrop-blur-2xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/[0.02] blur-[100px] rounded-full -mr-40 -mt-40 pointer-events-none" />
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-400/10 rounded-2xl border border-yellow-400/20 shadow-lg shadow-yellow-400/5">
              <BrainCircuit className="text-yellow-400" size={24} />
            </div>
            <h2 className="text-[11px] font-black text-white uppercase tracking-[0.2em]">Métricas del Curso</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold text-gray-400 uppercase tracking-widest">Cálculo II</span>
            <span className="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[9px] font-bold text-gray-400 uppercase tracking-widest">Álgebra Lineal</span>
          </div>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-y-6 gap-x-10 border-l border-white/5 pl-10 relative z-10">
          {["Experiencia previa", "Evaluación > 4.0", "Disponibilidad", "Cursos afines"].map(item => (
            <div key={item} className="flex items-center gap-3 group">
              <div className="p-1.5 rounded-full bg-green-500/10 border border-green-500/20 group-hover:bg-green-500/20 transition-colors">
                <CheckCircle size={14} className="text-green-500" />
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em]">{item}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="space-y-8 pb-20">
        <div className="flex items-center gap-4 ml-2">
           <div className="h-px w-8 bg-yellow-400/30" />
           <h2 className="text-xl font-black text-white uppercase tracking-tighter">Análisis de Perfil</h2>
        </div>
        <TeacherMatchCard teacher={TEACHER_DATA} />
      </div>

    </div>
  );
}