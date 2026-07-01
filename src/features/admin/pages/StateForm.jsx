import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiArrowLeft, FiUpload, FiPlus, FiTrash2, FiImage, FiMapPin, FiCloud, FiNavigation, FiBook, FiSearch, FiChevronDown } from "react-icons/fi";
import { FaUtensils, FaSlidersH, FaStar } from "react-icons/fa";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import BadgeSelector from "../components/BadgeSelector";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import PageLoader from "../../../components/ui/PageLoader";

/*  Constants  */
const REGIONS = [
  { value: "north",     label: "North India"     },
  { value: "south",     label: "South India"     },
  { value: "east",      label: "East India"      },
  { value: "west",      label: "West India"      },
  { value: "central",   label: "Central India"   },
  { value: "northeast", label: "Northeast India" },
];

const INITIAL_FORM = {
  name: "",
  slug: "",
  tagline: "",
  description: "",
  overview: "",
  capital: "",
  languages: [],
  images: { hero: "", thumbnail: "", gallery: [] },
  stateBranding: { leftBackground: "", rightBackground: "", patternImage: "", overlayImage: "" },
  highlights: [],
  food: [],
  history: "",
  culture: "",
  weather: { summer: "", winter: "", monsoon: "", bestSeason: "" },
  bestTimeToVisit: "",
  transport: { byAir: "", byTrain: "", byRoad: "", local: "" },
  travelTips: [],
  mapCoordinates: { lat: 0, lng: 0 },
  region: "west",
  totalCities: 0,
  totalPlaces: 0,
  priority: 0,
  featured: false,
  isActive: true,
  badges: [],
  primaryBadge: "",
  seo: { metaTitle: "", metaDescription: "", keywords: [] },
};

/*  Sub-components  */

