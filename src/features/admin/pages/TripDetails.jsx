import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiCompass, FiCalendar, FiUser, FiMapPin } from "react-icons/fi";
import http from "../../../lib/axios";
import AdminPageLayout from "../components/ui/AdminPageLayout";

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminTripDetails", id],
    queryFn: () => http.get(`/trips/admin/${id}`),
  });

  const trip = data?.data?.trip || data?.data;

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading trip details...</div>;
  if (isError || !trip) return <div className="p-8 text-center text-red-500">Error loading trip.</div>;

  const actions = (
    <button
      onClick={() => navigate("/admin/trips")}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
    >
      <FiArrowLeft size={16} /> Back
    </button>
  );

  return (
    <AdminPageLayout
      title={trip.name || "Trip Itinerary"}
      subtitle={`Detailed view of itinerary created by ${trip.userId?.name || 'Guest'}`}
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-4">Trip Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiCompass size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Type</p>
                  <p className="font-bold capitalize">{trip.tripType || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Duration</p>
                  <p className="font-bold">{trip.totalDays || 1} Days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] shrink-0">
                  <FiUser size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Creator</p>
                  <p className="font-bold">{trip.userId?.name || "Guest"}</p>
                  <p className="text-xs text-slate-500">{trip.userId?.email || ""}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Destinations Mapped</h2>
            {trip.places && trip.places.length > 0 ? (
              <ul className="space-y-4">
                {trip.places.map((place, index) => (
                  <li key={place.placeId?._id || index} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/30">
                    <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0">
                      {place.placeId?.images?.thumbnail ? (
                        <img src={place.placeId.images.thumbnail} alt={place.placeId.name} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <FiMapPin size={20} />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        Day {place.dayNumber || 1}: {place.placeId?.name || "Unknown Place"}
                      </h4>
                      {place.notes && <p className="text-xs text-slate-500 mt-1">{place.notes}</p>}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No destinations mapped yet.</p>
            )}
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default TripDetails;
