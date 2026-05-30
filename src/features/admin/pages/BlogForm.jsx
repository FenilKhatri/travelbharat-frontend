import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiArrowLeft, FiUpload, FiPlus, FiTrash2, FiImage, FiSettings, FiAlignLeft, FiHelpCircle, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";
import http from "../../../lib/axios";

const CATEGORIES = [
  "travel-guide", "destination", "food", "culture", 
  "adventure", "heritage", "festivals", "tips", 
  "budget-travel", "luxury-travel", "wildlife", "spiritual", "other"
];

const INITIAL_FORM = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  category: "travel-guide",
  tags: [],
  images: { hero: "", thumbnail: "", gallery: [] },
  stateId: "",
  relatedCities: [],
  relatedDestinations: [],
  travelTips: [],
  faqs: [],
  priority: 0,
  featured: false,
  isPublished: false,
  seo: { metaTitle: "", metaDescription: "", keywords: [] },
};

const Section = ({ icon: Icon, title, action, children }) => (
  <div className="space-y-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
        {Icon && <Icon size={16} className="text-[#E85D04]" />}
        {title}
      </h3>
      {action}
    </div>
    {children}
  </div>
);

const Field = ({ label, required, children, span2 }) => (
  <div className={span2 ? "md:col-span-2" : ""}>
    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-[#E85D04]">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-[#E85D04]/30 focus:border-[#E85D04]/60 transition";

const AddBtn = ({ onClick, label }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1.5 text-xs font-bold text-[#E85D04] hover:text-[#C04D02] px-3 py-1.5 rounded-lg hover:bg-[#E85D04]/10 transition">
    <FiPlus size={14} /> {label}
  </button>
);

const ImageTile = ({ src, label, aspect, onUpload, uploading }) => (
  <div className="space-y-2">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{label}</label>
    <div className={`relative ${aspect} rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 group flex flex-col items-center justify-center`}>
      {src ? (
        <img src={src} alt={label} className="w-full h-full object-cover" />
      ) : (
        <div className="text-center p-4 pointer-events-none">
          <FiImage size={28} className="mx-auto text-slate-400 mb-1.5" />
          <span className="text-xs text-slate-400">No image</span>
        </div>
      )}
      <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center cursor-pointer">
        <span className="bg-white text-slate-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow">
          <FiUpload size={13} /> {uploading ? "Uploading…" : "Upload"}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
      </label>
    </div>
  </div>
);

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [uploadingImage, setUploadingImage] = useState(null);

  // States & Cities for Select
  const { data: statesData } = useQuery({ queryKey: ["adminStates"], queryFn: () => http.get("/states/admin/all?limit=100") });
  const { data: citiesData } = useQuery({ queryKey: ["adminCities"], queryFn: () => http.get("/cities/admin/all?limit=100") });
  const { data: placesData } = useQuery({ queryKey: ["adminPlaces"], queryFn: () => http.get("/places/admin/all?limit=100") });

  const states = statesData?.data?.data?.states || [];
  const cities = citiesData?.data?.data?.cities || [];
  const places = placesData?.data?.data?.places || [];

  const { data: queryData, isLoading: isFetching, isError } = useQuery({
    queryKey: ["adminBlog", id],
    queryFn: () => http.get(`/blogs/admin/${id}`),
    enabled: isEditing,
  });

  useEffect(() => {
    const b = queryData?.data?.data?.blog || queryData?.data?.blog;
    if (b) {
      setForm({
        title: b.title || "",
        slug: b.slug || "",
        content: b.content || "",
        excerpt: b.excerpt || "",
        category: b.category || "travel-guide",
        tags: b.tags || [],
        images: {
          hero: b.images?.hero || "",
          thumbnail: b.images?.thumbnail || "",
          gallery: b.images?.gallery || [],
        },
        stateId: b.stateId || "",
        relatedCities: b.relatedCities || [],
        relatedDestinations: b.relatedDestinations || [],
        travelTips: b.travelTips || [],
        faqs: b.faqs || [],
        priority: b.priority || 0,
        featured: b.featured || false,
        isPublished: b.isPublished || false,
        seo: {
          metaTitle: b.seo?.metaTitle || "",
          metaDescription: b.seo?.metaDescription || "",
          keywords: b.seo?.keywords || [],
        },
      });
    }
  }, [queryData]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load blog data");
      navigate("/admin/blogs");
    }
  }, [isError, navigate]);

  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/blogs/admin/create", payload),
    onSuccess: () => {
      toast.success("Blog created!");
      queryClient.invalidateQueries(["adminBlogs"]);
      navigate("/admin/blogs");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create blog"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => http.put(`/blogs/admin/${id}`, payload),
    onSuccess: () => {
      toast.success("Blog updated!");
      queryClient.invalidateQueries(["adminBlogs"]);
      navigate("/admin/blogs");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update blog"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (e, asPublished) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error("Title and Content are required.");
    const payload = { ...form, isPublished: asPublished };
    isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const handleImageUpload = async (e, fieldPath, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(fieldPath);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await http.post("/upload/single", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.data?.image?.url || res.data?.image?.url;
      if (isGallery) {
        setForm(prev => ({ ...prev, images: { ...prev.images, gallery: [...prev.images.gallery, url] } }));
      } else {
        const [parent, child] = fieldPath.split(".");
        setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: url } }));
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(null);
    }
  };

  const set = (path, value) => {
    const keys = path.split(".");
    if (keys.length === 1) setForm(prev => ({ ...prev, [path]: value }));
    else setForm(prev => ({ ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: value } }));
  };

  const handleStringArray = (field, raw) => {
    const arr = raw.split(",").map(s => s.trim()).filter(Boolean);
    const keys = field.split(".");
    if (keys.length === 2) setForm(prev => ({ ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: arr } }));
    else setForm(prev => ({ ...prev, [field]: arr }));
  };

  // Word Counter & Read Time
  const wordCount = form.content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  if (isFetching) return <div className="text-center p-10">Loading blog data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/blogs")} className="p-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><FiArrowLeft /></button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">{isEditing ? "Edit Blog Post" : "Create Blog Post"}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={(e) => handleSave(e, false)} disabled={isSaving} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition">
            Save as Draft
          </button>
          <button onClick={(e) => handleSave(e, true)} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition">
            <FiSave /> Publish Post
          </button>
        </div>
      </div>

      <form className="space-y-6">
        {/* Basic Details */}
        <Section title="Basic Information" icon={FiFileText}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Title" required><input value={form.title} onChange={e => set("title", e.target.value)} className={inputCls} /></Field>
            <Field label="Slug"><input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="Auto-generated if empty" className={inputCls} /></Field>
            <Field label="Category" required>
              <select value={form.category} onChange={e => set("category", e.target.value)} className={inputCls}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="State (Optional)">
              <select value={form.stateId} onChange={e => set("stateId", e.target.value)} className={inputCls}>
                <option value="">None</option>
                {states.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </Field>
            <Field label="Excerpt" span2><textarea rows={2} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} className={inputCls} /></Field>
            <Field label="Tags (comma separated)" span2><input value={form.tags.join(", ")} onChange={e => handleStringArray("tags", e.target.value)} className={inputCls} /></Field>
            <div className="flex gap-4 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-5 h-5 accent-[#E85D04]" /> <span className="font-bold text-sm">Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={e => set("isPublished", e.target.checked)} className="w-5 h-5 accent-[#E85D04]" /> <span className="font-bold text-sm">Published</span></label>
            </div>
          </div>
        </Section>

        {/* Content */}
        <Section title="Content Editor" icon={FiAlignLeft}>
          <div className="flex justify-between items-end mb-2">
             <div className="text-xs text-slate-500 font-bold">Supports Markdown formatting</div>
             <div className="flex gap-4 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                <span>Words: <span className="text-[#E85D04]">{wordCount}</span></span>
                <span>Read Time: <span className="text-[#E85D04]">{readTime} min</span></span>
             </div>
          </div>
          <textarea rows={20} value={form.content} onChange={e => set("content", e.target.value)} placeholder="Write your amazing post here..." className={`${inputCls} font-mono text-sm leading-relaxed p-5 resize-y`} required />
        </Section>

        {/* Images */}
        <Section title="Images" icon={FiImage}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageTile src={form.images.hero} label="Hero Image (16:9)" aspect="aspect-video" uploading={uploadingImage === "images.hero"} onUpload={e => handleImageUpload(e, "images.hero")} />
            <ImageTile src={form.images.thumbnail} label="Thumbnail (1:1)" aspect="aspect-square max-w-[250px]" uploading={uploadingImage === "images.thumbnail"} onUpload={e => handleImageUpload(e, "images.thumbnail")} />
          </div>
        </Section>

        {/* Travel Tips */}
        <Section title="Travel Tips" icon={FiHelpCircle} action={<AddBtn onClick={() => setForm(p => ({ ...p, travelTips: [...p.travelTips, ""] }))} label="Add Tip" />}>
           {form.travelTips.map((tip, i) => (
             <div key={i} className="flex gap-2 mb-2">
               <input value={tip} onChange={e => {
                 const newTips = [...form.travelTips];
                 newTips[i] = e.target.value;
                 setForm(p => ({ ...p, travelTips: newTips }));
               }} className={inputCls} placeholder={`Tip ${i+1}`} />
               <button type="button" onClick={() => {
                 setForm(p => ({ ...p, travelTips: p.travelTips.filter((_, idx) => idx !== i) }));
               }} className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"><FiTrash2 /></button>
             </div>
           ))}
        </Section>

        {/* FAQs */}
        <Section title="FAQs" icon={FiHelpCircle} action={<AddBtn onClick={() => setForm(p => ({ ...p, faqs: [...p.faqs, { question: "", answer: "" }] }))} label="Add FAQ" />}>
           {form.faqs.map((faq, i) => (
             <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 border rounded-xl relative mb-3">
               <button type="button" onClick={() => setForm(p => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }))} className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
               <input value={faq.question} onChange={e => {
                 const nf = [...form.faqs]; nf[i].question = e.target.value; setForm(p => ({...p, faqs: nf}));
               }} className={`${inputCls} mb-2 pr-10`} placeholder="Question" />
               <textarea value={faq.answer} onChange={e => {
                 const nf = [...form.faqs]; nf[i].answer = e.target.value; setForm(p => ({...p, faqs: nf}));
               }} className={`${inputCls} resize-y`} placeholder="Answer" rows={2} />
             </div>
           ))}
        </Section>

        {/* Related */}
        <Section title="Related Content" icon={FiSettings}>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Related Cities (Select Multiple)">
                <select multiple value={form.relatedCities} onChange={e => {
                  const vals = Array.from(e.target.selectedOptions, o => o.value);
                  setForm(p => ({ ...p, relatedCities: vals }));
                }} className={`${inputCls} h-32`}>
                   {cities.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Related Destinations">
                <select multiple value={form.relatedDestinations} onChange={e => {
                  const vals = Array.from(e.target.selectedOptions, o => o.value);
                  setForm(p => ({ ...p, relatedDestinations: vals }));
                }} className={`${inputCls} h-32`}>
                   {places.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </Field>
           </div>
        </Section>

        {/* SEO */}
        <Section title="SEO" icon={FiSettings}>
           <div className="space-y-4">
              <Field label="Meta Title"><input value={form.seo.metaTitle} onChange={e => set("seo.metaTitle", e.target.value)} className={inputCls} maxLength={60} />
              <div className="text-xs text-slate-400 mt-1">{form.seo.metaTitle.length}/60</div></Field>
              <Field label="Meta Description"><textarea value={form.seo.metaDescription} onChange={e => set("seo.metaDescription", e.target.value)} className={inputCls} rows={2} maxLength={160} />
              <div className="text-xs text-slate-400 mt-1">{form.seo.metaDescription.length}/160</div></Field>
              <Field label="Keywords (comma separated)"><input value={form.seo.keywords.join(", ")} onChange={e => handleStringArray("seo.keywords", e.target.value)} className={inputCls} /></Field>
           </div>
        </Section>

      </form>
    </div>
  );
};

export default BlogForm;
