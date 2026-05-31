import { FiFileText, FiAlignLeft, FiImage, FiHelpCircle, FiSettings, FiUpload, FiPlus, FiTrash2 } from "react-icons/fi";
import CustomDropdown from "../ui/CustomDropdown";

export const CATEGORIES = [
  "travel-guide", "destination", "food", "culture", 
  "adventure", "heritage", "festivals", "tips", 
  "budget-travel", "luxury-travel", "wildlife", "spiritual", "other"
];

export const INITIAL_BLOG_FORM = {
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

export const SharedBlogFormFields = ({ form, setForm, states = [], cities = [], places = [], handleImageUpload, uploadingImage, isAdmin = false }) => {
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

  const wordCount = (form.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <div className="space-y-6">
      <Section title="Basic Information" icon={FiFileText}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Title" required><input value={form.title} onChange={e => set("title", e.target.value)} className={inputCls} /></Field>
          <Field label="Slug"><input value={form.slug} onChange={e => set("slug", e.target.value)} placeholder="Auto-generated if empty" className={inputCls} /></Field>
          <Field label="Category" required>
            <CustomDropdown
              value={form.category}
              onChange={(val) => set("category", val)}
              options={CATEGORIES.map(c => ({ value: c, label: c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))}
              placeholder="Select Category"
            />
          </Field>
          <Field label="State (Optional)">
            <CustomDropdown
              value={form.stateId}
              onChange={(val) => set("stateId", val)}
              options={[
                { value: "", label: "None" },
                ...states.map(s => ({ value: s._id, label: s.name })),
              ]}
              placeholder="None"
              searchable
            />
          </Field>
          <Field label="Excerpt" span2><textarea rows={2} value={form.excerpt} onChange={e => set("excerpt", e.target.value)} className={inputCls} /></Field>
          <Field label="Tags (comma separated)" span2><input value={(form.tags || []).join(", ")} onChange={e => handleStringArray("tags", e.target.value)} className={inputCls} /></Field>
          
          {isAdmin && (
            <div className="flex gap-4 md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-5 h-5 accent-[#E85D04]" /> <span className="font-bold text-sm">Featured</span></label>
              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={form.isPublished} onChange={e => set("isPublished", e.target.checked)} className="w-5 h-5 accent-[#E85D04]" /> <span className="font-bold text-sm">Published</span></label>
            </div>
          )}
        </div>
      </Section>

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

      <Section title="Images" icon={FiImage}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageTile src={form.images?.hero} label="Hero Image (16:9)" aspect="aspect-video" uploading={uploadingImage === "images.hero"} onUpload={e => handleImageUpload(e, "images.hero")} />
          <ImageTile src={form.images?.thumbnail} label="Thumbnail (1:1)" aspect="aspect-square max-w-[250px]" uploading={uploadingImage === "images.thumbnail"} onUpload={e => handleImageUpload(e, "images.thumbnail")} />
        </div>
      </Section>

      <Section title="Travel Tips" icon={FiHelpCircle} action={<AddBtn onClick={() => setForm(p => ({ ...p, travelTips: [...(p.travelTips || []), ""] }))} label="Add Tip" />}>
          {(form.travelTips || []).map((tip, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input value={tip} onChange={e => {
                const newTips = [...(form.travelTips || [])];
                newTips[i] = e.target.value;
                setForm(p => ({ ...p, travelTips: newTips }));
              }} className={inputCls} placeholder={`Tip ${i+1}`} />
              <button type="button" onClick={() => {
                setForm(p => ({ ...p, travelTips: p.travelTips.filter((_, idx) => idx !== i) }));
              }} className="p-3 text-red-500 bg-red-50 rounded-xl hover:bg-red-100 transition"><FiTrash2 /></button>
            </div>
          ))}
      </Section>

      <Section title="FAQs" icon={FiHelpCircle} action={<AddBtn onClick={() => setForm(p => ({ ...p, faqs: [...(p.faqs || []), { question: "", answer: "" }] }))} label="Add FAQ" />}>
          {(form.faqs || []).map((faq, i) => (
            <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 border rounded-xl relative mb-3">
              <button type="button" onClick={() => setForm(p => ({ ...p, faqs: p.faqs.filter((_, idx) => idx !== i) }))} className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-lg"><FiTrash2 /></button>
              <input value={faq.question} onChange={e => {
                const nf = [...(form.faqs || [])]; nf[i].question = e.target.value; setForm(p => ({...p, faqs: nf}));
              }} className={`${inputCls} mb-2 pr-10`} placeholder="Question" />
              <textarea value={faq.answer} onChange={e => {
                const nf = [...(form.faqs || [])]; nf[i].answer = e.target.value; setForm(p => ({...p, faqs: nf}));
              }} className={`${inputCls} resize-y`} placeholder="Answer" rows={2} />
            </div>
          ))}
      </Section>

      <Section title="Related Content" icon={FiSettings}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Related Cities (Select Multiple)">
              <CustomDropdown
                multiple
                searchable
                value={form.relatedCities || []}
                onChange={(val) => setForm(p => ({ ...p, relatedCities: val }))}
                options={cities.map(c => ({ value: c._id, label: c.name }))}
                placeholder="Select Cities..."
              />
            </Field>
            <Field label="Related Destinations">
              <CustomDropdown
                multiple
                searchable
                value={form.relatedDestinations || []}
                onChange={(val) => setForm(p => ({ ...p, relatedDestinations: val }))}
                options={places.map(p => ({ value: p._id, label: p.name }))}
                placeholder="Select Destinations..."
              />
            </Field>
          </div>
      </Section>

      <Section title="SEO" icon={FiSettings}>
          <div className="space-y-4">
            <Field label="Meta Title"><input value={form.seo?.metaTitle || ""} onChange={e => set("seo.metaTitle", e.target.value)} className={inputCls} maxLength={60} />
            <div className="text-xs text-slate-400 mt-1">{(form.seo?.metaTitle || "").length}/60</div></Field>
            <Field label="Meta Description"><textarea value={form.seo?.metaDescription || ""} onChange={e => set("seo.metaDescription", e.target.value)} className={inputCls} rows={2} maxLength={160} />
            <div className="text-xs text-slate-400 mt-1">{(form.seo?.metaDescription || "").length}/160</div></Field>
            <Field label="Keywords (comma separated)"><input value={(form.seo?.keywords || []).join(", ")} onChange={e => handleStringArray("seo.keywords", e.target.value)} className={inputCls} /></Field>
          </div>
      </Section>
    </div>
  );
};
