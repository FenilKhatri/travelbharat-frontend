import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiEdit2, FiMapPin, FiClock, FiStar, FiImage, FiTag, FiDollarSign } from "react-icons/fi";
import http from "../../../lib/axios";
import AdminPageLayout from "../components/ui/AdminPageLayout";

const PlaceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminPlaceDetails", id],
    queryFn: () => http.get(`/places/admin/${id}`)});

  const placeData = data?.data?.place || data?.data;

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">Loading destination details...</div>;
  }

  if (isError || !placeData) {
    return <div className="p-8 text-center text-red-500">Error loading destination.</div>;
  }

  const renderEntryFee = (fee) => {
    if (!fee) return "Free";
    if (typeof fee === "string" || typeof fee === "number") return fee;
    if (typeof fee === "object") {
      const parts = [];
      if (fee.indian) parts.push(`Indian: ${fee.indian}`);
      if (fee.foreigner) parts.push(`Foreigner: ${fee.foreigner}`);
      if (fee.camera) parts.push(`Camera: ${fee.camera}`);
      return parts.length > 0 ? parts.join(" | ") : "Free";
    }
    return "Free";
  };

  const actions = (
    <>
      <button
        onClick={() => navigate("/admin/places")}
        className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
      >
        <FiArrowLeft size={16} /> Back
      </button>
      <button
        onClick={() => navigate(`/admin/places/edit/${id}`)}
        className="flex items-center gap-2 px-5 py-2 bg-[#E85D04] text-white font-bold rounded-xl text-sm hover:bg-[#D05203] transition cursor-pointer"
      >
        <FiEdit2 size={16} /> Edit Destination
      </button>
    </>
  );

  return (
    <AdminPageLayout
      title={placeData.name}
      subtitle={`Detailed view and management for ${placeData.name}`}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Quick Stats */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-3xl overflow-hidden shadow-sm">
            <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 relative">
              {placeData.images?.hero || placeData.images?.thumbnail ? (
                <img
                  src={(placeData.images.hero?.url || placeData.images.hero) || (placeData.images.thumbnail?.url || placeData.images.thumbnail)}
                  alt={placeData.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                  <FiImage size={48} className="mb-2" />
                  <span className="text-sm font-semibold">No Image Available</span>
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-black shadow-lg ${placeData.isActive ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}`}>
                  {placeData.isActive ? "ACTIVE" : "HIDDEN"}
                </span>
                {placeData.featured && (
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
                  <p className="font-bold">{placeData.cityId?.name || "Unknown City"}, {placeData.stateId?.name || "Unknown State"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiTag size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Category</p>
                  <p className="font-bold capitalize">{placeData.category || "Uncategorized"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiClock size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Timings</p>
                  <p className="font-bold">{placeData.timings || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiDollarSign size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Entry Fee</p>
                  <p className="font-bold">{renderEntryFee(placeData.entryFee)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Destination Overview</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Description</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm whitespace-pre-line">
                  {placeData.description || "No description provided."}
                </p>
              </div>

              {placeData.location && (placeData.location.lat || placeData.location.lng) && (
                <div>
                   <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">Map Coordinates</h4>
                   <p className="text-slate-600 dark:text-slate-400 text-sm">
                     Latitude: {placeData.location.lat}, Longitude: {placeData.location.lng}
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
                   {new Date(placeData.createdAt || placeData.updatedAt).toLocaleString()}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Last Updated</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                   {placeData.updatedAt ? new Date(placeData.updatedAt).toLocaleString() : "N/A"}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Likes Count</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                   {placeData.likeCount ?? 0}
                 </p>
               </div>
               <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/60">
                 <p className="text-xs text-slate-400 uppercase font-semibold mb-1">Slug URL</p>
                 <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">
                   {placeData.slug}
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default PlaceDetails;
