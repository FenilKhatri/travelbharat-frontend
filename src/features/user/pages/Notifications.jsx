import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiBell, FiCheck, FiTrash2, FiClock, FiSettings } from "react-icons/fi";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import { Link } from "react-router-dom";

const Notifications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["userNotifications"],
    queryFn: async () => {
      const res = await http.get("/notifications/user");
      return res.data?.data || res.data;
    },
  });

  const notifications = data?.notifications || [];

  const markReadMutation = useMutation({
    mutationFn: async (id) => {
      await http.put(`/notifications/user/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["userNotifications"]);
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      await http.put("/notifications/user/read-all");
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries(["userNotifications"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await http.delete(`/notifications/user/${id}`);
    },
    onSuccess: () => {
      toast.success("Notification deleted");
      queryClient.invalidateQueries(["userNotifications"]);
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 pt-30 pb-24 min-h-[80vh]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <FiBell className="text-[#E85D04]" /> Notifications
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Stay updated with your trips and platform activities.
          </p>
        </div>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <button
              onClick={() => markAllReadMutation.mutate()}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition cursor-pointer"
            >
              Mark all read
            </button>
          )}
          <Link to="/user/settings" className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer">
             <FiSettings size={20} />
          </Link>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-4 border-[#E85D04] border-t-transparent rounded-full mx-auto mb-4" />
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
               <FiBell size={24} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No Notifications</h3>
            <p className="text-slate-500">You're all caught up! When you receive notifications, they will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {notifications.map((notif, index) => (
              <div
                key={notif._id || index}
                className={`p-5 md:p-6 flex items-start gap-4 transition hover:bg-slate-50 dark:hover:bg-slate-800/20 ${!notif.read ? "bg-slate-50/50 dark:bg-slate-800/10" : ""}`}
              >
                {/* Icon based on type */}
                <div className={`p-2.5 rounded-full shrink-0 ${
                  notif.type === "success" ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" :
                  notif.type === "warning" ? "bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" :
                  notif.type === "error" ? "bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400" :
                  notif.type === "system" ? "bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" :
                  "bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                }`}>
                  <FiBell size={18} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`text-base font-bold truncate ${!notif.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}>
                      {notif.title}
                    </h4>
                    <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <FiClock size={10} /> 
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm mb-3 ${!notif.read ? "text-slate-700 dark:text-slate-400 font-medium" : "text-slate-500 dark:text-slate-500"}`}>
                    {notif.message}
                  </p>
                  
                  {notif.link && (
                    <Link to={notif.link} className="inline-block text-xs font-bold text-[#E85D04] hover:underline mb-2">
                       View Details
                    </Link>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition md:opacity-100">
                  {!notif.read && (
                    <button
                      onClick={() => markReadMutation.mutate(notif._id)}
                      title="Mark as read"
                      className="p-2 text-slate-400 hover:text-[#E85D04] hover:bg-[#E85D04]/10 rounded-lg transition"
                    >
                      <FiCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(notif._id)}
                    title="Delete notification"
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
