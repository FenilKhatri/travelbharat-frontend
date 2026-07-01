import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { FiNavigation, FiTrash2, FiEye, FiCalendar, FiCompass, FiUser, FiGrid, FiList, FiMapPin } from "react-icons/fi";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import AdminPageLayout from "../components/ui/AdminPageLayout";
import AdminPagination from "../components/ui/AdminPagination";

import { useAdminList } from "../hooks/useAdminList";
import { useAdminMutations } from "../hooks/useAdminMutations";

const Trips = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminTripsViewMode") || "list");

  useEffect(() => {
    localStorage.setItem("adminTripsViewMode", viewMode);
  }, [viewMode]);

  const { data, isLoading, isError, error, searchParams, setSearchParams } = useAdminList({
    queryKey: "adminTrips",
    endpoint: "/trips/admin/all",
    extractParams: (params) => ({
      tripType: params.get("tripType") || ""
    })
  });

  const { deleteMutation } = useAdminMutations({
    queryKey: ["adminTrips"],
    updateEndpoint: (id) => `/trips/admin/${id}`,
    deleteEndpoint: (id) => `/trips/admin/${id}`,
    successDeleteMsg: "Trip itinerary deleted successfully!"
  });

  const responseData = data || {};
  const trips = responseData.trips || data?.data?.trips || [];
  const pagination = responseData.pagination || data?.data?.pagination || { total: 0, pages: 1 };

  const handleRowClick = (trip) => {
    navigate(`/admin/trips/${trip._id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const handlePreviewClick = (e, tripId) => {
    e.stopPropagation();
    window.open(`/user/trips/${tripId}`, "_blank");
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
    <AdminPageLayout
      title="User Itineraries"
      subtitle="Monitor and moderate all customized travel itineraries and plans made by TravelBharat users."
      actions={
        <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiGrid size={16} /></button>
        </div>
      }
    >
      <SearchAndFilter
        searchPlaceholder="Search trips by itinerary title..."
        filters={filters}
      />

      <div className="bg-transparent">
        {viewMode === "list" && (
        <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden mb-6">
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
                  <tr 
                    key={trip._id} 
                    onClick={() => handleRowClick(trip)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900 transition cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {trip.coverImage ? (
                          <img
                            src={trip.coverImage?.url || trip.coverImage}
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
                    <td className="py-4 px-6">
                      {trip.userId ? (
                        <div className="flex items-center gap-2">
                          {trip.userId.profileImage ? (
                            <img
                              src={trip.userId.profileImage?.url || trip.userId.profileImage}
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
                    <td className="py-4 px-6 font-semibold">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiCalendar size={14} />
                        <span>{trip.totalDays ?? 1} Days</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-semibold">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs">
                        {trip.places?.length || 0} destinations
                      </span>
                    </td>
                    <td className="py-4 px-6 font-semibold text-xs capitalize text-slate-400">
                      {trip.budget || "moderate"}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {trip.isPublic && (
                          <button
                            onClick={(e) => handlePreviewClick(e, trip._id)}
                            title="Preview public itinerary"
                            className="p-2 text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                          >
                            <FiEye size={16} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeleteClick(e, trip._id)}
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
        </div>
        )}

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-4 animate-pulse h-64" />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-10 text-red-500 font-bold">Error loading itineraries</div>
            ) : trips.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-semibold">No custom trips found.</div>
            ) : (
              trips.map((trip) => (
                <div 
                  key={trip._id} 
                  onClick={() => handleRowClick(trip)}
                  className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer"
                >
                  <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                    {trip.coverImage ? (
                      <img src={trip.coverImage?.url || trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                        <FiCompass size={32} className="mb-2" />
                        <span className="text-xs font-semibold uppercase tracking-wider">{trip.tripType}</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#0A121F]/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-2 shadow-sm">
                      {trip.userId?.profileImage ? (
                        <img src={trip.userId.profileImage?.url || trip.userId.profileImage} alt={trip.userId.name} className="w-5 h-5 rounded-full object-cover" />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-[8px] font-bold flex items-center justify-center">
                          {trip.userId?.name ? trip.userId.name[0].toUpperCase() : <FiUser />}
                        </div>
                      )}
                      <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
                        {trip.userId?.name || "Unknown"}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-black text-base text-slate-900 dark:text-white mb-2 group-hover:text-[#E85D04] transition line-clamp-1">{trip.name}</h4>
                    
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
                      <div className="flex items-center gap-1.5"><FiCalendar size={14} />{trip.totalDays ?? 1} Days</div>
                      <div className="flex items-center gap-1.5"><FiMapPin size={14} />{trip.places?.length || 0} Places</div>
                    </div>

                    <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/50">
                      <span className="text-xs font-bold text-slate-400 capitalize">{trip.budget || "moderate"}</span>
                      <div className="flex items-center gap-1">
                        {trip.isPublic && (
                          <button onClick={(e) => handlePreviewClick(e, trip._id)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"><FiEye size={14} /></button>
                        )}
                        <button onClick={(e) => handleDeleteClick(e, trip._id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <AdminPagination isLoading={isLoading} isError={isError} pagination={pagination} />
      </div>

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
    </AdminPageLayout>
  );
};

export default Trips;