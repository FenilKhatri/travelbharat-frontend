import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiImage,
  FiUpload,
  FiStar,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
} from "react-icons/fi";
import http from "../../../lib/axios";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import { toast } from "react-toastify";

const Places = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Modal Control States
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminViewMode") || "list");

  useEffect(() => {
    localStorage.setItem("adminViewMode", viewMode);
  }, [viewMode]);

  // URL Params
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const budgetFilter = searchParams.get("budget") || "";

  // Queries
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminPlaces", page, search, categoryFilter, budgetFilter],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (budgetFilter) params.budget = budgetFilter;

      const response = await http.get("/places/admin/all", { params });
      return response.data;
    },
    keepPreviousData: true
  });

  const responseData = data || {};
  const places = responseData.places || [];
  const pagination = responseData.pagination || { total: 0, pages: 1 };

  // Fetch States for form options
  const { data: statesList = [] } = useQuery({
    queryKey: ["statesListForSelect"],
    queryFn: async () => {
      const res = await http.get("/states?limit=100");
      let states = res?.data?.states || [];
      // Make Gujarat appear first
      const gujaratIdx = states.findIndex(s => s.name.toLowerCase() === "gujarat");
      if (gujaratIdx !== -1) {
        const gujarat = states.splice(gujaratIdx, 1)[0];
        states.unshift(gujarat);
      }
      return states;
    }
  });


  // Mutations
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/places/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Destination deleted!");
      setConfirmDelete(null);
      queryClient.invalidateQueries(["adminPlaces"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete destination");
    }
  });

  const handleEditClick = (place) => {
    navigate(`/admin/places/edit/${place._id}`);
  };

  const handleOpenCreate = () => {
    navigate("/admin/places/create");
  };
  const handleToggleFeatured = async (place) => {
    try {
      await http.put(`/places/admin/${place._id}`, { featured: !place.featured });
      toast.success(`Destination marked as ${!place.featured ? 'Featured' : 'Standard'}`);
      queryClient.invalidateQueries(["adminPlaces"]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update featured status");
    }
  };

  const handleToggleActive = async (place) => {
    try {
      await http.put(`/places/admin/${place._id}`, { isActive: !place.isActive });
      toast.success(`Destination ${!place.isActive ? 'activated' : 'deactivated'}`);
      queryClient.invalidateQueries(["adminPlaces"]);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update active status");
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  // Filter Categories dropdown options
  const categoriesList = [
    { value: "heritage", label: "Heritage" },
    { value: "nature", label: "Nature" },
    { value: "temple", label: "Temple" },
    { value: "beach", label: "Beach" },
    { value: "hill-station", label: "Hill Station" },
    { value: "wildlife", label: "Wildlife" },
    { value: "adventure", label: "Adventure" },
    { value: "religious", label: "Religious" },
    { value: "modern", label: "Modern" },
    { value: "other", label: "Other" }
  ];

  const filters = [
    {
      key: "category",
      label: "Category",
      options: categoriesList
    },
    {
      key: "budget",
      label: "Budget",
      options: [
        { value: "budget", label: "Budget Friendly" },
        { value: "moderate", label: "Moderate" },
        { value: "luxury", label: "Luxury" }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Destinations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Review, create, and manage registered tourist places across states.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiGrid size={16} /></button>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-xs transition duration-200 cursor-pointer shrink-0"
          >
            <FiPlus size={16} />
            <span>Add Destination</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <SearchAndFilter
        searchPlaceholder="Search destinations..."
        filters={filters}
      />

      {/* List / Grid Toggle View */}
      <div className="bg-transparent">
        {viewMode === "list" ? (
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-55/40 dark:bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                    <th className="py-4 px-6">Destination</th>
                    <th className="py-4 px-6">Location</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Rating</th>
                    <th className="py-4 px-6">Promoted</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm text-slate-650 dark:text-slate-350">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                            <div className="space-y-2">
                              <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                              <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6"><div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                        <td className="py-4 px-6"><div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                        <td className="py-4 px-6"><div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                        <td className="py-4 px-6"><div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                        <td className="py-4 px-6"><div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                        <td className="py-4 px-6 text-right"><div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                      </tr>
                    ))
                  ) : isError ? (
                    <tr>
                      <td colSpan="7" className="text-center py-10 text-red-500 font-bold">
                        Error loading destinations: {error?.message}
                      </td>
                    </tr>
                  ) : places.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-12 text-slate-400 font-semibold">
                        <FiMapPin size={36} className="mx-auto mb-3 text-slate-300" />
                        No tourist places registered yet.
                      </td>
                    </tr>
                  ) : (
                    places.map((place) => (
                      <tr 
                        key={place._id} 
                        onClick={(e) => {
                          if (!e.target.closest('button')) navigate(`/admin/places/${place._id}`);
                        }}
                        className="hover:bg-slate-50/50 dark:hover:bg-[#1e293b] transition cursor-pointer"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            {place.images?.thumbnail ? (
                              <img
                                src={place.images.thumbnail}
                                alt={place.name}
                                className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                <FiImage size={20} />
                              </div>
                            )}
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-slate-200">{place.name}</h4>
                              <span className="text-xs text-slate-400 capitalize">{place.budget} budget</span>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-6 font-semibold">
                          {place.cityId?.name || "—"}, {place.stateId?.name || "—"}
                        </td>

                        <td className="py-4 px-6 font-semibold capitalize text-xs">
                          <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md">
                            {place.category}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1 text-[#E85D04] font-bold">
                            <FiStar size={14} className="fill-[#E85D04]" />
                            <span>{place.rating?.toFixed(1) || "0.0"}</span>
                            <span className="text-xs font-normal text-slate-400">({place.reviewCount})</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {/* Featured */}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleFeatured(place); }}
                              title="Toggle Featured"
                              className={`p-1.5 rounded-lg border transition duration-200 cursor-pointer ${place.featured
                                  ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                                  : "border-slate-200 dark:border-slate-800 text-slate-300 hover:text-slate-500"
                                }`}
                            >
                              <FiStar size={14} className={place.featured ? "fill-amber-500" : ""} />
                            </button>
                            {/* Trending */}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleToggleTrending(place); }}
                              title="Toggle Trending"
                              className={`p-1.5 rounded-lg border transition duration-200 cursor-pointer ${place.trending
                                  ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                                  : "border-slate-200 dark:border-slate-800 text-slate-300 hover:text-slate-500"
                                }`}
                            >
                              <FiTrendingUp size={14} />
                            </button>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleActive(place); }}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${place.isActive
                                ? "bg-emerald-500/10 text-emerald-605 dark:text-emerald-450 hover:bg-emerald-500/20"
                                : "bg-red-500/10 text-red-650 dark:text-red-450 hover:bg-red-500/20"
                              }`}
                          >
                            {place.isActive ? "Active" : "Hidden"}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleEditClick(place); }}
                              className="p-2 text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                            >
                              <FiEdit size={16} />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setConfirmDelete(place._id); }}
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
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-4 animate-pulse h-64" />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-10 text-red-500 font-bold">Error loading destinations</div>
            ) : places.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-semibold">No tourist places registered yet.</div>
            ) : (
              places.map((place) => (
                <div 
                  key={place._id} 
                  onClick={() => navigate(`/admin/places/${place._id}`)}
                  className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer"
                >
                  <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                    {place.images?.thumbnail ? (
                      <img src={place.images.thumbnail} alt={place.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FiImage size={32} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                      {place.featured && <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow"><FiStar size={10} className="inline mr-1" />Featured</span>}
                      {place.trending && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow"><FiTrendingUp size={10} className="inline mr-1" />Trending</span>}
                    </div>
                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                      {place.category}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-black text-base text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition line-clamp-1">{place.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">{place.cityId?.name || "—"}, {place.stateId?.name || "—"}</p>

                    <div className="flex items-center gap-1 text-[#E85D04] font-bold text-xs mb-4">
                      <FiStar size={12} className="fill-[#E85D04]" />
                      <span>{place.rating?.toFixed(1) || "0.0"}</span>
                      <span className="text-[10px] font-normal text-slate-400">({place.reviewCount})</span>
                    </div>

                    <div className="mt-auto flex items-center justify-between">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${place.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450" : "bg-red-500/10 text-red-650 dark:text-red-400"}`}>
                        {place.isActive ? "Active" : "Hidden"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(place); }} className="p-2 text-slate-400 hover:text-[#E85D04] bg-slate-50 dark:bg-slate-800 hover:bg-[#E85D04]/10 rounded-lg transition"><FiEdit size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(place._id); }} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

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
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >
                <FiChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition"
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
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Destination?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Deleting this place will permanently remove it from state catalogs and all traveler itineraries. This action is irreversible.
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
                Delete Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;
