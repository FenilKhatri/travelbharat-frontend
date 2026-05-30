import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiArrowLeft, FiUpload, FiPlus, FiTrash2, FiImage, FiMapPin, FiNavigation, FiBook, FiSearch, FiChevronDown, FiPhone, FiShoppingBag, FiMap } from "react-icons/fi";
import { FaUtensils, FaBuilding, FaBed } from "react-icons/fa";
import { toast } from "react-toastify";
import http from "../../../lib/axios";

/* ─────────────────── Constants ─────────────────── */
const INITIAL_FORM = {
  name: "",
  slug: "",
  stateId: "",
  description: "",
  overview: "",
  tagline: "",
  images: { hero: "", thumbnail: "", gallery: [] },
  attractions: [],
  hotels: [],
  restaurants: [],
  shopping: [],
  transport: { local: "", fromAirport: "", fromStation: "", busStation: "" },
  emergencyInfo: { police: "100", ambulance: "108", hospital: "", fireBrigade: "101", touristHelpline: "1363" },
  nearbyPlaces: [],
  mapCoordinates: { lat: 0, lng: 0 },
  bestTimeToVisit: "",
  population: "",
  pincode: "",
  priority: 0,
  featured: false,
  isActive: true,
  totalPlaces: 0,
  seo: { metaTitle: "", metaDescription: "", keywords: [] },
};

/* ─────────────────── Sub-components ─────────────────── */
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

