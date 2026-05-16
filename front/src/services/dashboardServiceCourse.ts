import api from "../api/axios";

export const dashboardService = {
  getStats: async () => {
    try {
      const response = await api.get(`/academics/courses/`);
      const courses = response.data.courses || [];
      
      const totalCourses = response.data.total || courses.length;
      
      const sumScores = courses.reduce((acc: number, course: any) => acc + (course.score || 0), 0);
      const globalAverage = totalCourses > 0 ? (sumScores / totalCourses).toFixed(2) : "0.00";

      return {
        totalCourses,
        globalAverage: parseFloat(globalAverage)
      };
    } catch (error) {
      console.error("Error al calcular estadísticas:", error);
      return { totalCourses: 0, globalAverage: 0 };
    }
  }
};