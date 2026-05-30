import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FiStar, FiCheck, FiX, FiTrash2, FiMessageSquare, FiChevronLeft, FiChevronRight, FiMapPin, FiUser, FiClock } from "react-icons/fi";
import http from "../../../lib/axios";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import { toast } from "react-toastify";

const Reviews = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Moderation state
  const [responseModal, setResponseModal] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  // URL parameters
  const page = parseInt(searchParams.get("page") || "1");
  const statusFilter = searchParams.get("status") || "";

  // Query reviews
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminReviews", page, statusFilter],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;

      const response = await http.get("/reviews/admin/all", { params });
      return response.data;
    },
    keepPreviousData: true
  });

  const responseData = data?.data || {};
  const reviews = responseData.reviews || [];
  const pagination = responseData.pagination || { total: 0, pages: 1 };

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.put(`/reviews/admin/approve/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review approved successfully!");
      queryClient.invalidateQueries(["adminReviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Approval failed");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.put(`/reviews/admin/reject/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review rejected & hidden.");
      queryClient.invalidateQueries(["adminReviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Rejection failed");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/reviews/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review deleted permanently!");
      setConfirmDelete(null);
      queryClient.invalidateQueries(["adminReviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Deletion failed");
    }
  });

  const respondMutation = useMutation({
    mutationFn: async ({ id, text }) => {
      const response = await http.put(`/reviews/admin/respond/${id}`, { adminResponse: text });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Response posted successfully!");
      setResponseModal(null);
      setAdminReplyText("");
      queryClient.invalidateQueries(["adminReviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to post reply");
    }
  });

  const handleRespondClick = (review) => {
    setResponseModal(review);
    setAdminReplyText(review.adminResponse || "");
  };

  const handleRespondSubmit = (e) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    respondMutation.mutate({ id: responseModal._id, text: adminReplyText.trim() });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const filters = [
    {
      key: "status",
      label: "Moderation State",
      options: [
        { value: "pending", label: "Awaiting Approval" },
        { value: "approved", label: "Approved" }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Review Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Approve, reject, respond to user feedback, and moderate rating metrics for destinations.</p>
      </div>

      {/* Filter toolbar */}
      <SearchAndFilter
        searchPlaceholder="Filter items..."
        filters={filters}
      />

      {/* List Card */}
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-55/40 dark:bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                <th className="py-4 px-6">Traveler / Date</th>
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Feedback / Comments</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm text-slate-655 dark:text-slate-350">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-1">
                          <div className="w-20 h-3.5 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="w-28 h-2.5 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-44 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="py-4 px-6 text-right"><div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-red-500 font-bold">
                    Error loading reviews: {error?.message}
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-semibold">
                    <FiStar size={36} className="mx-auto mb-3 text-slate-300" />
                    No traveler reviews found under selected criteria.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/5 transition">
                    
                    {/* User profile */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2.5">
                        {review.userId?.profileImage ? (
                          <img
                            src={review.userId.profileImage}
                            alt={review.userId.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-850"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-[10px] font-bold flex items-center justify-center shrink-0">
                            {review.userId?.name ? review.userId.name[0].toUpperCase() : <FiUser />}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate max-w-[120px]">{review.userId?.name || "Guest Traveler"}</p>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <FiClock size={10} />
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Place Destination */}
                    <td className="py-4 px-6 font-semibold">
                      <div className="flex items-center gap-1.5 text-xs">
                        <FiMapPin className="text-[#E85D04] shrink-0" size={14} />
                        <span className="truncate max-w-[150px]">{review.placeId?.name || "Deleted Destination"}</span>
                      </div>
                    </td>

                    {/* Comments */}
                    <td className="py-4 px-6">
                      <div className="max-w-[280px]">
                        {review.title && <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mb-0.5 truncate">{review.title}</h5>}
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                          {review.comment}
                        </p>
                        {review.adminResponse && (
                          <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850/50 rounded-lg text-[10px] italic text-[#E85D04] dark:text-[#FFA034]">
                            <span className="font-bold uppercase tracking-wider not-italic mr-1 text-[9px] bg-[#E85D04]/15 px-1.5 py-0.5 rounded-sm">Reply:</span>
                            {review.adminResponse}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            size={12}
                            className={i < review.rating ? "fill-amber-500" : "text-slate-200 dark:text-slate-800"}
                          />
                        ))}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        review.isApproved
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-500"
                      }`}>
                        {review.isApproved ? "Approved" : "Pending Approval"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Approve */}
                        {!review.isApproved ? (
                          <button
                            onClick={() => approveMutation.mutate(review._id)}
                            title="Approve & Publish"
                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition cursor-pointer"
                          >
                            <FiCheck size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => rejectMutation.mutate(review._id)}
                            title="Reject & Hide"
                            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition cursor-pointer"
                          >
                            <FiX size={16} />
                          </button>
                        )}

                        {/* Reply */}
                        <button
                          onClick={() => handleRespondClick(review)}
                          title="Write administrative response"
                          className="p-2 text-slate-400 hover:text-[#E85D04] hover:bg-orange-50 dark:hover:bg-[#E85D04]/10 rounded-xl transition cursor-pointer"
                        >
                          <FiMessageSquare size={16} />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setConfirmDelete(review._id)}
                          title="Delete permanently"
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !isError && pagination.pages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800/40">
            <span className="text-xs font-semibold text-slate-400">
              Showing page {page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-650 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-55 dark:hover:bg-slate-900 transition"
              >
                <FiChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-655 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-55 dark:hover:bg-slate-900 transition"
              >
                <span>Next</span>
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Write Response Modal */}
      {responseModal && (
        <div className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/40 mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Response</h3>
              <button onClick={() => setResponseModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleRespondSubmit} className="space-y-4">
              <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl text-xs text-slate-500">
                <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Review by {responseModal.userId?.name || "Guest"}:
                </p>
                <p className="italic">"{responseModal.comment}"</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Your Response</label>
                <textarea
                  rows={4}
                  required
                  value={adminReplyText}
                  onChange={(e) => setAdminReplyText(e.target.value)}
                  placeholder="Thank you for sharing your feedback with the community! We appreciate..."
                  className="w-full px-4 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setResponseModal(null)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-305 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={respondMutation.isLoading}
                  className="px-5 py-2 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition"
                >
                  Submit Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-850 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Review?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Deleting this review will remove it permanently and update the destination's average rating scores. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-305 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete)}
                className="px-5 py-2 bg-red-500 hover:bg-red-655 text-white font-bold rounded-xl text-sm transition"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;
