import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { FiMap, FiPlus, FiTrash2, FiImage, FiEdit, FiStar, FiGrid, FiList } from "react-icons/fi";
import http from "../../../lib/axios";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import AdminPageLayout from "../components/ui/AdminPageLayout";
import AdminPagination from "../components/ui/AdminPagination";
import { toast } from "react-toastify";

const States = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  // Dialog / Edit states
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminViewMode") || "list");

  useEffect(() => {
    localStorage.setItem("adminViewMode", viewMode);
  }, [viewMode]);

  // URL queries
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const region = searchParams.get("region") || "";
  const featured = searchParams.get("featured") || "";

  // Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminStates", page, search, region, featured],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (region) params.region = region;
      if (featured) {
        params.featured = featured === "true" ? "true" : "false";
      }
      // http interceptor already returns res.data → { success, message, data: {...} }
      return http.get("/states/admin/all", { params });
    },
    keepPreviousData: true
  });

  // Axios interceptor unwraps res.data → response = { success, data: { states, pagination } }
  const states = data?.data?.states || [];
  const pagination = data?.data?.pagination || { total: 0, pages: 1 };

  const handleEditClick = (stateItem) => {
    navigate(`/admin/states/edit/${stateItem._id}`);
  };

  const handleOpenCreate = () => {
    navigate("/admin/states/create");
  };

  const handleToggleFeatured = async (stateItem) => {
    try {
      await http.put(`/states/admin/${stateItem._id}`, { featured: !stateItem.featured });
      queryClient.invalidateQueries(["adminStates"]);
      toast.success("Featured status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handleToggleActive = async (stateItem) => {
    try {
      await http.put(`/states/admin/${stateItem._id}`, { isActive: !stateItem.isActive });
      queryClient.invalidateQueries(["adminStates"]);
      toast.success("Active status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/states/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("State deleted permanently!");
      setConfirmDelete(null);
      queryClient.invalidateQueries(["adminStates"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete state");
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
      key: "region",
      label: "Region",
      options: [
        { value: "north", label: "North India" },
        { value: "south", label: "South India" },
        { value: "east", label: "East India" },
        { value: "west", label: "West India" },
        { value: "central", label: "Central India" },
        { value: "northeast", label: "Northeast India" }
      ]
    },
    {
      key: "featured",
      label: "Featured",
      options: [
        { value: "true", label: "Featured" },
        { value: "false", label: "Non-Featured" }
      ]
    }
  ];

  return (
    <AdminPageLayout
      title="States Directory"
      subtitle="Create, edit and manage Indian states registered for TravelBharat explorer guides."
      actions={
        <>
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiGrid size={16} /></button>
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-xs transition duration-200 cursor-pointer shrink-0"
          >
            <FiPlus size={16} />
            <span>Add New State</span>
          </button>
        </>
      }
    >
      {/* Toolbar */}
      <SearchAndFilter
        searchPlaceholder="Search states by name..."
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
                <th className="py-4 px-6">State / Tagline</th>
                <th className="py-4 px-6">Capital</th>
                <th className="py-4 px-6">Region</th>
                <th className="py-4 px-6">Featured</th>
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
                          <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="w-36 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="w-16 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6 text-right"><div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-red-500 font-bold">
                    Error loading states: {error?.message}
                  </td>
                </tr>
              ) : states.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-400 font-semibold">
                    <FiMap size={36} className="mx-auto mb-3 text-slate-300" />
                    No states registered.
                  </td>
                </tr>
              ) : (
                states.map((stateItem) => (
                  <tr 
                    key={stateItem._id} 
                    onClick={() => navigate(`/admin/states/${stateItem._id}`)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/70 transition cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {stateItem.images?.thumbnail ? (
                          <img
                            src={stateItem.images.thumbnail}
                            alt={stateItem.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <FiImage size={20} />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{stateItem.name}</h4>
                          <span className="text-xs text-slate-400 truncate max-w-[200px] block">{stateItem.tagline}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold">{stateItem.capital || "—"}</td>

                    <td className="py-4 px-6 font-semibold capitalize text-xs text-slate-400">
                      {stateItem.region} India
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleFeatured(stateItem); }}
                        className={`p-1.5 rounded-lg border transition duration-200 cursor-pointer ${stateItem.featured
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                            : "border-slate-200 dark:border-slate-800 text-slate-300 hover:text-slate-500"
                          }`}
                      >
                        <FiStar size={16} className={stateItem.featured ? "fill-amber-500" : ""} />
                      </button>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleActive(stateItem); }}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${stateItem.isActive
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
                          }`}
                      >
                        {stateItem.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => { e.stopPropagation(); handleEditClick(stateItem); }}
                          className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setConfirmDelete(stateItem._id); }}
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
              <div className="col-span-full text-center py-10 text-red-500 font-bold">Error loading states</div>
            ) : states.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-semibold">No states registered.</div>
            ) : (
              states.map((stateItem) => (
                <div 
                  key={stateItem._id} 
                  onClick={() => navigate(`/admin/states/${stateItem._id}`)}
                  className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer"
                >
                  <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                    {stateItem.images?.thumbnail ? (
                      <img src={stateItem.images.thumbnail} alt={stateItem.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FiImage size={32} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                       {stateItem.featured && <span className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow"><FiStar size={12} className="inline mr-1" />Featured</span>}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-black text-lg text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition">{stateItem.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{stateItem.tagline || "No tagline provided"}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${stateItem.isActive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450" : "bg-red-500/10 text-red-650 dark:text-red-400"}`}>
                        {stateItem.isActive ? "Active" : "Hidden"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => { e.stopPropagation(); handleEditClick(stateItem); }} className="p-2 text-slate-400 hover:text-[#E85D04] bg-slate-50 dark:bg-slate-800 hover:bg-[#E85D04]/10 rounded-lg transition"><FiEdit size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(stateItem._id); }} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
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



      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete State?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Deleting this state will remove it permanently. Cities and tourist destinations associated with this state may become orphaned.
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
                Delete State
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default States;