/** Styled section wrapper */
const Section = ({ icon: Icon, title, action, children }) => (
  <div className="space-y-5">
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

/** Re-usable label + input wrapper */
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

import AdminImageTile from "../components/ui/AdminImageTile";


/*  Main Component  */
const StateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [uploadingImage, setUploadingImage] = useState(null);

  /*  Fetch existing state  */
  const {
    data: queryData,
    isLoading: isFetching,
    isError,
  } = useQuery({
    queryKey: ["adminState", id],
    queryFn: async () => {
      const res = await http.get(`/states/admin/${id}`);
      return res;
    },
    enabled: isEditing,
    staleTime: 30_000,
  });

  useEffect(() => {
    const s = queryData?.data?.state || queryData?.state;
    if (s) {
      setForm({
        name:           s.name          ?? "",
        slug:           s.slug          ?? "",
        tagline:        s.tagline       ?? "",
        description:    s.description   ?? "",
        overview:       s.overview      ?? "",
        capital:        s.capital       ?? "",
        languages:      s.languages     ?? [],
        images: {
          hero:      s.images?.hero      ?? "",
          thumbnail: s.images?.thumbnail ?? "",
          gallery:   s.images?.gallery   ?? [],
        },
        stateBranding: {
          leftBackground: s.stateBranding?.leftBackground ?? "",
          rightBackground: s.stateBranding?.rightBackground ?? "",
          patternImage: s.stateBranding?.patternImage ?? "",
          overlayImage: s.stateBranding?.overlayImage ?? "",
        },
        highlights:     s.highlights    ?? [],
        food:           s.food          ?? [],
        history:        s.history       ?? "",
        culture:        s.culture       ?? "",
        weather: {
          summer:     s.weather?.summer     ?? "",
          winter:     s.weather?.winter     ?? "",
          monsoon:    s.weather?.monsoon    ?? "",
          bestSeason: s.weather?.bestSeason ?? "",
        },
        bestTimeToVisit: s.bestTimeToVisit ?? "",
        transport: {
          byAir:   s.transport?.byAir   ?? "",
          byTrain: s.transport?.byTrain ?? "",
          byRoad:  s.transport?.byRoad  ?? "",
          local:   s.transport?.local   ?? "",
        },
        travelTips: s.travelTips ?? [],
        mapCoordinates: {
          lat: s.mapCoordinates?.lat ?? 0,
          lng: s.mapCoordinates?.lng ?? 0,
        },
        region:      s.region      ?? "west",
        totalCities: s.totalCities ?? 0,
        totalPlaces: s.totalPlaces ?? 0,
        priority:    s.priority    ?? 0,
        featured:    s.featured    ?? false,
        isActive:    s.isActive    ?? true,
        badges:      s.badges      ?? [],
        primaryBadge: s.primaryBadge ?? "",
        seo: {
          metaTitle:       s.seo?.metaTitle       ?? "",
          metaDescription: s.seo?.metaDescription ?? "",
          keywords:        s.seo?.keywords        ?? [],
        },
      });
    }
  }, [queryData]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load state data");
      navigate("/admin/states");
    }
  }, [isError, navigate]);

  /*  Mutations  */
  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/states/admin/create", payload),
    onSuccess: () => {
      toast.success("State created successfully!");
      queryClient.invalidateQueries(["adminStates"]);
      navigate("/admin/states");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create state"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => http.put(`/states/admin/${id}`, payload),
    onSuccess: () => {
      toast.success("State updated successfully!");
      queryClient.invalidateQueries(["adminStates"]);
      queryClient.invalidateQueries(["adminState", id]);
      navigate("/admin/states");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update state"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (e, asDraft = false) => {
    if (e) e.preventDefault();
    if (!form.name.trim())        return toast.error("State name is required");
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

  const removeGalleryImg = (idx) =>
    setForm((prev) => ({
      ...prev,
      images: { ...prev.images, gallery: prev.images.gallery.filter((_, i) => i !== idx) },
    }));

  /*  Loading  */
  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <PageLoader fullScreen={false} message="Loading state data..." size="md" />
      </div>
    );
  }

  /*  RENDER  */
  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16 px-4 sm:px-0">

      {/*  Sticky Header  */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0A121F] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/states")}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {isEditing ? "Edit State" : "Create New State"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Fill in comprehensive details for the destination guide.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
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
            {isSaving ? "Publishing…" : isEditing ? "Save & Publish" : "Publish State"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ══════════════ CARD 1: GENERAL ══════════════ */}
        <Card title="General Details" icon={FiBook}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="State Name" required>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Gujarat" className={inputCls} />
            </Field>

            <Field label="Slug">
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                placeholder="e.g. gujarat (auto if empty)" className={inputCls} />
            </Field>

            <Field label="Capital City">
              <input value={form.capital} onChange={(e) => set("capital", e.target.value)}
                placeholder="e.g. Gandhinagar" className={inputCls} />
            </Field>

            <Field label="Region">
                <CustomDropdown
                  value={form.region}
                  onChange={(val) => set("region", val)}
                  options={REGIONS}
                  placeholder="Select Region"
                />
            </Field>

            <Field label="Tagline" span2>
              <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)}
                placeholder="e.g. The Heart of Incredible India" className={inputCls} />
            </Field>

            <Field label="Description" required span2>
              <textarea required rows={4} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="A compelling introduction to the state…"
                className={inputCls + " resize-none"} />
            </Field>

            <Field label="Extended Overview" span2>
              <textarea rows={3} value={form.overview}
                onChange={(e) => set("overview", e.target.value)}
                placeholder="Detailed overview for the dedicated state page…"
                className={inputCls + " resize-none"} />
            </Field>

            <Field label="Languages Spoken (comma separated)" span2>
              <input value={form.languages.join(", ")}
                onChange={(e) => handleStringArray("languages", e.target.value)}
                placeholder="e.g. Gujarati, Hindi, English" className={inputCls} />
            </Field>
          </div>
        </Card>

        {/* ══════════════ CARD 2: LOCATION & SETTINGS ══════════════ */}
        <Card title="Location & Settings" icon={FiMapPin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Map Latitude">
              <input type="number" step="any" value={form.mapCoordinates.lat}
                onChange={(e) => set("mapCoordinates.lat", parseFloat(e.target.value) || 0)}
                className={inputCls} />
            </Field>

            <Field label="Map Longitude">
              <input type="number" step="any" value={form.mapCoordinates.lng}
                onChange={(e) => set("mapCoordinates.lng", parseFloat(e.target.value) || 0)}
                className={inputCls} />
            </Field>

            <Field label="Display Priority">
              <input type="number" min={0} value={form.priority}
                onChange={(e) => set("priority", parseInt(e.target.value) || 0)}
                className={inputCls} />
            </Field>

            <Field label="Total Cities">
              <input type="number" disabled value={form.totalCities}
                className={`${inputCls} opacity-50 cursor-not-allowed`}
                title="Auto-calculated from linked cities" />
            </Field>

            <Field label="Total Places">
              <input type="number" disabled value={form.totalPlaces}
                className={`${inputCls} opacity-50 cursor-not-allowed`}
                title="Auto-calculated from linked places" />
            </Field>

            <div className="md:col-span-2">
              <div className="flex gap-6 flex-wrap p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <Toggle
                  checked={form.featured}
                  onChange={(v) => set("featured", v)}
                  label="Featured State"
                  accent="#E85D04"
                />
                <Toggle
                  checked={form.isActive}
                  onChange={(v) => set("isActive", v)}
                  label="Publicly Active"
                  accent="#22c55e"
                />
              </div>
            </div>

            <Field label="Badges" span2>
              <BadgeSelector 
                selectedBadges={form.badges} 
                primaryBadge={form.primaryBadge} 
                onChange={(badges, primary) => setForm(prev => ({ ...prev, badges, primaryBadge: primary }))} 
              />
            </Field>
          </div>
        </Card>

        {/* ══════════════ CARD 3: MEDIA ══════════════ */}
        <Card title="State Imagery" icon={FiImage}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageTile src={(form.images.hero?.url || form.images.hero)?.url || (form.images.hero?.url || form.images.hero)}
              label="Hero Banner (Landscape)"
              aspect="aspect-video"
              uploading={uploadingImage === "images.hero"}
              onUpload={(e) => handleImageUpload(e, "images.hero")}
            />
            <ImageTile src={(form.images.thumbnail?.url || form.images.thumbnail)?.url || (form.images.thumbnail?.url || form.images.thumbnail)}
              label="Thumbnail (Square)"
              aspect="aspect-square max-w-[220px]"
              uploading={uploadingImage === "images.thumbnail"}
              onUpload={(e) => handleImageUpload(e, "images.thumbnail")}
            />
          </div>

          {/* Gallery */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Image Gallery ({form.images.gallery.length})
              </span>
              <label className={`cursor-pointer flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition ${uploadingImage === "images.gallery" ? "text-slate-400 bg-slate-100 dark:bg-slate-800" : "text-[#E85D04] hover:text-[#C04D02] hover:bg-[#E85D04]/10"}`}>
                <FiPlus size={14} /> {uploadingImage === "images.gallery" ? "Uploading..." : "Add Images"}
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={!!uploadingImage} />
              </label>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {form.images.gallery.map((url, i) => (
                <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200 dark:border-slate-700">
                  <img src={url} alt={`gallery-${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeGalleryImg(i)}
                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow">
                    <FiTrash2 size={12} />
                  </button>
                </div>
              ))}
              {form.images.gallery.length === 0 && (
                <div className="col-span-full py-10 text-center text-slate-400 text-sm rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                  No gallery images yet. Click <strong>Add Image</strong> to upload.
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* ══════════════ CARD 3B: STATE BRANDING ══════════════ */}
        <Card title="State Branding Imagery" icon={FiImage}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdminImageTile
              src={(form.stateBranding.leftBackground?.url || form.stateBranding.leftBackground)?.url || (form.stateBranding.leftBackground?.url || form.stateBranding.leftBackground)}
              label="Left Background"
              aspect="aspect-[3/4]"
              uploading={uploadingImage === "stateBranding.leftBackground"}
              onUpload={(e) => handleImageUpload(e, "stateBranding.leftBackground")}
            />
            <AdminImageTile
              src={(form.stateBranding.rightBackground?.url || form.stateBranding.rightBackground)?.url || (form.stateBranding.rightBackground?.url || form.stateBranding.rightBackground)}
              label="Right Background"
              aspect="aspect-[3/4]"
              uploading={uploadingImage === "stateBranding.rightBackground"}
              onUpload={(e) => handleImageUpload(e, "stateBranding.rightBackground")}
            />
            <AdminImageTile
              src={(form.stateBranding.patternImage?.url || form.stateBranding.patternImage)?.url || (form.stateBranding.patternImage?.url || form.stateBranding.patternImage)}
              label="Decorative Pattern"
              aspect="aspect-square"
              uploading={uploadingImage === "stateBranding.patternImage"}
              onUpload={(e) => handleImageUpload(e, "stateBranding.patternImage")}
            />
            <AdminImageTile
              src={(form.stateBranding.overlayImage?.url || form.stateBranding.overlayImage)?.url || (form.stateBranding.overlayImage?.url || form.stateBranding.overlayImage)}
              label="Illustration Overlay"
              aspect="aspect-video"
              uploading={uploadingImage === "stateBranding.overlayImage"}
              onUpload={(e) => handleImageUpload(e, "stateBranding.overlayImage")}
            />
          </div>
        </Card>

        {/* ══════════════ CARD 4: HISTORY & CULTURE ══════════════ */}
        <Card title="History & Culture" icon={FiBook}>
          <div className="grid grid-cols-1 gap-5">
            <Field label="History">
              <textarea rows={5} value={form.history}
                onChange={(e) => set("history", e.target.value)}
                placeholder="Historical background of the state…"
                className={inputCls + " resize-none"} />
            </Field>
            <Field label="Culture">
              <textarea rows={5} value={form.culture}
                onChange={(e) => set("culture", e.target.value)}
                placeholder="Cultural traditions, festivals, arts…"
                className={inputCls + " resize-none"} />
            </Field>
          </div>
        </Card>

        {/* ══════════════ CARD 5: HIGHLIGHTS ══════════════ */}
        <Card
          title="Key Highlights"
          action={<AddBtn onClick={() => addItem("highlights", { title: "", description: "", icon: "" })} label="Add Highlight" />}
        >
          <div className="space-y-3">
            {form.highlights.map((h, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
                <button type="button" onClick={() => removeItem("highlights", i)}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                  <FiTrash2 size={14} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Title</label>
                    <input value={h.title} onChange={(e) => changeItem("highlights", i, "title", e.target.value)}
                      className={inputCls} placeholder="e.g. Rann of Kutch" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Icon Name (Optional)</label>
                    <input value={h.icon} onChange={(e) => changeItem("highlights", i, "icon", e.target.value)}
                      className={inputCls} placeholder="e.g. FiMap" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                    <textarea rows={2} value={h.description}
                      onChange={(e) => changeItem("highlights", i, "description", e.target.value)}
                      className={inputCls + " resize-none"} />
                  </div>
                </div>
              </div>
            ))}
            {form.highlights.length === 0 && <EmptyState text="No highlights added yet." />}
          </div>
        </Card>

        {/* ══════════════ CARD 6: FOOD ══════════════ */}
        <Card
          title="Famous Food Items"
          icon={FaUtensils}
          action={<AddBtn onClick={() => addItem("food", { name: "", description: "", image: "", isVeg: true })} label="Add Food" />}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.food.map((f, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
                <button type="button" onClick={() => removeItem("food", i)}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                  <FiTrash2 size={14} />
                </button>
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Food Name</label>
                    <input value={f.name} onChange={(e) => changeItem("food", i, "name", e.target.value)}
                      placeholder="e.g. Dhokla" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                    <textarea rows={2} value={f.description}
                      onChange={(e) => changeItem("food", i, "description", e.target.value)}
                      className={inputCls + " resize-none"} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Image URL (Optional)</label>
                    <input value={f.image} onChange={(e) => changeItem("food", i, "image", e.target.value)}
                      placeholder="https://…" className={inputCls} />
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold select-none">
                    <input type="checkbox" checked={f.isVeg}
                      onChange={(e) => changeItem("food", i, "isVeg", e.target.checked)}
                      className="w-4 h-4 accent-green-500 rounded" />
                    <span className={f.isVeg ? "text-green-600" : "text-red-500"}>
                      {f.isVeg ? "🟢 Vegetarian" : "🔴 Non-Vegetarian"}
                    </span>
                  </label>
                </div>
              </div>
            ))}
            {form.food.length === 0 && (
              <div className="md:col-span-2"><EmptyState text="No food items added yet." /></div>
            )}
          </div>
        </Card>

        {/* ══════════════ CARD 7: WEATHER & TIMING ══════════════ */}
        <Card title="Weather & Timing" icon={FiCloud}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="☀️ Summer">
              <input value={form.weather.summer}
                onChange={(e) => set("weather.summer", e.target.value)}
                placeholder="e.g. March–June (25°C – 45°C)" className={inputCls} />
            </Field>

            <Field label="🌧️ Monsoon">
              <input value={form.weather.monsoon}
                onChange={(e) => set("weather.monsoon", e.target.value)}
                placeholder="e.g. July–September" className={inputCls} />
            </Field>

            <Field label="❄️ Winter">
              <input value={form.weather.winter}
                onChange={(e) => set("weather.winter", e.target.value)}
                placeholder="e.g. October–February (10°C – 25°C)" className={inputCls} />
            </Field>

            <Field label="Best Season (Summary)">
              <input value={form.weather.bestSeason}
                onChange={(e) => set("weather.bestSeason", e.target.value)}
                placeholder="e.g. October to March" className={inputCls} />
            </Field>

            <Field label="Best Time To Visit (Detailed)" span2>
              <textarea rows={2} value={form.bestTimeToVisit}
                onChange={(e) => set("bestTimeToVisit", e.target.value)}
                placeholder="Describe ideal travel window with context…"
                className={inputCls + " resize-none"} />
            </Field>
          </div>
        </Card>

        {/* ══════════════ CARD 8: TRANSPORT ══════════════ */}
        <Card title="Transportation Options" icon={FiNavigation}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: "byAir",   emoji: "✈️", label: "By Air"          },
              { key: "byTrain", emoji: "🚂", label: "By Train"        },
              { key: "byRoad",  emoji: "🚌", label: "By Road"         },
              { key: "local",   emoji: "🚖", label: "Local Transport" },
            ].map(({ key, emoji, label }) => (
              <Field key={key} label={`${emoji} ${label}`}>
                <textarea rows={3} value={form.transport[key]}
                  onChange={(e) => set(`transport.${key}`, e.target.value)}
                  className={inputCls + " resize-none"} />
              </Field>
            ))}
          </div>
        </Card>

        {/* ══════════════ CARD 9: TRAVEL TIPS ══════════════ */}
        <Card title="Travel Tips">
          <Field label="Tips (comma separated)">
            <textarea rows={4} value={form.travelTips.join(", ")}
              onChange={(e) => handleStringArray("travelTips", e.target.value)}
              placeholder="e.g. Carry warm clothes in winter, Respect local customs, Carry cash in rural areas"
              className={inputCls + " resize-none"} />
          </Field>
          {form.travelTips.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {form.travelTips.map((tip, i) => (
                <span key={i} className="text-xs px-3 py-1 bg-[#E85D04]/10 text-[#E85D04] rounded-full font-medium">
                  {tip}
                </span>
              ))}
            </div>
          )}
        </Card>

        {/* ══════════════ CARD 10: SEO ══════════════ */}
        <Card title="SEO Configuration" icon={FiSearch}>
          <div className="space-y-5">
            <Field label="Meta Title">
              <input value={form.seo.metaTitle}
                onChange={(e) => set("seo.metaTitle", e.target.value)}
                placeholder="60 characters recommended…" className={inputCls} />
              <CharCount value={form.seo.metaTitle} max={100} />
            </Field>

            <Field label="Meta Description">
              <textarea rows={2} value={form.seo.metaDescription}
                onChange={(e) => set("seo.metaDescription", e.target.value)}
                placeholder="160 characters recommended…"
                className={inputCls + " resize-none"} />
              <CharCount value={form.seo.metaDescription} max={250} />
            </Field>

            <Field label="Keywords (comma separated)">
              <input value={form.seo.keywords.join(", ")}
                onChange={(e) => handleStringArray("seo.keywords", e.target.value)}
                placeholder="e.g. Gujarat tourism, Rann of Kutch, Gujarat travel guide"
                className={inputCls} />
              {form.seo.keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {form.seo.keywords.map((kw, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
            </Field>
          </div>
        </Card>

        {/*  Bottom Submit  */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-3 bg-[#E85D04] hover:bg-[#D05203] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer"
          >
            <FiSave size={16} />
            {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Create State"}
          </button>
        </div>
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
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "" : "bg-slate-300 dark:bg-slate-700"}`}
      style={{ backgroundColor: checked ? accent : undefined }}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</span>
  </label>
);

const EmptyState = ({ text }) => (
  <div className="py-8 text-center text-slate-400 text-sm rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
    {text}
  </div>
);

const CharCount = ({ value, max }) => {
  const len = value?.length ?? 0;
  const over = len > max;
  return (
    <p className={`text-xs mt-1 text-right font-medium ${over ? "text-red-500" : "text-slate-400"}`}>
      {len}/{max}
    </p>
  );
};

export default StateForm;