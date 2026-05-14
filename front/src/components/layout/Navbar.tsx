import { useState, useEffect, useRef } from "react";
import {
  Bell,
  Download,
  Search,
  School,
  CalendarDays,
  User,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { semesterService } from "../../services/semesterService";
import { teacherService } from "../../services/teacherService";
import { courseService } from "../../services/courseService";
import ExportModal from "../common/ExportModal";
import NotificationsDrawer from "../notifications/NotificationsDrawer";
import CloseSemesterModal from "../common/CloseSemesterModal";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [semester, setSemester] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    semesterService
      .getCurrentSemester()
      .then(setSemester)
      .catch((err) => console.error("Error cargando semestre", err));
  }, []);

  useEffect(() => {
    const fetchSearch = async () => {
      if (!search.trim()) {
        setResults([]);
        return;
      }

      try {
        setLoadingSearch(true);
        const teacherResponse = await teacherService.getTeachersStats(
          user?.faculty_id,
          1
        );
        const teachers = teacherResponse.teachers || [];
        const courseResponse = await courseService.getCourses(1, 100);
        const courses = courseResponse.results || [];

        const teacherMatches = teachers
          .filter((t: any) =>
            t.teacher_name?.toLowerCase().includes(search.toLowerCase())
          )
          .map((t: any) => ({
            id: t.teacher_id,
            name: t.teacher_name,
            type: "teacher",
          }));

        const courseMatches = courses
          .filter((c: any) =>
            c.name?.toLowerCase().includes(search.toLowerCase())
          )
          .map((c: any) => ({
            id: c.id,
            name: c.name,
            type: "course",
          }));

        setResults([...teacherMatches, ...courseMatches]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSearch(false);
      }
    };

    const timeout = setTimeout(fetchSearch, 400);
    return () => clearTimeout(timeout);
  }, [search, user]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentFacultad = user?.faculty_name || "Sin Facultad";
  const userRole = user?.role || "Personal";

  return (
    <>
      <nav className="fixed top-0 right-0 left-64 h-20 flex items-center justify-between px-10 bg-transparent border-b border-white/5 z-[40]">
        
        <div ref={searchRef} className="flex-1 flex justify-center max-w-xl relative">
          <div className="relative w-full group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-yellow-400 transition-colors"
              size={16}
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowResults(true);
              }}
              placeholder="BUSCAR DOCENTE O CURSO..."
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-12 pr-12 py-2.5 text-[9px] font-bold uppercase tracking-[0.15em] outline-none focus:border-yellow-400/20 transition-all text-white backdrop-blur-md"
            />

            {loadingSearch && (
              <Loader2
                size={14}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-yellow-400 animate-spin"
              />
            )}

            {showResults && search.trim() && (
              <div className="absolute top-14 left-0 w-full bg-[#11141d]/95 border border-white/10 rounded-3xl backdrop-blur-2xl shadow-2xl overflow-hidden z-[100]">
                {results.length > 0 ? (
                  <div className="max-h-[350px] overflow-y-auto p-2">
                    {results.map((item, index) => (
                      <button
                        key={`${item.type}-${item.id}-${index}`}
                        onClick={() => {
                          setShowResults(false);
                          setSearch("");
                          navigate(`/${item.type === "teacher" ? "docentes" : "cursos"}/${item.id}`);
                        }}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all text-left group"
                      >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                          item.type === "teacher" ? "bg-yellow-400/10 text-yellow-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {item.type === "teacher" ? <User size={18} /> : <BookOpen size={18} />}
                        </div>
                        <div>
                          <p className="text-white text-[11px] font-black uppercase tracking-wide">{item.name}</p>
                          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mt-1">
                            {item.type === "teacher" ? "Docente" : "Curso"}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center">
                    <p className="text-white text-xs font-black uppercase tracking-widest">Sin resultados</p>
                    <p className="text-gray-500 text-[10px] mt-2 uppercase">No se encontraron coincidencias</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 px-4 py-2.5 bg-white/[0.05] border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-xl">
            <School size={12} className="text-yellow-400" />
            <span>{currentFacultad}</span>
          </div>

          <button
            onClick={() => setIsCloseModalOpen(true)}
            className="group relative flex items-center gap-4 px-5 py-2 bg-white/[0.03] border border-white/10 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white backdrop-blur-xl hover:border-red-500/30 transition-all active:scale-95"
          >
            <div className="flex flex-col items-start leading-none gap-1">
              <span className="text-[7px] text-gray-500 group-hover:text-red-400 transition-colors uppercase">
                Semestre Actual
              </span>
              <span className="flex items-center gap-2">
                <CalendarDays size={15} className="text-yellow-400" />
                {semester ? `${semester.year}-${semester.number}` : "Cargando..."}
              </span>
            </div>
          </button>

          <button
            onClick={() => setIsExportOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-yellow-500 transition-all shadow-lg shadow-yellow-400/10"
          >
            <Download size={12} /> EXPORTAR
          </button>

          <div onClick={() => setIsNotificationsOpen(true)} className="relative cursor-pointer group p-1.5 ml-2">
            <Bell size={20} className="text-gray-400 group-hover:text-white transition-colors" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0b101f]" />
          </div>

          <div className="flex items-center gap-4 pl-6 border-l border-white/10">
            <div className="text-right">
              <p className="text-white text-[10px] font-black tracking-tight leading-none uppercase">
                {user?.username || "Usuario"}
              </p>
              <p className="text-yellow-400/70 text-[8px] uppercase font-bold tracking-[0.2em] mt-1 italic">
                {userRole}
              </p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-300 to-yellow-600 text-black flex items-center justify-center font-black text-xs shadow-xl">
              {(user?.username || "U").substring(0, 2).toUpperCase()}
            </div>
          </div>
        </div>
      </nav>

      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <NotificationsDrawer isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />
      <CloseSemesterModal isOpen={isCloseModalOpen} onClose={() => setIsCloseModalOpen(false)} currentSemester={semester} />
    </>
  );
}