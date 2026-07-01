import { FiGrid, FiTrash2, FiUpload } from "react-icons/fi";
import FormCard from "./FormCard";
import CustomDropdown from "../../../../components/ui/CustomDropdown";

const GALLERY_CATEGORIES = [
  { value: "hero", label: "Hero Banner" },
  { value: "landscape", label: "Landscape & Scenery" },
  { value: "heritage", label: "Heritage & Monuments" },
  { value: "wildlife", label: "Wildlife & Nature" },
  { value: "cuisine", label: "Local Cuisine" },
  { value: "festivals", label: "Festivals & Events" },
  { value: "adventure", label: "Adventure & Sports" },
  { value: "cities", label: "Cities & Urban" },
  { value: "people", label: "People & Culture" },
  { value: "spirituality", label: "Spirituality & Temples" },
  { value: "architecture", label: "Architecture" },
  { value: "culture", label: "Arts & Culture" },
];

const FormGallery = ({ 
  images = [], 
  onChange, 
  onUpload, 
  uploading = false 
}) => {
  
  const handleRemove = (idx) => {
    const updated = images.filter((_, i) => i !== idx);
    onChange(updated);
  };

  const handleUpdate = (idx, key, value) => {
    const updated = [...images];
    updated[idx] = { ...updated[idx], [key]: value };
    onChange(updated);
  };

  return (
    <FormCard 
      title="Image Gallery" 
      icon={FiGrid} 
      defaultOpen={true}
      action={
        <label className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#E85D04] hover:bg-[#D05203] px-3 py-1.5 rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50">
          <FiUpload size={14} />
          {uploading ? "Uploading…" : "Add Images"}
          <input 
            type="file" 
            accept="image/*" 
            multiple 
            className="hidden" 
            onChange={onUpload} 
            disabled={uploading} 
          />
        </label>
      }
    >
      {images.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
          No gallery images uploaded yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group">
              <div className="relative aspect-video bg-slate-200 dark:bg-slate-800">
                <img 
                  src={typeof img === 'string' ? img : (img?.url || "")} 
                  alt={img?.altText || `Gallery image ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 hover:text-red-600 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <FiTrash2 size={14} />
                </button>
              </div>
              <div className="p-3 space-y-3">
                <CustomDropdown
                  value={img?.category || "landscape"}
                  onChange={(val) => handleUpdate(idx, "category", val)}
                  options={GALLERY_CATEGORIES}
                  placeholder="Select Category"
                />
                <input
                  type="text"
                  value={img?.altText || ""}
                  onChange={(e) => handleUpdate(idx, "altText", e.target.value)}
                  placeholder="Alt Text (for SEO)"
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#E85D04]"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </FormCard>
  );
};

export default FormGallery;
