import { FiArrowLeft, FiSave } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const FormHeader = ({ 
  title, 
  subtitle, 
  backPath, 
  isEditing, 
  isSaving, 
  onSave, 
  onSaveDraft 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#0A121F] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm z-10 sticky top-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(backPath)}
          className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <FiArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">
            {isEditing ? `Edit ${title}` : `Create New ${title}`}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {onSaveDraft && (
          <button
            type="button"
            onClick={onSaveDraft}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-60 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm shadow transition cursor-pointer"
          >
            {isSaving ? "Saving…" : "Save as Draft"}
          </button>
        )}
        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow transition cursor-pointer"
        >
          <FiSave size={16} />
          {isSaving ? "Publishing…" : isEditing ? "Save Changes" : "Publish"}
        </button>
      </div>
    </div>
  );
};

export default FormHeader;
