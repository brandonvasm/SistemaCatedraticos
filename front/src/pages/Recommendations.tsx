import { useState, useEffect, useRef } from "react";
import { Loader2, Inbox, Sparkles, ChevronDown } from "lucide-react";
import { Card } from "../components/recommendations/Card";
import { recommendationService } from "../services/recommendationService";
import { RecomendacionDetalleCard } from "../components/recommendations/RecomendacionDetalleCard";

const CATEGORIAS = [
  { id: 1, name: "Cursos" },
  { id: 2, name: "Docentes" }
];

export default function Recommendations() {
  const [categoriaId, setCategoriaId] = useState(1);
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = categoriaId === 1 
          ? await recommendationService.getCourseRecommendations() 
          : await recommendationService.getGeneralRecommendations();
        setData(res.recommendations || []);
      } catch (e) {
        console.error("Error cargando recomendaciones:", e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoriaId]);

  const scrollToItem = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const items = container.querySelectorAll('.recomendacion-item');
      if (items[index]) {
        const targetElement = items[index] as HTMLElement;
        container.scrollTo({
          top: targetElement.offsetTop - 120,
          behavior: "smooth"
        });
      }
    }
  };

  return (
    <div className="space-y-12 pb-20 animate-in fade-in duration-700">
      <header>
        <h1 className="text-6xl font-black text-white tracking-tighter uppercase leading-none">
          RECOMENDACIONES
        </h1>
        <p className="text-gray-500 font-bold text-[10px] uppercase tracking-[0.5em] mt-3 ml-1">
          ANÁLISIS POR IA· 3 RECOMENDACIONES EN CADA MOMENTO
        </p>
      </header>

      <div className="flex gap-6 max-w-sm">
        {CATEGORIAS.map(cat => (
          <Card 
            key={cat.id} 
            name={cat.name} 
            isSelected={categoriaId === cat.id} 
            onClick={() => setCategoriaId(cat.id)} 
          />
        ))}
      </div>

      <div className="relative glass-card rounded-[3rem] overflow-hidden flex flex-col lg:flex-row min-h-[580px] h-[580px] border border-white/10 backdrop-blur-md bg-white/[0.01] transition-all duration-500">
        
        <div className="w-full lg:w-[35%] border-r border-white/5 flex flex-col bg-white/[0.02]">
          <div className="p-10 pb-6 flex items-center gap-3 text-yellow-400/40 font-black text-[9px] uppercase tracking-[0.4em]">
            <Sparkles size={14} />
            <span>Recomendaciones - IA</span>
          </div>

          <div className="flex-1 overflow-y-auto p-10 pt-0 space-y-6 custom-scrollbar">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin text-yellow-400/50" /></div>
            ) : data.length > 0 ? (
              data.map((nombre, idx) => (
                <button 
                  key={idx} 
                  onClick={() => scrollToItem(idx)}
                  className="w-full text-left group transition-all"
                >
                  <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-relaxed group-hover:text-white transition-colors truncate">
                    {nombre}
                  </p>
                  <div className="h-[1px] w-6 bg-white/5 mt-4 group-hover:w-full group-hover:bg-yellow-400/30 transition-all duration-500" />
                </button>
              ))
            ) : (
              <div className="py-20 text-center opacity-20 flex flex-col items-center gap-4">
                <Inbox size={32} />
                <p className="text-[9px] font-black uppercase tracking-[0.3em]">Sin registros</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-transparent to-white/[0.03] relative">
          
          <div className="p-12 pb-8 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/40 backdrop-blur-md z-20">
            <div className="flex items-center gap-4">
              <div className="h-px w-8 bg-yellow-400/30" />
              <h2 className="text-sm font-black text-white uppercase tracking-[0.3em]">Detalle de Recomendaciones</h2>
            </div>
            
            {data.length > 0 && (
                <div className="px-4 py-1.5 bg-yellow-400/10 border border-yellow-400/20 rounded-full flex items-center gap-3">
                    <span className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.2em]">{data.length} Recomendaciones</span>
                    <ChevronDown size={12} className="text-yellow-400/50 animate-bounce" />
                </div>
            )}
          </div>

          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto px-12 pb-24 space-y-8 custom-scrollbar scroll-smooth"
          >
            {data.length > 0 ? (
              data.map((item, idx) => (
                <div 
                  key={idx} 
                  className="recomendacion-item animate-in fade-in slide-in-from-bottom-4 duration-700"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <RecomendacionDetalleCard 
                    tipo={categoriaId === 1 ? 'curso' : 'docente'}
                    titulo={item}
                  />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-10 border border-white/5 border-dashed rounded-[3rem] m-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">Procesando recomendaciones...</p>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-10" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.03); 
          border-radius: 20px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
          background: rgba(250, 204, 21, 0.15); 
        }
        .glass-card {
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
        }
      `}} />
    </div>
  );
}