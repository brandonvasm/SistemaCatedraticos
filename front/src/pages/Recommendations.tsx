import { useState } from "react";
import { Search, Target } from "lucide-react";
import { CourseCard } from "../components/recommendations/CourseCard";
import { TeacherMatchCard } from "../components/recommendations/TeacherMatchCard";

const COURSES = [
  { id: 1, name: "Cálculo I"},
  { id: 2, name: "Cálculo II",},
  { id: 3, name: "Ecuaciones Diferenciales"},
  { id: 4, name: "Cálculo III"},
  { id: 5, name: "Ingeniería de Software"},
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
              isSelected={selectedId === course.id}
              onClick={() => setSelectedId(course.id)}
            />
          ))}
        </div>
      </div>

      

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