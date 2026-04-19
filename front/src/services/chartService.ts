import api from "../api/axios";
import type { CourseChartPoint } from "../types/chartCourses";

export const chartService = {
  getCoursesEvolution: async (): Promise<CourseChartPoint[]> => {
    try {
      const response = await api.get("/courses/stats/");

      if (!response.data || response.data.length === 0) {
        return mockData();
      }

      return response.data;

    } catch (error) {
      return mockData();
    }
  }
};

const mockData = (): CourseChartPoint[] => [
  { name: "2024-2", calc1: 4.1, calc2: 4.0, ecuaciones: 4.2, software: 4.1 },
  { name: "2025-1", calc1: 4.2, calc2: 4.1, ecuaciones: 4.1, software: 4.2 },
  { name: "2025-2", calc1: 4.3, calc2: 4.2, ecuaciones: 4.0, software: 4.3 },
  { name: "2026-1", calc1: 4.4, calc2: 4.3, ecuaciones: 3.9, software: 4.5 },
];