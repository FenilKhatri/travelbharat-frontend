import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiBookOpen, FiPlus, FiTrash2, FiX, FiUpload, FiImage, FiChevronLeft, FiChevronRight, FiChevronDown, FiEye, FiEyeOff, FiList, FiGrid } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import http from "../../../lib/axios";
import { toast } from "react-toastify";

const CATEGORIES = [
  "travel-guide", "destination", "food", "culture", "adventure",
  "heritage", "festivals", "tips", "budget-travel", "luxury-travel", "wildlife", "spiritual", "other"
];

const Blogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminViewMode") || "list");

  useEffect(() => {
    localStorage.setItem("adminViewMode", viewMode);
  }, [viewMode]);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";

  const initialForm = {
    title: "", excerpt: "", content: "", category: "travel-guide",
    tags: "", isPublished: false, featured: false, isActive: true,
    images: { thumbnail: "", hero: "" }, priority: 0, seo: { metaTitle: "", metaDescription: "" }
  };
  const [form, setForm] = useState(initialForm);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminBlogs", page, search],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      return http.get("/blogs/admin/all", { params });
    },
    keepPreviousData: true,
  });

  const blogs = data?.data?.blogs || [];
  const pagination = data?.data?.pagination || { total: 0, pages: 1 };

  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/blogs/admin/create", payload),
    onSuccess: () => { toast.success("Blog created!"); setIsFormOpen(false); setForm(initialForm); queryClient.invalidateQueries(["adminBlogs"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create blog"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }) => http.put(`/blogs/admin/${id}`, payload),
    onSuccess: () => { toast.success("Blog updated!"); setIsFormOpen(false); setEditingBlog(null); setForm(initialForm); queryClient.invalidateQueries(["adminBlogs"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update blog"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => http.delete(`/blogs/admin/${id}`),
    onSuccess: () => { toast.success("Blog deleted!"); setConfirmDelete(null); queryClient.invalidateQueries(["adminBlogs"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to delete blog"),
  });

  // Quick publish toggle
  const togglePublish = useMutation({
    mutationFn: ({ id, val }) => http.put(`/blogs/admin/${id}`, { isPublished: val }),
    onSuccess: (_, { val }) => { toast.success(val ? "Blog published!" : "Blog unpublished!"); queryClient.invalidateQueries(["adminBlogs"]); },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update"),
  });

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(field);
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

  const handleEditClick = (b) => {
    setEditingBlog(b);
    setForm({
      title: b.title || "", excerpt: b.excerpt || "", content: b.content || "",
      category: b.category || "travel-guide", tags: (b.tags || []).join(", "),
      isPublished: b.isPublished || false, featured: b.featured || false, isActive: b.isActive ?? true,
      images: { thumbnail: b.images?.thumbnail || "", hero: b.images?.hero || "" },
      priority: b.priority || 0, seo: { metaTitle: b.seo?.metaTitle || "", metaDescription: b.seo?.metaDescription || "" }
    });
    setIsFormOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    if (editingBlog) {
      updateMutation.mutate({ id: editingBlog._id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isSubmitting = createMutation.isLoading || updateMutation.isLoading;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Blogs</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Create, manage and publish travel blog articles.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiGrid size={16} /></button>
          </div>
          <button
            onClick={() => { setEditingBlog(null); setForm(initialForm); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-sm transition cursor-pointer shrink-0"
          >
            <FiPlus size={16} /> New Blog Post
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search blogs..."
        value={search}
        onChange={(e) => setSearchParams((p) => { p.set("search", e.target.value); p.set("page", "1"); return p; })}
        className="px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm w-full max-w-xs bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20"
      />

      {/* Table / Grid */}
      <div className="bg-transparent">
        {viewMode === "list" ? (
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                <th className="py-4 px-6">Blog Post</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Read Time</th>
                <th className="py-4 px-6">Published</th>
                <th className="py-4 px-6">Views</th>
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
                <tr><td colSpan="6" className="text-center py-10 text-red-500 font-bold">Error loading blogs</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-12 text-slate-400 font-semibold">
                  <FiBookOpen size={36} className="mx-auto mb-3 text-slate-300" />
                  No blog posts yet.
                </td></tr>
              ) : blogs.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {b.images?.thumbnail ? (
                        <img src={b.images.thumbnail} alt={b.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><FiImage size={16} className="text-slate-400" /></div>
                      )}
                      <div>
                        <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{b.title}</p>
                        <p className="text-xs text-slate-400 line-clamp-1">{b.excerpt}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">{b.category?.replace(/-/g, " ")}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-500">{b.readTime || "—"} min</td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => togglePublish.mutate({ id: b._id, val: !b.isPublished })}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition ${b.isPublished ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"}`}
                    >
                      {b.isPublished ? <><FiEye size={12} /> Published</> : <><FiEyeOff size={12} /> Draft</>}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-slate-500">{b.views || 0}</td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEditClick(b)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"><FaPencilAlt size={15} /></button>
                      <button onClick={() => setConfirmDelete(b._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"><FiTrash2 size={15} /></button>
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
              <div className="col-span-full text-center py-10 text-red-500 font-bold">Error loading blogs</div>
            ) : blogs.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-semibold">No blogs registered.</div>
            ) : (
              blogs.map((b) => (
                <div key={b._id} className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group">
                  <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
                    {b.images?.thumbnail ? (
                      <img src={b.images.thumbnail} alt={b.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <FiImage size={32} />
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-1">
                       <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
                         {b.category?.replace(/-/g, " ")}
                       </span>
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-black text-lg text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition line-clamp-2">{b.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{b.excerpt}</p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <button
                        onClick={() => togglePublish.mutate({ id: b._id, val: !b.isPublished })}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition ${b.isPublished ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"}`}
                      >
                        {b.isPublished ? <><FiEye size={12} /> Published</> : <><FiEyeOff size={12} /> Draft</>}
                      </button>
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEditClick(b)} className="p-2 text-slate-400 hover:text-[#E85D04] bg-slate-50 dark:bg-slate-800 hover:bg-[#E85D04]/10 rounded-lg transition"><FaPencilAlt size={14} /></button>
                        <button onClick={() => setConfirmDelete(b._id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {!isLoading && !isError && pagination.pages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800/40">
            <span className="text-xs text-slate-400">Page {page} of {pagination.pages} ({pagination.total} total)</span>
            <div className="flex gap-2">
              <button disabled={page <= 1} onClick={() => setSearchParams((p) => { p.set("page", String(page - 1)); return p; })} className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-bold disabled:opacity-40"><FiChevronLeft size={14} /> Prev</button>
              <button disabled={page >= pagination.pages} onClick={() => setSearchParams((p) => { p.set("page", String(page + 1)); return p; })} className="flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-bold disabled:opacity-40">Next <FiChevronRight size={14} /></button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 dark:border-slate-800/45">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingBlog ? "Edit Blog Post" : "New Blog Post"}</h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 cursor-pointer"><FiX size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Blog post title..." className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5">Excerpt</label>
                <textarea rows={2} value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} placeholder="Short summary..." className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5">Content *</label>
                <textarea required rows={6} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Full blog content..." className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 font-mono" />
              </div>
              {/* Category */}
              <div className="relative">
                <label className="block text-sm font-semibold text-slate-500 mb-1.5">Category</label>
                <button type="button" onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="w-full flex items-center justify-between px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-200 bg-transparent capitalize">
                  <span>{form.category.replace(/-/g, " ")}</span>
                  <FiChevronDown size={16} className={`transition-transform ${isCategoryOpen ? "rotate-180" : ""}`} />
                </button>
                {isCategoryOpen && (
                  <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl max-h-48 overflow-y-auto">
                    {CATEGORIES.map((c) => (
                      <button key={c} type="button" onClick={() => { setForm({ ...form, category: c }); setIsCategoryOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm capitalize transition-colors ${form.category === c ? "bg-[#E85D04]/10 text-[#E85D04] font-semibold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"}`}>
                        {c.replace(/-/g, " ")}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5">Tags <span className="text-slate-400 font-normal">(comma separated)</span></label>
                <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. gujarat, heritage, travel" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
              </div>
              {/* Thumbnail upload */}
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-1.5">Thumbnail Image</label>
                <div className="flex items-center gap-3">
                  {form.images.thumbnail ? (
                    <img src={form.images.thumbnail} className="w-14 h-14 rounded-lg object-cover border border-slate-200" alt="thumb" />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center"><FiImage size={18} className="text-slate-400" /></div>
                  )}
                  <label className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-xs font-semibold rounded-lg cursor-pointer transition">
                    <FiUpload size={14} /> {uploadingImage === "thumbnail" ? "Uploading..." : "Upload"}
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "thumbnail")} className="hidden" disabled={!!uploadingImage} />
                  </label>
                </div>
              </div>
              {/* SEO */}
              <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">SEO</p>
                <input value={form.seo.metaTitle} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })} placeholder="Meta title" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none" />
                <textarea rows={2} value={form.seo.metaDescription} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })} placeholder="Meta description" className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none" />
              </div>
              {/* Flags */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <input type="checkbox" checked={form.isPublished} onChange={(e) => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4" /> Publish
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4" /> Featured
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-sm transition cursor-pointer">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-sm transition cursor-pointer disabled:opacity-60">
                  {editingBlog ? "Save Changes" : "Publish Post"}
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
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Blog Post?</h3>
            <p className="text-sm text-slate-500 mb-6">This action is permanent and cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 font-semibold rounded-xl text-sm cursor-pointer">Cancel</button>
              <button onClick={() => deleteMutation.mutate(confirmDelete)} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blogs;
