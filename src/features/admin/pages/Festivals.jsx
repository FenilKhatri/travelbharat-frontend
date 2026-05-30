import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FaCalendarCheck, FaPencilAlt } from "react-icons/fa";
import { FiPlus, FiTrash2, FiX, FiUpload, FiImage, FiChevronLeft, FiChevronRight, FiStar, FiChevronDown, FiList, FiGrid } from "react-icons/fi";
import http from "../../../lib/axios";
import { toast } from "react-toastify";

const CATEGORIES = ["religious", "cultural", "harvest", "national", "seasonal", "other"];
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

const Festivals = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isStateOpen, setIsStateOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminViewMode") || "list");

  useEffect(() => {
    localStorage.setItem("adminViewMode", viewMode);
  }, [viewMode]);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  const initialForm = {
    name: "", description: "", stateId: "", month: "", category: "cultural",
    duration: "", significance: "", featured: false, isActive: true,
    images: { thumbnail: "", hero: "" }, priority: 0
  };
  const [form, setForm] = useState(initialForm);

  // Fetch states for dropdown
  const { data: statesData } = useQuery({
    queryKey: ["statesForFestivals"],
    queryFn: () => http.get("/states/admin/all", { params: { limit: 100 } }),
  });
  const statesList = statesData?.data?.states || [];

  // Fetch festivals
  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminFestivals", page, search],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      return http.get("/festivals/admin/all", { params });
    },
    keepPreviousData: true,
  });

  const festivals = data?.data?.festivals || [];
  const pagination = data?.data?.pagination || { total: 0, pages: 1 };

  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/festivals/admin/create", payload),
    onSuccess: () => { toast.success("Festival created!"); setIsFormOpen(false); setForm(initialForm); queryClient.invalidateQueries(["adminFestivals"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create festival"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => http.put(`/festivals/admin/${id}`, payload),
    onSuccess: () => { toast.success("Festival updated!"); setIsFormOpen(false); setEditingFestival(null); setForm(initialForm); queryClient.invalidateQueries(["adminFestivals"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update festival"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => http.delete(`/festivals/admin/${id}`),
    onSuccess: () => { toast.success("Festival deleted!"); setConfirmDelete(null); queryClient.invalidateQueries(["adminFestivals"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete festival"),
  });

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await http.post("/upload/single", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data.image.url;
      setForm((prev) => ({ ...prev, images: { ...prev.images, [field]: url } }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEditClick = (f) => {
    setEditingFestival(f);
    setForm({
      name: f.name || "", description: f.description || "", stateId: f.stateId?._id || f.stateId || "",
      month: f.month || "", category: f.category || "cultural", duration: f.duration || "",
      significance: f.significance || "", featured: f.featured || false, isActive: f.isActive ?? true,
      images: { thumbnail: f.images?.thumbnail || "", hero: f.images?.hero || "" }, priority: f.priority || 0
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingFestival) {
      updateMutation.mutate({ id: editingFestival._id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Festivals</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage Indian festivals and cultural celebrations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiGrid size={16} /></button>
          </div>
          <button
            onClick={() => { setEditingFestival(null); setForm(initialForm); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-sm transition cursor-pointer shrink-0"
          >
            <FiPlus size={16} /> Add Festival
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search festivals..."
          value={search}
          onChange={(e) => setSearchParams((p) => { p.set("search", e.target.value); p.set("page", "1"); return p; })}
          className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm w-full max-w-xs bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20"
        />
      </div>

      {/* Table / Grid */}
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
                <tr><td colSpan="6" className="text-center py-10 text-red-500 font-bold">Error loading festivals</td></tr>
              ) : festivals.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-400 font-semibold">
                  <FaCalendarCheck size={36} className="mx-auto mb-3 text-slate-300" />
                  No festivals found.
                </td></tr>
              ) : festivals.map((f) => (
                <tr key={f._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition">
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
                      <button onClick={() => handleEditClick(f)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"><FaPencilAlt size={15} /></button>
                      <button onClick={() => setConfirmDelete(f._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
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
              <div className="col-span-full text-center py-10 text-red-500 font-bold">Error loading festivals</div>
            ) : festivals.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-semibold">No festivals registered.</div>
            ) : (
              festivals.map((f) => (
                <div key={f._id} className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group">
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
                        <button onClick={() => handleEditClick(f)} className="p-2 text-slate-400 hover:text-[#E85D04] bg-slate-50 dark:bg-slate-800 hover:bg-[#E85D04]/10 rounded-lg transition"><FaPencilAlt size={14} /></button>
                        <button onClick={() => setConfirmDelete(f._id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
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
            <span className="text-xs text-slate-400">Page {page} of {pagination.pages} ({pagination.total} total)</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setSearchParams((p) => { p.set("page", String(page - 1)); return p; })} className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold disabled:opacity-40"><FiChevronLeft size={14} /> Prev</button>
              <button disabled={page >= pagination.pages} onClick={() => setSearchParams((p) => { p.set("page", String(page + 1)); return p; })} className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold disabled:opacity-40">Next <FiChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800/45">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingFestival ? "Edit Festival" : "Add Festival"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Festival Name *</label>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Navratri" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
              </div>
              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Description *</label>
                <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description..." className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
              </div>
              {/* State Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Linked State *</label>
                <div className="relative">
                  <button type="button" onClick={() => setIsStateOpen(!isStateOpen)} className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-transparent">
                    <span>{statesList.find((s) => s._id === form.stateId)?.name || "Select State"}</span>
                    <FiChevronDown size={16} className={`transition-transform ${isStateOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isStateOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {statesList.map((s) => (
                        <button key={s._id} type="button" onClick={() => { setForm({ ...form, stateId: s._id }); setIsStateOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${form.stateId === s._id ? "bg-[#E85D04]/10 text-[#E85D04] font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Month + Category */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Month</label>
                  <button type="button" onClick={() => setIsMonthOpen(!isMonthOpen)} className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-transparent capitalize">
                    <span>{form.month || "Select Month"}</span>
                    <FiChevronDown size={16} className={`transition-transform ${isMonthOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isMonthOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                      {MONTHS.map((m) => (
                        <button key={m} type="button" onClick={() => { setForm({ ...form, month: m }); setIsMonthOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm capitalize transition-colors ${form.month === m ? "bg-[#E85D04]/10 text-[#E85D04] font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{m}</button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Category</label>
                  <button type="button" onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-transparent capitalize">
                    <span>{form.category}</span>
                    <FiChevronDown size={16} className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isCategoryOpen && (
                    <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
                      {CATEGORIES.map((c) => (
                        <button key={c} type="button" onClick={() => { setForm({ ...form, category: c }); setIsCategoryOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm capitalize transition-colors ${form.category === c ? "bg-[#E85D04]/10 text-[#E85D04] font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>{c}</button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* Duration + Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Duration</label>
                  <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 9 days" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Priority</label>
                  <input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                </div>
              </div>
              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Thumbnail Image</label>
                <div className="flex items-center gap-3">
                  {form.images.thumbnail ? (
                    <img src={form.images.thumbnail} alt="thumbnail" className="w-14 h-14 rounded-lg object-cover border border-slate-200" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><FiImage size={18} className="text-slate-400" /></div>
                  )}
                  <label className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition">
                    <FiUpload size={14} /> {uploadingImage ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "thumbnail")} className="hidden" disabled={uploadingImage} />
                  </label>
                </div>
              </div>
              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" />
                  Featured
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4" />
                  Active
                </label>
              </div>
              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-sm transition cursor-pointer disabled:opacity-60">
                  {editingFestival ? "Save Changes" : "Create Festival"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Festivals;
