import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TeacherCardDetail from "./TeacherCardDetail";
import { courseService } from "../../services/courseService";

export default function TeachersList({ courseId }: { courseId?: string }) {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
    const fetchTeachers = async () => {
      if (!courseId) return;
      try {
        setLoading(true);
        const data = await courseService.getCourseTeachersStats(courseId);
        setTeachers(data);
      } catch (error) {
        console.error("Error al cargar lista de docentes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeachers();
  }, [courseId]);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [teachers, loading]);

  return (
    <div
      className="
        relative
        bg-white/[0.02]
        border border-white/5
        p-6
        rounded-[2rem]
        backdrop-blur-2xl
        shadow-xl
        overflow-hidden
        h-full
      "
    >
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-400/[0.03] blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

      <div className="mb-5 flex justify-between items-end relative z-10">
        <div>
          <h2 className="text-sm font-black text-white tracking-tight uppercase">
            Docentes Asignados
          </h2>
          <p className="text-[11px] text-gray-500 uppercase tracking-wider">
            {loading ? "Sincronizando con el servidor..." : "Docentes vinculados al curso "}
          </p>
        </div>

        <div className="flex gap-1 mb-1">
          <button
            onClick={() => scroll("left")}
            className={`p-2 transition-all ${showControls.left ? "text-white opacity-100 hover:scale-110" : "text-white/10 opacity-0 pointer-events-none"}`}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className={`p-2 transition-all ${showControls.right ? "text-white opacity-100 hover:scale-110" : "text-white/10 opacity-0 pointer-events-none"}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex overflow-x-auto gap-4 pb-2 no-scrollbar snap-x relative z-10"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {teachers.length > 0 ? (
          teachers.map((t) => (
            <div key={t.teacher_id} className="min-w-[280px] snap-start">
              <TeacherCardDetail teacher={t} />
            </div>
          ))
        ) : !loading && (
          <div className="w-full flex flex-col items-center justify-center py-10 opacity-40">
            <p className="text-[10px] text-white font-black uppercase tracking-widest">
              No se encontraron docentes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}