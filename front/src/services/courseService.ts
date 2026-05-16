import api from "../api/axios";

export const courseService = {
  getTopCourses: async (facultyId: number, semesterId: number) => {
    try {
      const response = await api.get(`/academics/courses/top/`, {
        params: { 
          faculty: facultyId, 
          semester: semesterId 
        }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top courses:", error);
      return [];
    }
  },

  getCourses: async (page = 1, pageSize = 8) => {
  try {
    const response = await api.get(`/academics/courses/`, {
      params: { 
        page,
        page_size: pageSize 
      }
    });
    
    return response.data; 
  } catch (error) {
    console.error("Error fetching courses list:", error);
    return { count: 0, results: [] };
  }
},

  getCourseDetail: async (id: string | number) => {
    try {
      const response = await api.get(`/academics/courses/${id}/`);
      return response.data; 
    } catch (error) {
      console.error("Error al obtener detalle del curso:", error);
      throw error;
    }
  },

  getCourseTeachersStats: async (courseId: string | number) => {
    try {
      const response = await api.get(`/academics/courses/${courseId}/teachers-stats/`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener stats de docentes:", error);
      return []; 
    }
  },


};