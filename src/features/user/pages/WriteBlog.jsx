import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiX, FiUpload, FiImage, FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import http from "../../../lib/axios";
import { toast } from "react-toastify";

const CATEGORIES = [
  "travel-guide", "destination", "food", "culture", "adventure",
  "heritage", "festivals", "tips", "budget-travel", "luxury-travel", "wildlife", "spiritual", "other"
];

const WriteBlog = () => {
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const initialForm = {
    title: "", excerpt: "", body: "", category: "travel-guide",
    tags: "", status: "draft",
    images: { thumbnail: "", hero: "" }, seo: { metaTitle: "", metaDescription: "" }
  };
  const [form, setForm] = useState(initialForm);

  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/blogs/create", payload), // User-specific endpoint
    onSuccess: () => { 
      toast.success("Blog created successfully!"); 
      navigate("/user/saved-blogs"); // or some other page
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create blog"),
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      content: form.body, // Mapping body to the backend's expected 'content'
      isPublished: form.status === 'published', // Mapping status to backend's 'isPublished'
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    createMutation.mutate(payload);
  };

  const isSubmitting = createMutation.isLoading;

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Write a Blog</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Share your travel experiences with the community.</p>
      </div>

      <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
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
            <label className="block text-sm font-semibold text-slate-500 mb-1.5">Content (Body) *</label>
            <textarea required rows={8} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Full blog content..." className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20 font-mono" />
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
          {/* Status */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">
              <input type="radio" checked={form.status === 'published'} onChange={() => setForm({ ...form, status: 'published' })} className="w-4 h-4" /> Publish
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">
              <input type="radio" checked={form.status === 'draft'} onChange={() => setForm({ ...form, status: 'draft' })} className="w-4 h-4" /> Draft
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <button type="button" onClick={() => navigate("/user/profile")} className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-sm transition cursor-pointer">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-sm transition cursor-pointer disabled:opacity-60">
              Submit Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteBlog;
