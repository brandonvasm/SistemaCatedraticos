import api from "../api/axios";
import type { CreateNotificationPayload } from "../types/notification";


export const notificationService = {
  createNotification: async (notification: CreateNotificationPayload): Promise<void> => {
    try {
      await api.post(`/reports/notifications/`, notification);
    } catch (error) {
      console.error("Error al crear notificación:", error);
      throw error;
    }
  },

  getNotifications: async () => {
    try {
      const response = await api.get(`/reports/notifications/`);
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  deleteNotification: async (id: number): Promise<void> => {
    await api.delete(`/reports/notifications/${id}/`);
  }

};