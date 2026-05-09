import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Courses } from "../../types/teacher";

interface Props {
  courses: Courses[];
  isLoading: boolean;
}

export default function CoursesList({ courses, isLoading }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showControls, setShowControls] = useState({ left: false, right: false });

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowControls({
        left: scrollLeft > 10,
        right: scrollLeft < scrollWidth - clientWidth - 10,
      });
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [courses, isLoading]);

  if (isLoading) {
    return (
      <div className="p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl">
        <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">CURSOS</h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 animate-pulse">
          Sincronizando registros...
        </p>
      </div>
    );
  }

  const getStatus = (score: number) => {
    if (score >= 85) return { label: "Excelente", color: "text-emerald-400" };
    if (score >= 70) return { label: "Bueno", color: "text-blue-400" };
    return { label: "Bajo", color: "text-red-400" };
  };

  return (
    <div className="p-8 rounded-[2.5rem] backdrop-blur-2xl shadow-xl relative overflow-hidden">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase leading-none">
            CURSOS
          </h2>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em] mt-3 ml-1">
            DESEMPEÑO POR CURSO
          </p>
        </div>

        <div className="flex gap-1 mb-1">
          <button
            onClick={() => scroll("left")}
            className={`p-2 transition-all ${showControls.left ? "text-white opacity-100 hover:scale-110" : "text-white/10 opacity-0 pointer-events-none"}`}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 transition-all ${showControls.right ? "text-white opacity-100 hover:scale-110" : "text-white/10 opacity-0 pointer-events-none"}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto gap-5 pb-4 no-scrollbar snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {courses.length > 0 ? (
          courses.map((course) => {
            const status = getStatus(course.score);

            return (
              <div
                key={course.id}
                className="
                  min-w-[300px] sm:min-w-[340px] snap-start
                  bg-[#0f111a]/50
                  border border-white/10
                  p-5
                  rounded-2xl
                  hover:bg-white/[0.05]
                  hover:border-white/20
                  transition-all
                  group
                "
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.4em]">
                    CURSO
                  </p>
                  <span className="text-[8px] text-white/20 font-bold uppercase">{course.code}</span>
                </div>

                <p className="text-white font-black text-[13px] uppercase tracking-wide group-hover:text-yellow-400 transition-colors line-clamp-2 min-h-[32px]">
                  {course.name}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <span className="text-yellow-400 font-black text-xl">
                    {course.score.toFixed(1)}
                  </span>

                  <span className={`text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="w-full py-10 text-center border border-dashed border-white/10 rounded-3xl">
             <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">
               No hay cursos registrados en el historial
             </p>
          </div>
        )}
      </div>
    </div>
  );
}