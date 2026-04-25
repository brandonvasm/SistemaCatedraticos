export interface TeacherStats {
  teacher_id: number;
  teacher_name: string;
  cursos_impartidos: string[];
  promedio_general: number;
  tendencia_mejora: string;
  evaluaciones_total: number;
  recomendado_vs_otros: string;
}

export interface TeacherRowProps {
  teacher: TeacherStats;
}