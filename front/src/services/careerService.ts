
import api from "../api/axios"; 
import type { CareerAverage } from "../types/careeraverage";

export const careerService = {
  
  getCareerAverages: async (): Promise<CareerAverage[]> => {
    try {
      const response = await api.get<CareerAverage[]>("/academics/careers/");
      return response.data;
    } catch (error) {
      console.error("Error fetching career averages:", error);
      throw error;
    }
  },
};