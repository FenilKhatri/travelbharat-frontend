import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiArrowLeft, FiUpload, FiImage, FiPlus, FiTrash2, FiSearch, FiMap } from "react-icons/fi";
import { FaCalendarCheck } from "react-icons/fa";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import PageLoader from "../../../components/ui/PageLoader";

/*  Constants  */
const CATEGORIES = ["religious", "cultural", "harvest", "national", "seasonal", "other"];
const MONTHS = [
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december"
];

const INITIAL_FORM = {
  name: "",
  slug: "",
  stateId: "",
  description: "",
  overview: "",
  images: { hero: "", thumbnail: "", gallery: [] },
  month: "",
  duration: "",
  highlights: [],
  significance: "",
  celebrations: "",
  bestPlacesToCelebrate: [],
  travelTips: [],
  category: "cultural",
  featured: false,
  isActive: true,
  priority: 0,
  seo: { metaTitle: "", metaDescription: "", keywords: [] },
};

/*  Sub-components  */
const Field = ({ label, required, children, span2 }) => (
  <div className={span2 ? "md:col-span-2" : ""}>
    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-[#E85D04]">*</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 focus:border-[#E85D04]/60 transition";

const AddBtn = ({ onClick, label }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 text-xs font-bold text-[#E85D04] hover:text-[#C04D02] px-3 py-1.5 rounded-lg hover:bg-[#E85D04]/10 transition"
  >
    <FiPlus size={14} /> {label}
  </button>
);

const ImageTile = ({ src, label, aspect, onUpload, uploading }) => (
  <div className="space-y-2">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div
      className={`relative ${aspect} rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 group flex flex-col items-center justify-center`}
    >
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
          <FiUpload size={13} />
          {uploading ? "Uploading…" : "Upload"}
        </span>
        <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
      </label>
    </div>
  </div>
);

/*  Main Component  */
const FestivalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [uploadingImage, setUploadingImage] = useState(null);

  /*  Fetch States for Dropdown  */
  const { data: statesData } = useQuery({
    queryKey: ["adminStatesList"],
    queryFn: async () => {
      const res = await http.get("/states/admin/all?limit=100");
      return res.data;
    }
  });
  const statesList = statesData?.data?.states || statesData?.states || [];

  /*  Fetch existing festival  */
  const {
    data: queryData,
    isLoading: isFetching,
    isError,
  } = useQuery({
    queryKey: ["adminFestival", id],
    queryFn: async () => {
      const res = await http.get(`/festivals/admin/${id}`);
      return res.data;
    },
    enabled: isEditing,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (queryData?.data?.festival || queryData?.festival) {
      const f = queryData?.data?.festival || queryData?.festival;
      setForm({
        name: f.name || "",
        slug: f.slug || "",
        stateId: f.stateId?._id || f.stateId || "",
        description: f.description || "",
        overview: f.overview || "",
        images: {
          hero: f.images?.hero || "",
          thumbnail: f.images?.thumbnail || "",
          gallery: f.images?.gallery || [],
        },
        month: f.month || "",
        duration: f.duration || "",
        highlights: f.highlights || [],
        significance: f.significance || "",
        celebrations: f.celebrations || "",
        bestPlacesToCelebrate: f.bestPlacesToCelebrate || [],
        travelTips: f.travelTips || [],
        category: f.category || "cultural",
        featured: f.featured || false,
        isActive: f.isActive ?? true,
        priority: f.priority || 0,
        seo: {
          metaTitle: f.seo?.metaTitle || "",
          metaDescription: f.seo?.metaDescription || "",
          keywords: f.seo?.keywords || [],
        },
      });
    }
  }, [queryData]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load festival data");
      navigate("/admin/festivals");
    }
  }, [isError, navigate]);

  /*  Mutations  */
  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/festivals/admin/create", payload),
    onSuccess: () => {
      toast.success("Festival created successfully!");
      queryClient.invalidateQueries(["adminFestivals"]);
      navigate("/admin/festivals");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create festival"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => http.put(`/festivals/admin/${id}`, payload),
    onSuccess: () => {
      toast.success("Festival updated successfully!");
      queryClient.invalidateQueries(["adminFestivals"]);
      queryClient.invalidateQueries(["adminFestival", id]);
      navigate("/admin/festivals");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update festival"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (e, asDraft = false) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) return toast.error("Festival name is required");
    if (!form.stateId) return toast.error("State selection is required");
    if (!form.description.trim()) return toast.error("Description is required");
    const payload = { ...form, isActive: !asDraft };
    isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const handleSubmit = (e) => handleSave(e, false);

  /*  Image upload  */
  const handleImageUpload = async (e, fieldPath, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(fieldPath);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await http.post("/upload/single", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data?.data?.image?.url || res.data?.image?.url;
      if (!url) throw new Error("URL missing in response");

      if (isGallery) {
        setForm((prev) => ({
          ...prev,
          images: { ...prev.images, gallery: [...prev.images.gallery, url] },
        }));
      } else {
        const [parent, child] = fieldPath.split(".");
        setForm((prev) => ({
          ...prev,
          [parent]: { ...prev[parent], [child]: url },
        }));
      }
      toast.success("Image uploaded!");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploadingImage(null);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploadingImage("images.gallery");
    const fd = new FormData();
    files.forEach(file => fd.append("images", file));
    try {
      const res = await http.post("/upload/multiple", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const urls = res.data?.data?.images?.map(img => img.url) || res.data?.images?.map(img => img.url);
      if (urls && urls.length > 0) {
        setForm((prev) => ({
          ...prev,
          images: { ...prev.images, gallery: [...prev.images.gallery, ...urls] }
        }));
        toast.success("Gallery images uploaded!");
      } else {
        throw new Error("No image URLs returned from server");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Upload failed");
    } finally {
      setUploadingImage(null);
    }
  };

  /*  Helpers  */
  const set = (path, value) => {
    const keys = path.split(".");
    if (keys.length === 1) {
      setForm((prev) => ({ ...prev, [path]: value }));
    } else {
      const [parent, child] = keys;
      setForm((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    }
  };

  const handleStringArray = (field, raw) => {
    const arr = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const keys = field.split(".");
    if (keys.length === 2) {
      setForm((prev) => ({ ...prev, [keys[0]]: { ...prev[keys[0]], [keys[1]]: arr } }));
    } else {
      setForm((prev) => ({ ...prev, [field]: arr }));
    }
  };

  const removeGalleryImg = (idx) =>
    setForm((prev) => ({
      ...prev,
      images: { ...prev.images, gallery: prev.images.gallery.filter((_, i) => i !== idx) },
    }));

  const addItem = (field, template) =>
    setForm((prev) => ({ ...prev, [field]: [...prev[field], { ...template }] }));

  const removeItem = (field, idx) =>
    setForm((prev) => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));

  const changeItem = (field, idx, key, val) =>
    setForm((prev) => {
      const arr = [...prev[field]];
      arr[idx] = { ...arr[idx], [key]: val };
      return { ...prev, [field]: arr };
    });

  /*  Loading  */
  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <PageLoader fullScreen={false} message="Loading festival data..." size="md" />
      </div>
    );
  }

  /*  RENDER  */
  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16 px-4 sm:px-0">
      {/*  Sticky Header  */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0A121F] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/festivals")}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {isEditing ? "Edit Festival" : "Create New Festival"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage details for this cultural event.</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={(e) => handleSave(e, true)}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-60 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm shadow transition cursor-pointer"
          >
            {isSaving ? "Saving…" : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={(e) => handleSave(e, false)}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow transition cursor-pointer"
          >
            <FiSave size={16} />
            {isSaving ? "Publishing…" : isEditing ? "Save & Publish" : "Publish Festival"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/*  CARD 1: GENERAL  */}
        <Card title="General Details" icon={FaCalendarCheck}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Festival Name" required>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Diwali" className={inputCls} />
            </Field>

            <Field label="Select State" required>
              <CustomDropdown
                value={form.stateId}
                onChange={(val) => set("stateId", val)}
                options={statesList.map(s => ({ value: s._id, label: s.name }))}
                placeholder="Select a state..."
                searchable
              />
            </Field>

            <Field label="Category">
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls + " capitalize"}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>

            <Field label="Month">
              <select value={form.month} onChange={(e) => set("month", e.target.value)} className={inputCls + " capitalize"}>
                <option value="">Select Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>

            <Field label="Duration">
              <input value={form.duration} onChange={(e) => set("duration", e.target.value)}
                placeholder="e.g. 5 days" className={inputCls} />
            </Field>

            <Field label="Slug">
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                placeholder="e.g. diwali (auto if empty)" className={inputCls} />
            </Field>

            <Field label="Description" required span2>
              <textarea required rows={5} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="A compelling introduction to the festival…"
                className={inputCls + " resize-none"} />
            </Field>

            <Field label="Extended Overview" span2>
              <textarea rows={10} value={form.overview}
                onChange={(e) => set("overview", e.target.value)}
                placeholder="Detailed overview…"
                className={inputCls + " resize-none"} />
            </Field>

            <div className="md:col-span-2">
              <div className="flex gap-6 flex-wrap p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured Festival" accent="#E85D04" />
                <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label="Publicly Active" accent="#22c55e" />
              </div>
            </div>
          </div>
        </Card>

        {/*  CARD 2: MEDIA  */}
        <Card title="Imagery" icon={FiImage}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageTile src={form.images.hero} label="Hero Banner (Landscape)" aspect="aspect-video"
              uploading={uploadingImage === "images.hero"} onUpload={(e) => handleImageUpload(e, "images.hero")} />
            <ImageTile src={form.images.thumbnail} label="Thumbnail (Square)" aspect="aspect-square max-w-[220px]"
              uploading={uploadingImage === "images.thumbnail"} onUpload={(e) => handleImageUpload(e, "images.thumbnail")} />
          </div>

          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Image Gallery ({form.images.gallery.length})</span>
              <label className={`cursor-pointer flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${uploadingImage === "images.gallery" ? "text-slate-400 bg-slate-100 dark:bg-slate-800" : "text-[#E85D04] hover:text-[#C04D02] hover:bg-[#E85D04]/10"}`}>
                <FiPlus size={14} /> {uploadingImage === "images.gallery" ? "Uploading..." : "Add Images"}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={!!uploadingImage} />
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {form.images.gallery.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                  <img src={url} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryImg(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow">
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))}
              {form.images.gallery.length === 0 && <EmptyState text="No gallery images yet. Click Add Image to upload." />}
            </div>
          </div>
        </Card>

        {/*  CARD 3: DETAILS  */}
        <Card title="Cultural Details" icon={FaCalendarCheck}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Significance" span2>
              <textarea rows={4} value={form.significance}
                onChange={(e) => set("significance", e.target.value)}
                placeholder="Cultural or religious significance…"
                className={inputCls + " resize-none"} />
            </Field>

            <Field label="Celebrations" span2>
              <textarea rows={4} value={form.celebrations}
                onChange={(e) => set("celebrations", e.target.value)}
                placeholder="How is it celebrated? Rituals, food, events…"
                className={inputCls + " resize-none"} />
            </Field>

            <Field label="Highlights (comma separated)">
              <input value={form.highlights.join(", ")} onChange={(e) => handleStringArray("highlights", e.target.value)} className={inputCls} placeholder="e.g. Diya lighting, Rangoli, Fireworks" />
            </Field>

            <Field label="Travel Tips (comma separated)">
              <input value={form.travelTips.join(", ")} onChange={(e) => handleStringArray("travelTips", e.target.value)} className={inputCls} placeholder="e.g. Book tickets early, Beware of crowds" />
            </Field>
          </div>
        </Card>

        {/*  CARD 4: BEST PLACES TO CELEBRATE  */}
        <Card title="Best Places To Celebrate" icon={FiMap} action={<AddBtn onClick={() => addItem("bestPlacesToCelebrate", { name: "", description: "" })} label="Add Place" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {form.bestPlacesToCelebrate.map((n, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
                <button type="button" onClick={() => removeItem("bestPlacesToCelebrate", i)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 transition"><FiTrash2 size={14} /></button>
                <div className="space-y-3 pt-1">
                  <input value={n.name} onChange={(e) => changeItem("bestPlacesToCelebrate", i, "name", e.target.value)} placeholder="Place Name e.g. Ayodhya" className={inputCls} />
                  <textarea rows={3} value={n.description} onChange={(e) => changeItem("bestPlacesToCelebrate", i, "description", e.target.value)} placeholder="Description" className={inputCls + " resize-none"} />
                </div>
              </div>
            ))}
            {form.bestPlacesToCelebrate.length === 0 && <div className="lg:col-span-2"><EmptyState text="No best places added yet." /></div>}
          </div>
        </Card>

        {/*  CARD 5: SEO  */}
        <Card title="SEO Configuration" icon={FiSearch}>
          <div className="space-y-5">
            <Field label="Meta Title">
              <input value={form.seo.metaTitle} onChange={(e) => set("seo.metaTitle", e.target.value)} className={inputCls} />
            </Field>
            <Field label="Meta Description">
              <textarea rows={2} value={form.seo.metaDescription} onChange={(e) => set("seo.metaDescription", e.target.value)} className={inputCls + " resize-none"} />
            </Field>
            <Field label="Keywords (comma separated)">
              <input value={form.seo.keywords.join(", ")} onChange={(e) => handleStringArray("seo.keywords", e.target.value)} className={inputCls} />
            </Field>
          </div>
        </Card>

      </form>
    </div>
  );
};

/*  Utility sub-components  */
const Card = ({ title, icon: Icon, action, children }) => (
  <div className="bg-white dark:bg-[#0A121F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
      <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
        {Icon && <Icon size={16} className="text-[#E85D04]" />}
        {title}
      </h3>
      {action}
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const Toggle = ({ checked, onChange, label, accent }) => (
  <label className="flex items-center gap-2.5 cursor-pointer select-none">
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "" : "bg-slate-300 dark:bg-slate-700"}`} style={{ backgroundColor: checked ? accent : undefined }}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
  </label>
);

const EmptyState = ({ text }) => (
  <div className="py-8 text-center text-slate-400 text-sm rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
    {text}
  </div>
);

export default FestivalForm;
