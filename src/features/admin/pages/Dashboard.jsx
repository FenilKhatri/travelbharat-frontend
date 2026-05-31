import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiUsers, FiMap, FiMapPin, FiStar, FiMail, FiInbox, FiTrendingUp, FiClock, FiCalendar, FiX, FiSend } from "react-icons/fi";
import http from "../../../lib/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

const Dashboard = () => {
  const navigate = useNavigate();
  // Fetch stats using React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const response = await http.get("/admin/dashboard");
      return response.data; // Response data has successResponse shape
    },
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });

  // Newsletter state
  const [isNewsletterModalOpen, setNewsletterModalOpen] = useState(false);
  const [newsletterForm, setNewsletterForm] = useState({ subject: "", content: "" });

  const broadcastMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await http.post("/newsletter/admin/broadcast", payload);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Newsletter broadcasted successfully!");
      setNewsletterModalOpen(false);
      setNewsletterForm({ subject: "", content: "" });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to broadcast newsletter");
    }
  });

  const handleBroadcastSubmit = (e) => {
    e.preventDefault();
    broadcastMutation.mutate(newsletterForm);
  };

  const dashboardData = data || {};
  const stats = dashboardData.stats || {};
  const recentInquiries = dashboardData.recentInquiries || [];
  const topPlaces = dashboardData.topPlaces || [];
  const userGrowth = dashboardData.userGrowth || [];

  // Format month helpers
  const getMonthName = (monthNum) => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months[monthNum - 1] || "";
  };

  // Stat Card Configs
  const cardConfigs = [
    {
      title: "Total Users",
      value: stats.totalUsers ?? 0,
      sub: `${stats.recentUsers ?? 0} registered recently`,
      icon: FiUsers,
      color: "from-blue-500 to-indigo-600",
      bg: "bg-blue-500/10"
    },
    {
      title: "Total States",
      value: stats.totalStates ?? 0,
      sub: "Explore India State by State",
      icon: FiMap,
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-500/10"
    },
    {
      title: "Destinations",
      value: stats.totalPlaces ?? 0,
      sub: `${stats.totalCities ?? 0} cities mapped`,
      icon: FiMapPin,
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Reviews & Ratings",
      value: stats.totalReviews ?? 0,
      sub: `${stats.pendingReviews ?? 0} reviews pending approval`,
      icon: FiStar,
      color: "from-pink-500 to-rose-600",
      bg: "bg-pink-500/10"
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Stat Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>

        {/* content grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-96 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 dark:border-red-500/20 rounded-2xl p-8 max-w-xl mx-auto">
        <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error Loading Dashboard</h3>
        <p className="text-slate-600 dark:text-slate-400 text-center">{error?.message || "Failed to load dashboard statistics from backend API."}</p>
      </div>
    );
  }

  // Calculate highest count for visual scaling of growth chart
  const maxGrowthCount = Math.max(...userGrowth.map((g) => g.count), 1);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Dashboard Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time overview of TravelBharat platform operations, users, and content guides.</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cardConfigs.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 p-6 rounded-2xl shadow-sm hover:shadow-md transition group duration-200 relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-xl ${card.bg} text-slate-700 dark:text-slate-300 shrink-0 group-hover:scale-110 transition duration-300`}>
                  <Icon size={22} className="text-[#E85D04]" />
                </div>
              </div>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {card.sub}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* ANALYTICS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* User Growth Visual Representation */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 p-6 sm:p-8 rounded-2xl shadow-sm space-y-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">User Growth Chart</h3>
              <p className="text-xs text-slate-400">Monthly registrations tracking</p>
            </div>
            <div className="flex items-center gap-1 text-[#E85D04] text-xs font-bold bg-[#E85D04]/10 px-2.5 py-1 rounded-full">
              <FiTrendingUp size={14} />
              <span>SaaS Analytics</span>
            </div>
          </div>

          {/* Simple Visual Bar Chart */}
          <div className="h-64 flex items-end gap-3 sm:gap-6 pt-4 border-b border-slate-100 dark:border-slate-850 px-2">
            {userGrowth.length > 0 ? (
              [...userGrowth].reverse().map((dataItem, idx) => {
                const heightPercent = (dataItem.count / maxGrowthCount) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    {/* Tooltip */}
                    <span className="opacity-0 group-hover:opacity-100 bg-slate-800 dark:bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md mb-2 transition duration-250 absolute transform -translate-y-16">
                      {dataItem.count} users
                    </span>
                    <div 
                      className="w-full bg-gradient-to-t from-[#E85D04] to-[#FF9E00] rounded-t-lg group-hover:brightness-110 transition-all duration-300"
                      style={{ height: `${Math.max(heightPercent, 8)}%` }}
                    />
                    <span className="text-[10px] sm:text-xs font-bold text-slate-400 mt-2.5">
                      {getMonthName(dataItem._id.month)}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <FiClock size={36} className="mb-2 text-slate-350" />
                <span className="text-sm font-semibold">No registration data found</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Top Rated Places Panel */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 p-6 rounded-2xl shadow-sm flex flex-col"
        >
          <div className="mb-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Top Rated Places</h3>
            <p className="text-xs text-slate-400">Popular tourist spots rated by travelers</p>
          </div>

          <div className="flex-1 space-y-4">
            {topPlaces.length > 0 ? (
              topPlaces.map((place) => (
                <div key={place._id} className="flex items-center gap-3.5 pb-3.5 border-b border-slate-100 dark:border-slate-800/30 last:border-b-0 last:pb-0">
                  {place.images?.thumbnail ? (
                    <img
                      src={place.images.thumbnail}
                      alt={place.name}
                      className="w-11 h-11 rounded-lg object-cover bg-slate-100 shrink-0"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                      <FiMapPin size={18} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 truncate hover:text-[#E85D04] transition">
                      <Link to={`/places/${place.slug}`}>{place.name}</Link>
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                      <div className="flex items-center gap-0.5 text-amber-500 font-bold">
                        <FiStar size={12} className="fill-amber-500" />
                        <span>{place.rating?.toFixed(1) || "0.0"}</span>
                      </div>
                      <span>•</span>
                      <span>{place.reviewCount ?? 0} reviews</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-8 text-slate-400 text-center">
                <FiMapPin size={32} className="mb-2 text-slate-300" />
                <span className="text-sm font-semibold">No destinations registered</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* RECENT INQUIRIES & PLATFORM NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Support Inquiries Table */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-2 bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 p-6 rounded-2xl shadow-sm space-y-5"
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Support Inquiries</h3>
              <p className="text-xs text-slate-400">Queries submitted via contact forms</p>
            </div>
            <Link 
              to="/admin/settings" 
              className="text-xs font-bold text-[#E85D04] hover:underline"
            >
              Manage Inquiries
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800/50 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Subject</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 text-right">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm text-slate-650 dark:text-slate-350">
                {recentInquiries.length > 0 ? (
                  recentInquiries.map((inquiry) => (
                    <tr key={inquiry._id} onClick={() => navigate(`/admin/contact/${inquiry._id}`)} className="hover:bg-slate-50/50 dark:hover:bg-slate-900 transition cursor-pointer">
                      <td className="py-3 pr-4 font-bold text-slate-800 dark:text-slate-200">
                        {inquiry.name}
                        <span className="block text-[10px] font-normal text-slate-400">{inquiry.email}</span>
                      </td>
                      <td className="py-3 pr-4 max-w-[200px] truncate">{inquiry.subject}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inquiry.status === "new" 
                            ? "bg-red-500/10 text-red-650 dark:text-red-400" 
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                        }`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td className="py-3 text-right text-xs text-slate-400">
                        {new Date(inquiry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400 font-semibold">
                      No support inquiries found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Newsletter Subscribers Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 p-6 rounded-2xl shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-orange-500/10 text-[#E85D04] w-12 h-12 flex items-center justify-center">
              <FiMail size={22} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Newsletter Subscriptions</h4>
              <p className="text-xs text-slate-400 mt-0.5">Explore marketing & reach</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800/40">
              <div className="flex justify-between items-center text-sm font-semibold">
                <span className="text-slate-500 dark:text-slate-400">Active Subscribers</span>
                <span className="text-slate-900 dark:text-white text-base font-black">{stats.totalSubscribers ?? 0}</span>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <button 
              onClick={() => setNewsletterModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-xs transition duration-200 cursor-pointer"
            >
              <FiSend size={16} />
              <span>Broadcast Newsletter</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Newsletter Modal */}
      {isNewsletterModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/40 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Broadcast Newsletter</h3>
                <p className="text-xs text-slate-400">Send an email to all active subscribers</p>
              </div>
              <button onClick={() => setNewsletterModalOpen(false)} className="p-1 rounded-full text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Subject</label>
                <input
                  type="text"
                  required
                  value={newsletterForm.subject}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, subject: e.target.value })}
                  placeholder="e.g. Explore the new destinations in Gujarat!"
                  className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Email Content</label>
                <textarea
                  required
                  rows={6}
                  value={newsletterForm.content}
                  onChange={(e) => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                  placeholder="Write your newsletter content here... HTML tags will be escaped but line breaks will be preserved."
                  className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setNewsletterModalOpen(false)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-350 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcastMutation.isLoading}
                  className="flex items-center gap-2 px-5 py-2 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <FiSend size={16} />
                  <span>{broadcastMutation.isLoading ? "Sending..." : "Send Broadcast"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default Dashboard;
