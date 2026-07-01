import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiArrowLeft, FiUpload, FiImage, FiMapPin, FiSettings, FiGrid } from "react-icons/fi";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import BadgeSelector from "../components/BadgeSelector";
import PageLoader from "../../../components/ui/PageLoader";

/*  Constants  */
const INITIAL_FORM = {
  name: "",
  stateId: "",
  cityId: "",
  description: "",
  category: "heritage",
  budget: "moderate",
  entryFee: {
    indian: "Free",
    foreigner: "Free",
    camera: "Free"
  },
  timings: "Open 24 hours",
  featured: false,
  trending: false,
  isActive: true,
  badges: [],
  primaryBadge: "",
  images: {
    thumbnail: "",
    hero: ""
  }
};

const CATEGORIES_LIST = [
  { value: "heritage", label: "Heritage & History" },
  { value: "nature", label: "Nature & Landscapes" },
  { value: "temple", label: "Temples & Spiritual" },
  { value: "beach", label: "Beaches & Coastal" },
  { value: "hill-station", label: "Hill Stations" },
  { value: "wildlife", label: "Wildlife & Safaris" },
  { value: "adventure", label: "Adventure Sports" },
  { value: "museum", label: "Museums & Arts" },
  { value: "fort", label: "Forts & Palaces" },
  { value: "garden", label: "Parks & Gardens" },
  { value: "lake", label: "Lakes & Rivers" },
  { value: "waterfall", label: "Waterfalls" },
  { value: "market", label: "Markets & Shopping" },
  { value: "religious", label: "Religious Sites" },
  { value: "modern", label: "Modern Attractions" },
  { value: "other", label: "Other" }
];

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

