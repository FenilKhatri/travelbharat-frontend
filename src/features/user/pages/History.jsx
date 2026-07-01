import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiClock, FiMapPin, FiBookOpen, FiSearch, FiMap, FiTrash2, FiActivity } from "react-icons/fi";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { historyService } from "../../../../services/historyService";
import PageLoader from "../../../../components/ui/PageLoader";
import H1 from "../../../../components/ui/H1";

const ActionConfig = {
  VIEW_PLACE: { icon: FiMapPin, color: "text-blue-500", bg: "bg-blue-500/10", label: "Viewed Place" },
  VIEW_CITY: { icon: FiMap, color: "text-indigo-500", bg: "bg-indigo-500/10", label: "Viewed City" },
  VIEW_STATE: { icon: FiMap, color: "text-purple-500", bg: "bg-purple-500/10", label: "Viewed State" },
  VIEW_FESTIVAL: { icon: FiActivity, color: "text-pink-500", bg: "bg-pink-500/10", label: "Viewed Festival" },
  VIEW_BLOG: { icon: FiBookOpen, color: "text-green-500", bg: "bg-green-500/10", label: "Read Blog" },
  SEARCH: { icon: FiSearch, color: "text-orange-500", bg: "bg-orange-500/10", label: "Searched" },
  PLAN_TRIP: { icon: FiMap, color: "text-red-500", bg: "bg-red-500/10", label: "Planned Trip" },
};

const History = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["userHistory"],
    queryFn: () => historyService.getMyHistory(50),
  });

  const clearMutation = useMutation({
    mutationFn: () => historyService.clearHistory(),
    onSuccess: () => {
      toast.success("History cleared successfully");
      queryClient.invalidateQueries(["userHistory"]);
    },
    onError: () => toast.error("Failed to clear history"),
  });

  const historyItems = data?.data?.data?.history || data?.data?.history || [];

  if (isLoading) {
    return <PageLoader message="Loading your activity history..." />;
  }

  const getLink = (item) => {
    switch (item.actionType) {
      case "VIEW_PLACE": return `/places/${item.entitySlug}`;
      case "VIEW_CITY": return `/cities/${item.entitySlug}`;
      case "VIEW_STATE": return `/states/${item.entitySlug}`;
      case "VIEW_FESTIVAL": return `/festivals/${item.entitySlug}`;
      case "VIEW_BLOG": return `/blogs/${item.entitySlug}`;
      case "SEARCH": return `/places?search=${encodeURIComponent(item.entityTitle)}`;
      case "PLAN_TRIP": return `/user/trips/${item.entityId}`;
      default: return "#";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 pt-30 pb-24 min-h-[80vh]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <FiClock className="text-[#E85D04]" size={32} />
          <H1 className="text-slate-900 dark:text-white mb-0">Activity History</H1>
        </div>
        
        {historyItems.length > 0 && (
          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your entire activity history?")) {
                clearMutation.mutate();
              }
            }}
            disabled={clearMutation.isPending}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <FiTrash2 />
            Clear History
          </button>
        )}
      </div>

      {historyItems.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiClock size={40} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No recent activity</h3>
          <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto mb-8">
            Start exploring destinations, reading blogs, and planning trips to build your history!
          </p>
          <Link 
            to="/places" 
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#E85D04] text-white font-bold rounded-xl shadow-lg shadow-[#E85D04]/20 hover:bg-[#D05203] transition-all"
          >
            Start Exploring
          </Link>
        </div>
      ) : (
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-8 space-y-8 pb-8">
          {historyItems.map((item) => {
            const config = ActionConfig[item.actionType] || ActionConfig.VIEW_PLACE;
            const Icon = config.icon;

            return (
              <div key={item._id} className="relative pl-8 md:pl-12">
                {/* Timeline Dot */}
                <div className={`absolute -left-4 top-1 w-8 h-8 rounded-full flex items-center justify-center border-4 border-slate-50 dark:border-[#050B14] ${config.bg} ${config.color}`}>
                  <Icon size={14} />
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                      {config.label}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  
                  <Link to={getLink(item)} className="block">
                    <h4 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#E85D04] transition-colors">
                      {item.actionType === "SEARCH" ? `"${item.entityTitle}"` : item.entityTitle}
                    </h4>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
