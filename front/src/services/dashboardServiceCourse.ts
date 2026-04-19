import api from "../api/axios";
import type { DashboardStatsCourses } from "../types/dashboardCourses";

export const dashboardService = {
  getStats: async (): Promise<DashboardStatsCourses> => {
    try {
      const response = await api.get("/dashboard/stats/");

      return {
        totalCourses: response.data.total_courses,
        globalAverage: response.data.global_average
      };

    } catch (error) {
      return {
        totalCourses: 6,
        globalAverage: 4.1
      };
    }
  }
};