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

  getCourses: async () => {
    try {
      const response = await api.get(`/academics/courses/`);
      return response.data.courses; 
    } catch (error) {
      console.error("Error fetching courses list:", error);
      return [];
    }
  }
};