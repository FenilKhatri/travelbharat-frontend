import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiBell, FiCheckCircle, FiInfo, FiAlertCircle, FiTrash2, FiCheck, FiClock, FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import http from "../../lib/axios";
import { toast } from "react-toastify";
import Checkbox from "../ui/Checkbox";

const SharedNotifications = ({ endpoint, queryKey, title, subtitle, isAdmin = false }) => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const res = await http.get(endpoint);
      return res.data?.data || res.data;
    }
  });

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || notifications.filter(n => !n.read).length;

  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === notifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(notifications.map(n => n._id));
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} notifications?`)) return;

    setIsProcessingBulk(true);
    const results = await Promise.allSettled(
      selectedIds.map(id => http.delete(`${endpoint}/${id}`))
    );

    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      toast.error(`Failed to delete ${failed.length} notifications`);
    } else {
      toast.success(`Successfully deleted ${selectedIds.length} notifications`);
    }

    setSelectedIds([]);
    setIsProcessingBulk(false);
    queryClient.invalidateQueries([queryKey]);
  };

  const markAsReadMutation = useMutation({
    mutationFn: async (id) => {
      await http.put(`${endpoint}/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries([queryKey]);
    }
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      await http.put(`${endpoint}/read-all`);
    },
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries([queryKey]);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await http.delete(`${endpoint}/${id}`);
    },
    onSuccess: () => {
      toast.success("Notification deleted");
      queryClient.invalidateQueries([queryKey]);
    }
  });

  const getIcon = (type) => {
    switch (type) {
      case "success": return <FiCheckCircle className="text-emerald-500" size={24} />;
      case "error": return <FiAlertCircle className="text-red-500" size={24} />;
      case "warning": return <FiAlertCircle className="text-amber-500" size={24} />;
      case "system": return <FiInfo className="text-purple-500" size={24} />;
      case "info":
      default: return <FiInfo className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className={`space-y-6 pb-24 max-w-4xl mx-auto relative ${!isAdmin ? "px-4 pt-30" : ""}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2 flex items-center gap-3">
            {!isAdmin && <FiBell className="text-[#E85D04]" />}
            {title}
            {unreadCount > 0 && (
              <span className="bg-[#E85D04] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>
        </div>
        
        <div className="flex gap-2 items-center">
          {notifications.length > 0 && (
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none mr-4">
              <Checkbox 
                checked={selectedIds.length === notifications.length && notifications.length > 0} 
                onChange={toggleSelectAll} 
              />
              Select All
            </label>
          )}
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition cursor-pointer disabled:opacity-50"
            >
              <FiCheck size={16} />
              <span>Mark all as read</span>
            </button>
          )}
          {!isAdmin && (
            <Link to="/user/settings" className="p-2 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition cursor-pointer">
               <FiSettings size={20} />
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40 animate-pulse">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="p-6 flex gap-4">
                <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-full shrink-0" />
                <div className="space-y-2 w-full">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-red-500 font-bold">Failed to load notifications.</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <FiBell size={32} className="text-slate-300 dark:text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Notifications</h3>
            <p className="text-slate-400 text-sm mt-1">You're all caught up! No new alerts.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/40">
            {notifications.map((notif, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={notif._id || index}
                className={`p-5 md:p-6 flex gap-4 transition hover:bg-slate-50 dark:hover:bg-slate-900/50 relative cursor-pointer ${!notif.read ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''}`}
                onClick={() => toggleSelection(notif._id)}
              >
                <div className="shrink-0 pt-1" onClick={e => e.stopPropagation()}>
                  <Checkbox 
                    checked={selectedIds.includes(notif._id)} 
                    onChange={() => toggleSelection(notif._id)} 
                  />
                </div>
                <div className="shrink-0 pt-1">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0 pl-2">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <h4 className={`font-bold text-sm ${!notif.read ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                      <FiClock size={10} /> 
                      {new Date(notif.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-sm mt-1 mb-2 ${!notif.read ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-500 dark:text-slate-500'}`}>
                    {notif.message}
                  </p>
                  
                  {notif.link && (
                    <Link to={notif.link} className="inline-block text-xs font-bold text-[#E85D04] hover:underline cursor-pointer">
                       View Details
                    </Link>
                  )}
                </div>
                <div className="shrink-0 flex items-center gap-2 pl-2" onClick={e => e.stopPropagation()}>
                  {!notif.read && (
                    <button
                      onClick={() => markAsReadMutation.mutate(notif._id)}
                      title="Mark as read"
                      className="p-1.5 sm:p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition cursor-pointer"
                    >
                      <FiCheck size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(notif._id)}
                    title="Delete"
                    className="p-1.5 sm:p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white dark:bg-[#0c1018] backdrop-blur-xl rounded-full shadow-2xl border border-slate-200 dark:border-slate-800 p-2 flex items-center gap-4">
            <span className="pl-4 font-bold text-slate-700 dark:text-slate-200 text-sm">
              {selectedIds.length} selected
            </span>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={handleBulkDelete}
              disabled={isProcessingBulk}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiTrash2 />
              <span>Delete</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="pr-4 pl-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedNotifications;