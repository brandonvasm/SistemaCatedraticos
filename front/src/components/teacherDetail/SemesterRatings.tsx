import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { teacherService } from "../../services/teacherService";
import { useAuth } from "../../context/AuthContext"; 

export default function SemesterRatings() {
  const { id } = useParams();
  const { user } = useAuth(); 
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const facultyId = user?.faculty_id;

      if (id && facultyId) {
        try {
          const data = await teacherService.getTeacherHistorical(id, facultyId);
          setHistory(data);
        } catch (error) {
          console.error("Error al cargar historial");
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [id, user]);

  if (loading) return (
    <div className="p-8 text-center animate-pulse text-gray-500 uppercase text-[10px] tracking-widest">
      Cargando historial de semestres...
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
          Calificación por Semestre
        </h2>
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] mt-2">
          Evolución del rendimiento académico
        </p>
      </div>

      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((d, index) => (
            <div key={index} className="bg-white/[0.03] border border-white/10 p-4 rounded-2xl hover:bg-white/[0.05] transition-all">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-400 font-bold uppercase">{d.semester_label}</span>
                  {d.is_current && (
                    <span className="bg-emerald-400/10 text-emerald-400 text-[8px] px-2 py-0.5 rounded-full border border-emerald-400/20 font-black uppercase">
                      Actual
                    </span>
                  )}
                </div>
                <span className="text-lg font-black text-white">
                  {(d.avg_score || 0).toFixed(2)}
                </span>
              </div>
              
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-1000 ${d.avg_score >= 4 ? 'bg-emerald-400' : 'bg-red-400'}`}
                  style={{ width: `${(d.avg_score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center border border-dashed border-white/10 rounded-2xl">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
              No hay datos históricos para esta facultad
            </p>
          </div>
        )}
      </div>
    </div>
  );
}