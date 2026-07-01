import { FiImage, FiUpload, FiTrash2 } from "react-icons/fi";

const FormImageUpload = ({ src, label, aspect = "aspect-video", onUpload, uploading, onRemove }) => (
  <div className="space-y-2">
    {label && (
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide">
          {label}
        </label>
        {src && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-xs text-red-500 hover:text-red-600 flex items-center gap-1 font-medium transition"
          >
            <FiTrash2 size={12} /> Remove
          </button>
        )}
      </div>
    )}
    
    <div
      className={`relative ${aspect} rounded-xl border-2 border-dashed ${src ? 'border-transparent' : 'border-slate-300 dark:border-slate-700'} overflow-hidden bg-slate-50 dark:bg-slate-900 group flex flex-col items-center justify-center`}
    >
      {src ? (
        <>
          <img src={src?.url || src} alt={label || "Uploaded preview"} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <label className="cursor-pointer">
              <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md hover:bg-white hover:scale-105 transition-all">
                <FiUpload size={13} />
                {uploading ? "Replacing…" : "Replace Image"}
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
            </label>
          </div>
        </>
      ) : (
        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors">
          <FiImage size={28} className={`mx-auto mb-2 ${uploading ? 'text-[#E85D04] animate-pulse' : 'text-slate-400 group-hover:text-[#E85D04] transition-colors'}`} />
          <span className={`text-xs font-medium ${uploading ? 'text-[#E85D04]' : 'text-slate-500'}`}>
            {uploading ? "Uploading..." : "Click to upload image"}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={onUpload} disabled={uploading} />
        </label>
      )}
    </div>
  </div>
);

export default FormImageUpload;
