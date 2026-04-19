import api from "../api/axios";
import type { TeacherTable } from "../types/teacherTable";

export const teacherService = {
  getTeachers: async (): Promise<TeacherTable[]> => {
    try {
      const response = await api.get<any[]>("/teachers/");

      if (!response.data || response.data.length === 0) {
        return mockTeachers();
      }

      return response.data.map((t) => ({
        id: t.id,
        name: t.name,
        courses: 3,
        score: 4.5,
        trend: "+0.3",
        isTrendUp: true,
        students: 120
      }));

    } catch (error) {
      return mockTeachers();
    }
  }
};

const mockTeachers = (): TeacherTable[] => [
  {
    id: 1,
    name: "Juan Pérez",
    courses: 3,
    score: 4.6,
    trend: "+0.2",
    isTrendUp: true,
    students: 120
  },
  {
    id: 2,
    name: "María López",
    courses: 2,
    score: 4.2,
    trend: "-0.1",
    isTrendUp: false,
    students: 98
  }
];