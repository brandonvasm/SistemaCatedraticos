export interface TeacherStats {
  teacher_id: number;
  teacher_name: string;
  cursos_impartidos: string[];
  promedio_general: number;
  tendencia_mejora: string;
  evaluaciones_total: number;
  recomendado_vs_otros: string;
  faculty_id: number;
}

export interface PaginatedTeacherStats {
  count: number;
  next: string | null;
  previous: string | null;
  results: TeacherStats[];
}

export interface TeacherStatsResponse {
  count: number;
  teachers: TeacherStats[];          
  teachers_paginated: TeacherStats[]; 
  promedio_global_facultad: number;   
}

export interface TeacherRowProps {
  teacher: TeacherStats;
}

export interface Courses {
  id: number;
  code: string;
  name: string;
  credits: number;
  score: number;      
  trend: string | null; 
  category?: string;
}

export interface CommentData {
  id: number;
  text: string;
  rating: number;
  sentiment: "good" | "bad" | "neutral";
  date: string;
}

export interface TeacherProfileAnalysis {
  id: number;
  ai_score: number; 
  comment_overview: string; 
  comment?: string; 
  model_version: string;
  perception: "positive" | "negative" | "neutral" | string;
  positive_percentage: number; 
  negative_percentage: number; 
  neutral_percentage: number;  
  created_at: string;
  teacher: number;
  semester: number;
}