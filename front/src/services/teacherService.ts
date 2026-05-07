import api from "../api/axios";
import type { Courses, TeacherStatsResponse, TeacherProfileAnalysis } from "../types/teacher";


export const teacherService = {
  getTeachersStats: async (facultyId: number, page: number): Promise<TeacherStatsResponse> => {
  const response = await api.get(`/academics/teachers/stats/`, {
    params: { 
      faculty: facultyId, 
      page: page 
    }
  });
  return response.data;
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
  },

  getTeacherWorkload: async (facultyId: number) => {
    try {
      const response = await api.get(`/academics/teachers/workload/`, {
        params: { faculty: facultyId }
      });
      return response.data; 
    } catch (error) {
      console.error("Error en getTeacherWorkload:", error);
      throw error;
    }
  },

  getTeacherComments: async (id: string) => {
  const response = await api.get(`/academics/teachers/${id}/comments/`);
  return response.data; 
},

  getTeacherProfileAnalysis: async (id: string, semesterId: number): Promise<TeacherProfileAnalysis> => {
    const response = await api.get(`/analytics/teacher-profile-analysis/${id}/`, {
        params: {
            semester: semesterId
        }
    });
    return response.data;
},

  analyzeComments: async (teacherId: number, commentTexts: string[]): Promise<TeacherProfileAnalysis> => {
      const response = await api.post(`/analytics/teacher-comments-analysis/`, {
        teacher_id: teacherId,
        comments: commentTexts
      });
      return response.data;
},


  getGeneralRecommendations: async (): Promise<{ recommendations: string[] }> => {
    const response = await api.get(`/analytics/general-teacher-recommendations/`);
    return response.data;
  }



  

};