import api from "../api/axios";
import type { TeacherStats } from "../types/teacher";


export const teacherService = {
  getTeachersStats: async (facultyId: number): Promise<TeacherStats[]> => {
    try {
      const response = await api.get(`/academics/teachers/stats/?faculty=${facultyId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas de docentes:", error);
      return [];
    }
  }
};