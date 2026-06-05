import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiStar, FiMapPin, FiUser, FiClock, FiMessageSquare } from "react-icons/fi";
import http from "../../../lib/axios";
import AdminPageLayout from "../components/ui/AdminPageLayout";

const ReviewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminReviewDetails", id],
    queryFn: () => http.get(`/reviews/${id}`),
  });

  const review = data?.data?.review || data?.data;

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading review details...</div>;
  if (isError || !review) return <div className="p-8 text-center text-red-500">Error loading review.</div>;

  const actions = (
    <button
      onClick={() => navigate("/admin/reviews")}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
    >
      <FiArrowLeft size={16} /> Back
    </button>
  );

  return (
    <AdminPageLayout
      title="Review Details"
      subtitle={`Detailed view of review for ${review.placeId?.name || 'Destination'}`}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Review Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiStar size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Rating</p>
                  <p className="font-bold text-amber-500 flex items-center gap-1">
                    {review.rating} / 5
                    <FiStar size={14} className="fill-current" />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Destination</p>
                  <p className="font-bold">{review.placeId?.name || "Unknown Place"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiUser size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Author</p>
                  <p className="font-bold">{review.userId?.name || "Guest"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Review Content</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${review.isApproved ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                {review.isApproved ? "APPROVED" : "PENDING"}
              </span>
            </div>
            
            <div className="space-y-6">
              <div>
                {review.title && <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">{review.title}</h4>}
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {review.comment}
                </p>
              </div>

              {review.adminResponse && (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                  <h4 className="text-sm font-bold text-[#E85D04] mb-2 flex items-center gap-2">
                    <FiMessageSquare size={16} /> Admin Response
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {review.adminResponse}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default ReviewDetails;
