import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiMapPin, FiCalendar, FiStar, FiImage } from "react-icons/fi";
import http from "../../../lib/axios";
import AdminPageLayout from "../components/ui/AdminPageLayout";

const CityDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminCityDetails", id],
    queryFn: () => http.get(`/cities/admin/${id}`),
  });

  const cityData = data?.data?.city || data?.data;

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading city details...</div>;
  }

  if (isError || !cityData) {
    return <div className="p-8 text-center text-red-500">Error loading city.</div>;
  }

  const actions = (
    <>
      <button
        onClick={() => navigate("/admin/cities")}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
      >
        <FiArrowLeft size={16} /> Back
      </button>
      <button
        onClick={() => navigate(`/admin/cities/edit/${id}`)}
        className="flex items-center gap-2 px-5 py-2 bg-[#E85D04] text-white font-bold rounded-xl text-sm hover:bg-[#D05203] transition cursor-pointer"
      >
        <FiEdit2 size={16} /> Edit City
      </button>
    </>
  );

  return (
    <AdminPageLayout
      title={cityData.name}
      subtitle={`Detailed view and management for ${cityData.name}`}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-3xl overflow-hidden shadow-sm">
            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative">
              {cityData.images?.hero || cityData.images?.thumbnail ? (
                <img
                  src={cityData.images.hero || cityData.images.thumbnail}
                  alt={cityData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <FiImage size={48} className="mb-2" />
                  <span className="text-sm font-semibold">No Image Available</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black shadow-lg ${cityData.isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {cityData.isActive ? "ACTIVE" : "HIDDEN"}
                </span>
                {cityData.featured && (
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
                  <p className="text-xs text-slate-400 font-semibold uppercase">State</p>
                  <p className="font-bold">{cityData.stateId?.name || "Unknown State"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Best Time</p>
                  <p className="font-bold">{cityData.bestTimeToVisit || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">City Overview</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Tagline</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm italic">
                  "{cityData.tagline || "No tagline provided."}"
                </p>
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Description</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-line">
                  {cityData.description || cityData.overview || "No description provided."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">System Metadata</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Created At</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                   {new Date(cityData.createdAt).toLocaleString()}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Last Updated</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                   {new Date(cityData.updatedAt).toLocaleString()}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Likes Count</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                   {cityData.likeCount || 0}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Slug URL</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                   {cityData.slug}
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default CityDetails;
