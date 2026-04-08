import NotificationsHeader from "../components/notifications/NotificationsHeader";
import StatsCards from "../components/notifications/StatsCards";
import Filters from "../components/notifications/Filters";
import NotificationsList from "../components/notifications/NotificationsList";

export default function NotificationsView() {
  return (
    <div className="relative z-0 space-y-10 animate-in fade-in duration-700">

      <NotificationsHeader />

      <StatsCards />

      <Filters />

      <NotificationsList />

    </div>
  );
}