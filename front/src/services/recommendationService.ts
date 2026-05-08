import api from "../api/axios";
import type { RawRecommendationResponse } from "../types/recommendations";

export const recommendationService = {
  getGeneralRecommendations: async (): Promise<RawRecommendationResponse> => {
    const response = await api.get(`/analytics/general-teacher-recommendations/`);
    return response.data;
  },

  getCourseRecommendations: async (): Promise<RawRecommendationResponse> => {
    const response = await api.get(`/analytics/general-course-recommendations/`);
    return response.data;
  }
};