import api from "../api/axios";
import type { CourseTable } from "../types/courseTable";

export const courseService = {
  getCourses: async (): Promise<CourseTable[]> => {
    try {
      const response = await api.get<any[]>("/courses/");

      if (!response.data || response.data.length === 0) {
        return mockCourses();
      }

      return response.data.map((c) => ({
        id: c.id,
        name: c.name,
        code: c.code,
        category: "General",

        evaluations: 200,
        teachers: 5,
        avg: 4.2,
        trend: 0.3,
        rec: 85,
        teacher: "Docente asignado"
      }));

    } catch (error) {
      return mockCourses();
    }
  }
};

const mockCourses = (): CourseTable[] => [
  {
    id: 1,
    name: "Cálculo I",
    code: "MAT101",
    category: "Matemática",
    evaluations: 245,
    teachers: 6,
    avg: 2.3,
    trend: 0.2,
    rec: 88,
    teacher: "Dr. Carlos Méndez",
  },
  {
    id: 2,
    name: "Ecuaciones Diferenciales",
    code: "MAT201",
    category: "Matemática",
    evaluations: 156,
    teachers: 4,
    avg: 1.8,
    trend: -0.3,
    rec: 72,
    teacher: "Dra. Ana Rodríguez",
  },
  {
    id: 3,
    name: "Programación I",
    code: "INF101",
    category: "Informática",
    evaluations: 300,
    teachers: 7,
    avg: 4.7,
    trend: 0.5,
    rec: 92,
    teacher: "Ing. Luis Pérez",
  }
];