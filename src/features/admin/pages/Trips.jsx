import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { FiNavigation, FiTrash2, FiEye, FiChevronLeft, FiChevronRight, FiCalendar, FiCompass, FiUser } from "react-icons/fi";
import http from "../../../lib/axios";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import { toast } from "react-toastify";

const Trips = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Deletion conformation ID
  const [confirmDelete, setConfirmDelete] = useState(null);

  // URL parameters
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const tripType = searchParams.get("tripType") || "";

  // Query trips
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminTrips", page, search, tripType],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (tripType) params.tripType = tripType;

      const response = await http.get("/trips/admin/all", { params });
      return response.data;
    },
    keepPreviousData: true
  });

  const responseData = data?.data || {};
  const trips = responseData.trips || [];
  const pagination = responseData.pagination || { total: 0, pages: 1 };

  // Delete trip mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/trips/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Trip itinerary deleted successfully!");
      setConfirmDelete(null);
      queryClient.invalidateQueries(["adminTrips"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete trip");
    }
  });

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  const filters = [
    {
      key: "tripType",
      label: "Trip Type",
      options: [
        { value: "solo", label: "Solo Traveler" },
        { value: "family", label: "Family Trip" },
        { value: "couple", label: "Couple Trip" },
        { value: "friends", label: "Friends Group" },
        { value: "pilgrim", label: "Pilgrimage" }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">User Itineraries</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Monitor and moderate all customized travel itineraries and plans made by TravelBharat users.</p>
      </div>

      {/* Filter toolbar */}
      <SearchAndFilter
        searchPlaceholder="Search trips by itinerary title..."
        filters={filters}
      />

      {/* Trips list card */}
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-55/40 dark:bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                <th className="py-4 px-6">Itinerary Name</th>
                <th className="py-4 px-6">Creator</th>
                <th className="py-4 px-6">Duration</th>
                <th className="py-4 px-6">Itinerary Details</th>
                <th className="py-4 px-6">Budget</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm text-slate-655 dark:text-slate-350">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-20 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="py-4 px-6"><div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6 text-right"><div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-red-500 font-bold">
                    Error loading itineraries: {error?.message}
                  </td>
                </tr>
              ) : trips.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-semibold">
                    <FiNavigation size={36} className="mx-auto mb-3 text-slate-300" />
                    No custom trips found.
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/5 transition">
                    {/* Cover image & Title */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {trip.coverImage ? (
                          <img
                            src={trip.coverImage}
                            alt={trip.name}
                            className="w-16 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-450 shrink-0">
                            <FiCompass size={20} />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-bold text-slate-850 dark:text-slate-250 truncate max-w-[200px]">
                            {trip.name}
                          </h4>
                          <span className="text-xs text-slate-400 capitalize">{trip.tripType} type</span>
                        </div>
                      </div>
                    </td>

                    {/* Creator User */}
                    <td className="py-4 px-6">
                      {trip.userId ? (
                        <div className="flex items-center gap-2">
                          {trip.userId.profileImage ? (
                            <img
                              src={trip.userId.profileImage}
                              alt={trip.userId.name}
                              className="w-7 h-7 rounded-full object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-[10px] font-bold flex items-center justify-center shrink-0">
                              {trip.userId.name ? trip.userId.name[0].toUpperCase() : <FiUser />}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-xs font-bold truncate max-w-[120px]">{trip.userId.name}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{trip.userId.email}</p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-450">Unknown Guest</span>
                      )}
                    </td>

                    {/* Duration days */}
                    <td className="py-4 px-6 font-semibold">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiCalendar size={14} />
                        <span>{trip.totalDays ?? 1} Days</span>
                      </div>
                    </td>

                    {/* Details (Places Count) */}
                    <td className="py-4 px-6 font-semibold">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs">
                        {trip.places?.length || 0} destinations mapped
                      </span>
                    </td>

                    {/* Budget */}
                    <td className="py-4 px-6 font-semibold text-xs capitalize text-slate-400">
                      {trip.budget || "moderate"}
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {trip.isPublic && (
                          <Link
                            to={`/trips/${trip._id}`}
                            target="_blank"
                            title="Preview public itinerary"
                            className="p-2 text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                          >
                            <FiEye size={16} />
                          </Link>
                        )}
                        <button
                          onClick={() => setConfirmDelete(trip._id)}
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
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-55 dark:hover:bg-slate-900 transition"
              >
                <FiChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-55 dark:hover:bg-slate-900 transition"
              >
                <span>Next</span>
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-850 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Itinerary?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Are you sure you want to remove this user itinerary from TravelBharat? The traveler will lose access to this saved plan.
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
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition"
              >
                Delete Itinerary
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trips;