/*  Main Component  */
const PlaceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [form, setForm] = useState(INITIAL_FORM);
  const [uploadingImage, setUploadingImage] = useState(null);

  /*  Fetch States  */
  const { data: statesList = [] } = useQuery({
    queryKey: ["statesListForSelect"],
    queryFn: async () => {
      const res = await http.get("/states?limit=100");
      let states = res?.data?.states || res?.states || [];
      const gujaratIdx = states.findIndex(s => s.name.toLowerCase() === "gujarat");
      if (gujaratIdx !== -1) {
        const gujarat = states.splice(gujaratIdx, 1)[0];
        states.unshift(gujarat);
      }
      return states;
    }
  });

  /*  Fetch Cities based on selected State  */
  const { data: citiesList = [] } = useQuery({
    queryKey: ["citiesListForSelect", form.stateId],
    queryFn: async () => {
      if (!form.stateId) return [];
      const res = await http.get(`/cities?stateId=${form.stateId}&limit=100`);
      return res?.data?.cities || res?.cities || [];
    },
    enabled: !!form.stateId
  });

  /*  Fetch existing place  */
  const {
    data: queryData,
    isLoading: isFetching,
    isError,
  } = useQuery({
    queryKey: ["adminPlaceDetails", id],
    queryFn: async () => {
      const res = await http.get(`/places/admin/${id}`);
      return res.data;
    },
    enabled: isEditing,
    staleTime: 30_000,
  });

  useEffect(() => {
    if (queryData?.data?.place || queryData?.place) {
      const p = queryData?.data?.place || queryData?.place;
      setForm({
        name: p.name || "",
        stateId: p.stateId?._id || p.stateId || "",
        cityId: p.cityId?._id || p.cityId || "",
        description: p.description || "",
        category: p.category || "heritage",
        budget: p.budget || "moderate",
        entryFee: {
          indian: p.entryFee?.indian || "Free",
          foreigner: p.entryFee?.foreigner || "Free",
          camera: p.entryFee?.camera || "Free"
        },
        timings: p.timings || "Open 24 hours",
        featured: p.featured || false,
        trending: p.trending || false,
        isActive: p.isActive ?? true,
        badges: p.badges || [],
        primaryBadge: p.primaryBadge || "",
        images: {
          thumbnail: p.images?.thumbnail || "",
          hero: p.images?.hero || ""
        }
      });
    }
  }, [queryData]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load destination data");
      navigate("/admin/places");
    }
  }, [isError, navigate]);

  /*  Mutations  */
  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/places/admin/create", payload),
    onSuccess: () => {
      toast.success("Destination created successfully!");
      queryClient.invalidateQueries(["adminPlaces"]);
      navigate("/admin/places");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create destination"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => http.put(`/places/admin/${id}`, payload),
    onSuccess: () => {
      toast.success("Destination updated successfully!");
      queryClient.invalidateQueries(["adminPlaces"]);
      queryClient.invalidateQueries(["adminPlaceDetails", id]);
      navigate("/admin/places");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update destination"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (e, asDraft = false) => {
    if (e) e.preventDefault();
    if (!form.name.trim()) return toast.error("Destination name is required");
    if (!form.stateId) return toast.error("State selection is required");
    if (!form.cityId) return toast.error("City selection is required");
    if (!form.description.trim()) return toast.error("Description is required");
    
    const payload = { ...form, isActive: !asDraft };
    isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const handleSubmit = (e) => handleSave(e, false);

  /*  Image upload  */
  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(fieldName);
    const fd = new FormData();
    fd.append("image", file);
    
    try {
      const res = await http.post("/upload/single", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Handle axios interceptor correctly
      const url = res.data?.data?.image?.url || res.data?.image?.url || res.image?.url;
      if (!url) throw new Error("URL missing in response payload.");

      setForm((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [fieldName]: url
        }
      }));
      toast.success(`${fieldName === 'thumbnail' ? 'Thumbnail' : 'Hero'} image uploaded!`);
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message || "Failed to upload image.");
    } finally {
      setUploadingImage(null);
    }
  };

  const set = (path, value) => {
    const keys = path.split(".");
    if (keys.length === 1) {
      setForm((prev) => ({ ...prev, [path]: value }));
    } else {
      const [parent, child] = keys;
      setForm((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    }
  };

  /*  Loading  */
  if (isFetching) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <PageLoader fullScreen={false} message="Loading destination data..." size="md" />
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
            onClick={() => navigate("/admin/places")}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <FiArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">
              {isEditing ? `Edit Destination: ${form.name}` : "Create New Destination"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage tourist destination details and settings.</p>
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
            {isSaving ? "Publishing…" : isEditing ? "Save & Publish" : "Publish Destination"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/*  CARD 1: GENERAL  */}
        <Card title="General Details" icon={FiMapPin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Destination Name" required>
              <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Somnath Temple" className={inputCls} />
            </Field>

            <Field label="Category" required>
              <CustomDropdown
                value={form.category}
                onChange={(val) => set("category", val)}
                options={CATEGORIES_LIST}
                placeholder="Select Category"
              />
            </Field>

            <Field label="State" required>
              <CustomDropdown
                value={form.stateId}
                onChange={(val) => setForm({ ...form, stateId: val, cityId: "" })}
                options={[
                  { value: "", label: "Select State" },
                  ...statesList.map(st => ({ value: st._id, label: st.name })),
                ]}
                placeholder="Select State"
                searchable
              />
            </Field>

            <Field label="City" required>
              <CustomDropdown
                value={form.cityId}
                onChange={(val) => set("cityId", val)}
                options={[
                  { value: "", label: "Select City" },
                  ...citiesList.map(ct => ({ value: ct._id, label: ct.name })),
                ]}
                placeholder="Select City"
                disabled={!form.stateId}
                searchable
              />
            </Field>

            <Field label="Overview Description" required span2>
              <textarea required rows={4} value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Detailed tour highlights and intro text..."
                className={inputCls + " resize-none"} />
            </Field>
          </div>
        </Card>

        {/*  CARD 2: DETAILS & SETTINGS  */}
        <Card title="Visitor Details & Settings" icon={FiSettings}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Budget Class">
              <CustomDropdown
                value={form.budget}
                onChange={(val) => set("budget", val)}
                options={[
                  { value: "budget", label: "Budget Friendly" },
                  { value: "moderate", label: "Moderate" },
                  { value: "luxury", label: "Luxury" },
                ]}
                placeholder="Select Budget"
              />
            </Field>
            
            <Field label="Timings">
              <input value={form.timings} onChange={(e) => set("timings", e.target.value)}
                placeholder="e.g. 6 AM to 9 PM" className={inputCls} />
            </Field>
            
            <div className="md:col-span-1 flex flex-col justify-center pt-3">
              <div className="flex gap-6 flex-wrap p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <Toggle checked={form.featured} onChange={(v) => set("featured", v)} label="Featured" accent="#E85D04" />
                <Toggle checked={form.trending} onChange={(v) => set("trending", v)} label="Trending" accent="#3b82f6" />
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

        {/*  CARD 3: ENTRY FEES  */}
        <Card title="Entry Fees" icon={FiGrid}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Field label="Indian Visitors">
              <input value={form.entryFee.indian} onChange={(e) => set("entryFee.indian", e.target.value)}
                placeholder="e.g. Free or 50" className={inputCls} />
            </Field>
            <Field label="Foreign Tourists">
              <input value={form.entryFee.foreigner} onChange={(e) => set("entryFee.foreigner", e.target.value)}
                placeholder="e.g. 500" className={inputCls} />
            </Field>
            <Field label="Camera / Video">
              <input value={form.entryFee.camera} onChange={(e) => set("entryFee.camera", e.target.value)}
                placeholder="e.g. 100" className={inputCls} />
            </Field>
          </div>
        </Card>

        {/*  CARD 4: MEDIA  */}
        <Card title="Destination Imagery" icon={FiImage}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageTile src={(form.images.hero?.url || form.images.hero)?.url || (form.images.hero?.url || form.images.hero)} label="Hero Banner (Landscape)" aspect="aspect-video"
              uploading={uploadingImage === "hero"} onUpload={(e) => handleImageUpload(e, "hero")} />
            <ImageTile src={(form.images.thumbnail?.url || form.images.thumbnail)?.url || (form.images.thumbnail?.url || form.images.thumbnail)} label="Thumbnail (Square)" aspect="aspect-square max-w-[220px]"
              uploading={uploadingImage === "thumbnail"} onUpload={(e) => handleImageUpload(e, "thumbnail")} />
          </div>
        </Card>

        {/*  Bottom Submit  */}
        <div className="flex justify-end">
          <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-8 py-3 bg-[#E85D04] hover:bg-[#D05203] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition cursor-pointer">
            <FiSave size={16} />
            {isSaving ? "Saving…" : isEditing ? "Save Changes" : "Create Destination"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlaceForm;