/* ─────────────────── Main Component ─────────────────── */
const CityForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [uploadingImage, setUploadingImage] = useState(null);

  /* ── Fetch States for Dropdown ── */
  const { data: statesData } = useQuery({
    queryKey: ["adminStatesList"],
    queryFn: async () => {
      const res = await http.get("/states/admin/all?limit=100");
      return res.data;
    }
  });
  const statesList = statesData?.data?.states || statesData?.states || [];

  /* ── Fetch existing city ── */
  const {
    data: queryData,
    isLoading: isFetching,
    isError,
  } = useQuery({
    queryKey: ["adminCity", id],
    queryFn: async () => {
      const res = await http.get(`/cities/admin/${id}`);
      return res.data;
    },
    enabled: isEditing,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (queryData?.data?.city || queryData?.city) {
      const c = queryData?.data?.city || queryData?.city;
      setForm({
        name:            c.name            ?? "",
        slug:            c.slug            ?? "",
        stateId:         c.stateId         ?? "",
        description:     c.description     ?? "",
        overview:        c.overview        ?? "",
        tagline:         c.tagline         ?? "",
        images: {
          hero:      c.images?.hero      ?? "",
          thumbnail: c.images?.thumbnail ?? "",
          gallery:   c.images?.gallery   ?? [],
        },
        attractions:     c.attractions     ?? [],
        hotels:          c.hotels          ?? [],
        restaurants:     c.restaurants     ?? [],
        shopping:        c.shopping        ?? [],
        transport: {
          local:       c.transport?.local       ?? "",
          fromAirport: c.transport?.fromAirport ?? "",
          fromStation: c.transport?.fromStation ?? "",
          busStation:  c.transport?.busStation  ?? "",
        },
        emergencyInfo: {
          police:          c.emergencyInfo?.police          ?? "100",
          ambulance:       c.emergencyInfo?.ambulance       ?? "108",
          hospital:        c.emergencyInfo?.hospital        ?? "",
          fireBrigade:     c.emergencyInfo?.fireBrigade     ?? "101",
          touristHelpline: c.emergencyInfo?.touristHelpline ?? "1363",
        },
        nearbyPlaces:    c.nearbyPlaces    ?? [],
        mapCoordinates: {
          lat: c.mapCoordinates?.lat ?? 0,
          lng: c.mapCoordinates?.lng ?? 0,
        },
        bestTimeToVisit: c.bestTimeToVisit ?? "",
        population:      c.population      ?? "",
        pincode:         c.pincode         ?? "",
        priority:        c.priority        ?? 0,
        featured:        c.featured        ?? false,
        isActive:        c.isActive        ?? true,
        totalPlaces:     c.totalPlaces     ?? 0,
        seo: {
          metaTitle:       c.seo?.metaTitle       ?? "",
          metaDescription: c.seo?.metaDescription ?? "",
          keywords:        c.seo?.keywords        ?? [],
        },
      });
    }
  }, [queryData]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load city data");
      navigate("/admin/cities");
    }
  }, [isError, navigate]);

  /* ── Mutations ── */
  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/cities/admin/create", payload),
    onSuccess: () => {
      toast.success("City created successfully!");
      queryClient.invalidateQueries(["adminCities"]);
      navigate("/admin/cities");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create city"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => http.put(`/cities/admin/${id}`, payload),
    onSuccess: () => {
      toast.success("City updated successfully!");
      queryClient.invalidateQueries(["adminCities"]);
      queryClient.invalidateQueries(["adminCity", id]);
      navigate("/admin/cities");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update city"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (e, asDraft = false) => {
    if (e) e.preventDefault();
    if (!form.name.trim())        return toast.error("City name is required");
    if (!form.stateId)            return toast.error("State selection is required");
    if (!form.description.trim()) return toast.error("Description is required");
    const payload = { ...form, isActive: !asDraft };
    isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const handleSubmit = (e) => handleSave(e, false);

  /* ── Image upload ── */
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
      const urls = res.images.map(img => img.url);
      setForm((prev) => ({
        ...prev,
        images: { ...prev.images, gallery: [...prev.images.gallery, ...urls] }
      }));
      toast.success("Gallery images uploaded!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploadingImage(null);
    }
  };

  /* ── Helpers ── */
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

  /* ── Loading ── */
  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#E85D04] border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-slate-500 font-medium">Loading city data…</span>
        </div>
      </div>
    );
  }

  /* ─────────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16 px-4 sm:px-0">
      {/* ── Sticky Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0A121F] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 z-10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/admin/cities")}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {isEditing ? "Edit City" : "Create New City"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Fill in comprehensive details for the city guide.</p>
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
            {isSaving ? "Publishing…" : isEditing ? "Save & Publish" : "Publish City"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ══════════════ CARD 1: GENERAL ══════════════ */}
        <Card title="General Details" icon={FaBuilding}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="City Name" required>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Surat" className={inputCls} />
            </Field>

            <Field label="Select State" required>
              <div className="relative">
                <select required value={form.stateId} onChange={(e) => set("stateId", e.target.value)}
                  className={`${inputCls} appearance-none`}>
                  <option value="" disabled>Select a state...</option>
                  {statesList.map((s) => (
                    <option key={s._id} value={s._id}>{s.name}</option>
                  ))}
                </select>
                <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </Field>

            <Field label="Slug">
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)}
                placeholder="e.g. surat (auto if empty)" className={inputCls} />
            </Field>

            <Field label="Tagline">
              <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)}
                placeholder="e.g. The Diamond City of India" className={inputCls} />
            </Field>

            <Field label="Description" required span2>
              <textarea required rows={5} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="A compelling introduction to the city…"
                className={inputCls + " resize-none"} />
            </Field>

            <Field label="Extended Overview" span2>
              <textarea rows={15} value={form.overview}
                onChange={(e) => set("overview", e.target.value)}
                placeholder="Detailed overview for the dedicated city page…"
                className={inputCls + " resize-none"} />
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

            <Field label="Best Time To Visit">
              <input value={form.bestTimeToVisit} onChange={(e) => set("bestTimeToVisit", e.target.value)}
                placeholder="e.g. October to March" className={inputCls} />
            </Field>
            <Field label="Population">
              <input value={form.population} onChange={(e) => set("population", e.target.value)}
                placeholder="e.g. 5.5 Million" className={inputCls} />
            </Field>
            
            <Field label="Pincode">
              <input value={form.pincode} onChange={(e) => set("pincode", e.target.value)}
                placeholder="e.g. 380001" className={inputCls} />
            </Field>
            <Field label="Display Priority">
              <input type="number" min={0} value={form.priority}
                onChange={(e) => set("priority", parseInt(e.target.value) || 0)}
                className={inputCls} />
            </Field>

            <div className="md:col-span-2">
              <div className="flex gap-6 flex-wrap p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured City" accent="#E85D04" />
                <Toggle checked={form.isActive} onChange={(v) => set("isActive", v)} label="Publicly Active" accent="#22c55e" />
              </div>
            </div>
          </div>
        </Card>

        {/* ══════════════ CARD 3: MEDIA ══════════════ */}
        <Card title="City Imagery" icon={FiImage}>
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

        {/* ══════════════ CARD 4: ATTRACTIONS ══════════════ */}
        <Card title="Top Attractions" icon={FiMap} action={<AddBtn onClick={() => addItem("attractions", { name: "", description: "", image: "", entryFee: "Free", timings: "" })} label="Add Attraction" />}>
          <div className="space-y-3">
            {form.attractions.map((a, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
                <button type="button" onClick={() => removeItem("attractions", i)}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition">
                  <FiTrash2 size={14} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Name</label>
                    <input value={a.name} onChange={(e) => changeItem("attractions", i, "name", e.target.value)} className={inputCls} placeholder="e.g. Sabarmati Ashram" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Image URL</label>
                    <input value={a.image} onChange={(e) => changeItem("attractions", i, "image", e.target.value)} className={inputCls} placeholder="https://..." />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Entry Fee</label>
                    <input value={a.entryFee} onChange={(e) => changeItem("attractions", i, "entryFee", e.target.value)} className={inputCls} placeholder="e.g. Free" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Timings</label>
                    <input value={a.timings} onChange={(e) => changeItem("attractions", i, "timings", e.target.value)} className={inputCls} placeholder="e.g. 8:30 AM - 6:30 PM" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Description</label>
                    <textarea rows={15} value={a.description} onChange={(e) => changeItem("attractions", i, "description", e.target.value)} className={inputCls + " resize-none"} />
                  </div>
                </div>
              </div>
            ))}
            {form.attractions.length === 0 && <EmptyState text="No attractions added yet." />}
          </div>
        </Card>

        {/* ══════════════ CARD 5: HOTELS ══════════════ */}
        <Card title="Hotels" icon={FaBed} action={<AddBtn onClick={() => addItem("hotels", { name: "", description: "", rating: 0, priceRange: "", image: "", address: "" })} label="Add Hotel" />}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {form.hotels.map((h, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
                <button type="button" onClick={() => removeItem("hotels", i)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"><FiTrash2 size={14} /></button>
                <div className="space-y-3 pt-1">
                  <input value={h.name} onChange={(e) => changeItem("hotels", i, "name", e.target.value)} placeholder="Hotel Name" className={inputCls} />
                  <input value={h.address} onChange={(e) => changeItem("hotels", i, "address", e.target.value)} placeholder="Address" className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" step="0.1" max="5" value={h.rating} onChange={(e) => changeItem("hotels", i, "rating", parseFloat(e.target.value)||0)} placeholder="Rating (0-5)" className={inputCls} />
                    <input value={h.priceRange} onChange={(e) => changeItem("hotels", i, "priceRange", e.target.value)} placeholder="Price e.g. ₹2000 - ₹5000" className={inputCls} />
                  </div>
                  <input value={h.image} onChange={(e) => changeItem("hotels", i, "image", e.target.value)} placeholder="Image URL" className={inputCls} />
                  <textarea rows={10} value={h.description} onChange={(e) => changeItem("hotels", i, "description", e.target.value)} placeholder="Description" className={inputCls + " resize-none"} />
                </div>
              </div>
            ))}
            {form.hotels.length === 0 && <div className="lg:col-span-2"><EmptyState text="No hotels added yet." /></div>}
          </div>
        </Card>

        {/* ══════════════ CARD 6: RESTAURANTS ══════════════ */}
        <Card title="Restaurants" icon={FaUtensils} action={<AddBtn onClick={() => addItem("restaurants", { name: "", cuisine: "", description: "", priceRange: "", image: "", rating: 0 })} label="Add Restaurant" />}>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {form.restaurants.map((r, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
                <button type="button" onClick={() => removeItem("restaurants", i)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 transition"><FiTrash2 size={14} /></button>
                <div className="space-y-3 pt-1">
                  <input value={r.name} onChange={(e) => changeItem("restaurants", i, "name", e.target.value)} placeholder="Restaurant Name" className={inputCls} />
                  <input value={r.cuisine} onChange={(e) => changeItem("restaurants", i, "cuisine", e.target.value)} placeholder="Cuisine e.g. Gujarati Thali" className={inputCls} />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" step="0.1" max="5" value={r.rating} onChange={(e) => changeItem("restaurants", i, "rating", parseFloat(e.target.value)||0)} placeholder="Rating" className={inputCls} />
                    <input value={r.priceRange} onChange={(e) => changeItem("restaurants", i, "priceRange", e.target.value)} placeholder="Price Range" className={inputCls} />
                  </div>
                  <input value={r.image} onChange={(e) => changeItem("restaurants", i, "image", e.target.value)} placeholder="Image URL" className={inputCls} />
                  <textarea rows={10} value={r.description} onChange={(e) => changeItem("restaurants", i, "description", e.target.value)} placeholder="Description" className={inputCls + " resize-none"} />
                </div>
              </div>
            ))}
            {form.restaurants.length === 0 && <div className="lg:col-span-2"><EmptyState text="No restaurants added yet." /></div>}
          </div>
        </Card>

        {/* ══════════════ CARD 7: SHOPPING ══════════════ */}
        <Card title="Shopping" icon={FiShoppingBag} action={<AddBtn onClick={() => addItem("shopping", { name: "", description: "", image: "", speciality: "" })} label="Add Shopping" />}>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {form.shopping.map((s, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
                <button type="button" onClick={() => removeItem("shopping", i)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 transition"><FiTrash2 size={14} /></button>
                <div className="space-y-3 pt-1">
                  <input value={s.name} onChange={(e) => changeItem("shopping", i, "name", e.target.value)} placeholder="Market Name" className={inputCls} />
                  <input value={s.speciality} onChange={(e) => changeItem("shopping", i, "speciality", e.target.value)} placeholder="Speciality e.g. Handloom" className={inputCls} />
                  <input value={s.image} onChange={(e) => changeItem("shopping", i, "image", e.target.value)} placeholder="Image URL" className={inputCls} />
                  <textarea rows={10} value={s.description} onChange={(e) => changeItem("shopping", i, "description", e.target.value)} placeholder="Description" className={inputCls + " resize-none"} />
                </div>
              </div>
            ))}
            {form.shopping.length === 0 && <div className="lg:col-span-2"><EmptyState text="No shopping places added yet." /></div>}
          </div>
        </Card>

        {/* ══════════════ CARD 8: NEARBY PLACES ══════════════ */}
        <Card title="Nearby Places" icon={FiMapPin} action={<AddBtn onClick={() => addItem("nearbyPlaces", { name: "", distance: "", image: "" })} label="Add Place" />}>
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {form.nearbyPlaces.map((n, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 relative">
                <button type="button" onClick={() => removeItem("nearbyPlaces", i)} className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-red-500 transition"><FiTrash2 size={14} /></button>
                <div className="space-y-3 pt-1">
                  <div className="grid grid-cols-2 gap-3">
                    <input value={n.name} onChange={(e) => changeItem("nearbyPlaces", i, "name", e.target.value)} placeholder="Place Name" className={inputCls} />
                    <input value={n.distance} onChange={(e) => changeItem("nearbyPlaces", i, "distance", e.target.value)} placeholder="Distance e.g. 50 km" className={inputCls} />
                  </div>
                  <input value={n.image} onChange={(e) => changeItem("nearbyPlaces", i, "image", e.target.value)} placeholder="Image URL" className={inputCls} />
                </div>
              </div>
            ))}
            {form.nearbyPlaces.length === 0 && <div className="lg:col-span-2"><EmptyState text="No nearby places added yet." /></div>}
          </div>
        </Card>

        {/* ══════════════ CARD 9: TRANSPORT ══════════════ */}
        <Card title="Transportation Options" icon={FiNavigation}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              { key: "local",       label: "Local Transport" },
              { key: "fromAirport", label: "From Airport" },
              { key: "fromStation", label: "From Railway Station" },
              { key: "busStation",  label: "From Bus Station" },
            ].map(({ key, label }) => (
              <Field key={key} label={label}>
                <textarea rows={1} value={form.transport[key]} onChange={(e) => set(`transport.${key}`, e.target.value)} className={inputCls + " resize-none"} />
              </Field>
            ))}
          </div>
        </Card>

        {/* ══════════════ CARD 10: EMERGENCY INFO ══════════════ */}
        <Card title="Emergency Info" icon={FiPhone}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Police"><input value={form.emergencyInfo.police} onChange={(e) => set("emergencyInfo.police", e.target.value)} className={inputCls} /></Field>
            <Field label="Ambulance"><input value={form.emergencyInfo.ambulance} onChange={(e) => set("emergencyInfo.ambulance", e.target.value)} className={inputCls} /></Field>
            <Field label="Fire Brigade"><input value={form.emergencyInfo.fireBrigade} onChange={(e) => set("emergencyInfo.fireBrigade", e.target.value)} className={inputCls} /></Field>
            <Field label="Hospital (Name/Number)" span2><input value={form.emergencyInfo.hospital} onChange={(e) => set("emergencyInfo.hospital", e.target.value)} className={inputCls} /></Field>
            <Field label="Tourist Helpline"><input value={form.emergencyInfo.touristHelpline} onChange={(e) => set("emergencyInfo.touristHelpline", e.target.value)} className={inputCls} /></Field>
          </div>
        </Card>

        {/* ══════════════ CARD 11: SEO ══════════════ */}
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

        {/* ── Bottom Submit ── */}
        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-[#E85D04] hover:bg-[#D05203] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer">
            <FiSave size={16} />
            {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Create City"}
          </button>
        </div>
      </form>
    </div>
  );
};

/* ─────────────────── Utility sub-components ─────────────────── */
const Card = ({ title, icon: Icon, action, children }) => (
  <div className="bg-white dark:bg-[#0A121F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
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
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${checked ? "bg-[--accent]" : "bg-slate-300 dark:bg-slate-700"}`} style={{ "--accent": accent }}>
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

export default CityForm;
