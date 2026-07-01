import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiMapPin, FiCalendar, FiClock, FiStar, FiImage } from "react-icons/fi";
import http from "../../../lib/axios";
import AdminPageLayout from "../components/ui/AdminPageLayout";

const FestivalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminFestivalDetails", id],
    queryFn: () => http.get(`/festivals/admin/${id}`)});

  const festival = data?.data?.festival || data?.data;

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading festival details...</div>;
  }

  if (isError || !festival) {
    return <div className="p-8 text-center text-red-500">Error loading festival.</div>;
  }

  const actions = (
    <>
      <button
        onClick={() => navigate("/admin/festivals")}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
      >
        <FiArrowLeft size={16} /> Back
      </button>
      <button
        onClick={() => navigate(`/admin/festivals/edit/${id}`)}
        className="flex items-center gap-2 px-5 py-2 bg-[#E85D04] text-white font-bold rounded-xl text-sm hover:bg-[#D05203] transition cursor-pointer"
      >
        <FiEdit2 size={16} /> Edit Festival
      </button>
    </>
  );

  return (
    <AdminPageLayout
      title={festival.name}
      subtitle={`Detailed view and management for ${festival.name}`}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-3xl overflow-hidden shadow-sm">
            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative">
              {festival.images?.hero || festival.images?.thumbnail ? (
                <img
                  src={(festival.images.hero?.url || festival.images.hero) || (festival.images.thumbnail?.url || festival.images.thumbnail)}
                  alt={festival.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <FiImage size={48} className="mb-2" />
                  <span className="text-sm font-semibold">No Image Available</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black shadow-lg ${festival.isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {festival.isActive ? "ACTIVE" : "HIDDEN"}
                </span>
                {festival.featured && (
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-lg flex items-center gap-1">
                    <FiStar size={12} className="fill-current" /> FEATURED
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0A121F] p-6 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Quick Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiMapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Location</p>
                  <p className="font-bold">{festival.stateId?.name || "Unknown State"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Month</p>
                  <p className="font-bold capitalize">{festival.month || "Unknown"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Duration</p>
                  <p className="font-bold">{festival.duration || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Festival Overview</h2>
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase rounded-lg">
                {festival.category}
              </span>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Description</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                  {festival.description || "No description provided."}
                </p>
              </div>

              {festival.significance && (
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Cultural Significance</h4>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                    {festival.significance}
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">System Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Created At</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                   {new Date(festival.createdAt).toLocaleString()}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Last Updated</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                   {new Date(festival.updatedAt).toLocaleString()}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Display Priority</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                   {festival.priority || 0}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Slug URL</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                   {festival.slug}
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default FestivalDetails;
