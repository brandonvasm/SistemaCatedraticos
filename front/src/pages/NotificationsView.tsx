import { useState, useEffect } from "react";
import { notificationService } from "../services/notificationService";
import type { NotificationPayload } from "../types/notification";
import NotificationsHeader from "../components/notifications/NotificationsHeader";
import StatsCards from "../components/notifications/StatsCards";
import NotificationsList from "../components/notifications/NotificationsList";

export default function NotificationsView() {
  const [notifications, setNotifications] = useState<NotificationPayload[]>([]);

  const loadData = async () => {
    const data = await notificationService.getNotifications();
    setNotifications(data);
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: number) => {
    await notificationService.deleteNotification(id);
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative z-0 space-y-10 animate-in fade-in duration-700">
      <NotificationsHeader />
      <StatsCards notifications={notifications} />
      <NotificationsList notifications={notifications} onDelete={handleDelete} />
    </div>
  );
}

