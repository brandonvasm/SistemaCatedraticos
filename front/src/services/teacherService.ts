import api from "../api/axios";
import type { Courses, TeacherStats } from "../types/teacher";


export const teacherService = {
  getTeachersStats: async (facultyId: number): Promise<TeacherStats[]> => {
    try {
      const response = await api.get(`/academics/teachers/stats/?faculty=${facultyId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas de docentes:", error);
      return [];
    }
  },

  getTeacherStats: async (id: string | number) => {
    try {
      const response = await api.get(`/academics/teachers/stats/${id}/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher stats:", error);
      throw error;
    }
  },

  getTeacherCourses: async (teacherId: string | number): Promise<Courses[]> => {
    try {
      const response = await api.get(`/academics/teachers/${teacherId}/courses/`);
      return response.data.courses || [];
    } catch (error) {
      console.error("Error fetching all teacher courses:", error);
      return [];
    }
  },

  getTeacherHistorical: async (teacherId: string | number, facultyId: number) => {
    try {
      const response = await api.get(`/academics/teachers/${teacherId}/historical/`, {
        params: { faculty: facultyId } 
      });
      return response.data;
    } catch (error) {
      console.error("Error en getTeacherHistorical:", error);
      throw error;
    }
  }

  

};