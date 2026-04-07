import NotificationsHeader from "../components/notifications/NotificationsHeader";
import StatsCards from "../components/notifications/StatsCards";
import Filters from "../components/notifications/Filters";
import NotificationsList from "../components/notifications/NotificationsList";

export default function NotificationsView() {
  return (
    <div className="min-h-screen bg-[#0b1324] text-white p-6">

      <NotificationsHeader />

      <StatsCards />

      <Filters />

      <NotificationsList />

    </div>
  );
}