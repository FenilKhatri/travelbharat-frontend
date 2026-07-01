import React from "react";
import { FiImage, FiUpload } from "react-icons/fi";

const AdminImageTile = ({ src, label, aspect, onUpload, uploading }) => (
  <div className="space-y-2">
    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">
      {label}
    </label>
    <div
      className={`relative ${aspect} rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-900 group flex flex-col items-center justify-center`}
    >
      {src ? (
        <img src={src?.url || src} alt={label} className="w-full h-full object-cover" />
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

export default AdminImageTile;
