import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiBell } from "react-icons/fi";
import { notificationService } from "../../services/notificationService";

const NotificationBell = () => {
  const { data } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: () => notificationService.getAdminNotifications(),
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  const unreadCount = data?.data?.unreadCount || 0;

  return (
    <Link 
      to="/admin/notifications" 
      className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
      title="Notifications"
    >
      <FiBell size={18} />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#E85D04] text-white text-[9px] font-bold flex items-center justify-center shadow-sm">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationBell;
