export interface NotificationPayload {
  id: number;
  subject: string;
  message: string;
  focus: string;
  type: "warning" | "success" | "error" | "info";
  user: number;
}

export type CreateNotificationPayload = Omit<NotificationPayload, "id">;