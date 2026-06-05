import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCalendarCheck, FaPencilAlt } from "react-icons/fa";
import { FiPlus, FiTrash2, FiImage, FiList, FiGrid } from "react-icons/fi";
import http from "../../../lib/axios";
import { toast } from "react-toastify";
import AdminPageLayout from "../components/ui/AdminPageLayout";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import AdminPagination from "../components/ui/AdminPagination";

const Festivals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminViewMode") || "list");

  useEffect(() => {
    localStorage.setItem("adminViewMode", viewMode);
  }, [viewMode]);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  // Fetch festivals
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminFestivals", page, search, category],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (category) params.category = category;
      return http.get("/festivals/admin/all", { params });
    },
    keepPreviousData: true,
  });

  const festivals = data?.data?.festivals || [];
  const pagination = data?.data?.pagination || { total: 0, pages: 1 };

  const deleteMutation = useMutation({
    mutationFn: (id) => http.delete(`/festivals/admin/${id}`),
    onSuccess: () => { 
      toast.success("Festival deleted!"); 
      setConfirmDelete(null); 
      queryClient.invalidateQueries(["adminFestivals"]); 
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete festival"),
  });

  const handleEditClick = (e, f) => {
    e.stopPropagation();
    navigate(`/admin/festivals/edit/${f._id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const handleRowClick = (f) => {
    navigate(`/admin/festivals/${f._id}`);
  };

  const actions = (
    <>
      <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
        <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
        <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiGrid size={16} /></button>
      </div>
      <button
        onClick={() => { navigate("/admin/festivals/create"); }}
        className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-sm transition cursor-pointer shrink-0"
      >
        <FiPlus size={16} /> Add Festival
      </button>
    </>
  );

  const filters = [
    {
      key: "category",
      label: "Category",
      options: [
        { value: "cultural", label: "Cultural" },
        { value: "religious", label: "Religious" },
        { value: "harvest", label: "Harvest" },
        { value: "national", label: "National" },
      ]
    }
  ];

  return (
    <AdminPageLayout
      title="Festivals"
      subtitle="Manage Indian festivals and cultural celebrations."
      actions={actions}
    >
      <SearchAndFilter
        searchPlaceholder="Search festivals by name..."
        filters={filters}
      />

      <div className="bg-transparent">
        {viewMode === "list" ? (
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                    <th className="py-4 px-6">Festival</th>
                    <th className="py-4 px-6">State</th>
                    <th className="py-4 px-6">Month</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="py-4 px-6"><div className="h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                        ))}
                      </tr>
                    ))
                  ) : isError ? (
                    <tr><td colSpan="6" className="text-center py-10 text-red-500 font-bold">Error loading festivals: {error?.message}</td></tr>
                  ) : festivals.length === 0 ? (
                    <tr><td colSpan="6" className="text-center py-12 text-slate-400 font-semibold">
                      <FaCalendarCheck size={36} className="mx-auto mb-3 text-slate-300" />
                      No festivals found.
                    </td></tr>
                  ) : festivals.map((f) => (
                    <tr 
                      key={f._id} 
                      onClick={() => handleRowClick(f)}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {f.images?.thumbnail ? (
                            <img src={f.images.thumbnail} alt={f.name} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              <FiImage size={16} className="text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-200">{f.name}</p>
                            {f.duration && <p className="text-xs text-slate-400">{f.duration}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">{f.stateId?.name || "—"}</td>
                      <td className="py-4 px-6 capitalize text-slate-500 dark:text-slate-400">{f.month || "—"}</td>
                      <td className="py-4 px-6 capitalize">
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-[#E85D04]/10 text-[#E85D04]">{f.category}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${f.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>
                          {f.isActive ? "Active" : "Hidden"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={(e) => handleEditClick(e, f)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"><FaPencilAlt size={15} /></button>
                          <button onClick={(e) => handleDeleteClick(e, f._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"><FiTrash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination isLoading={isLoading} isError={isError} pagination={pagination} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-4 animate-pulse h-64" />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-10 text-red-500 font-bold">Error loading festivals</div>
            ) : festivals.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-semibold">No festivals registered.</div>
            ) : (
              festivals.map((f) => (
                <div 
                  key={f._id} 
                  onClick={() => handleRowClick(f)}
                  className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer"
                >
                  <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                    {f.images?.thumbnail ? (
                      <img src={f.images.thumbnail} alt={f.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FiImage size={32} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                       <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                         {f.month || "Unknown"}
                       </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-black text-lg text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition line-clamp-1">{f.name}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">{f.stateId?.name || "—"}</p>
                    <p className="text-[10px] text-slate-400 mb-4 truncate">{f.category} • {f.duration}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                       <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${f.isActive ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-500"}`}>
                        {f.isActive ? "Active" : "Hidden"}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={(e) => handleEditClick(e, f)} className="p-2 text-slate-400 hover:text-[#E85D04] bg-slate-50 dark:bg-slate-800 hover:bg-[#E85D04]/10 rounded-lg transition"><FaPencilAlt size={14} /></button>
                        <button onClick={(e) => handleDeleteClick(e, f._id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Festival?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action is permanent and cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 font-semibold rounded-xl text-sm hover:bg-slate-50 transition cursor-pointer">Cancel</button>
              <button onClick={() => deleteMutation.mutate(confirmDelete)} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default Festivals;
