const FormToggle = ({ checked, onChange, label, accent = "#E85D04", description }) => (
  <div className="flex items-start gap-3">
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative mt-0.5 shrink-0 w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E85D04]/50 ${checked ? "" : "bg-slate-300 dark:bg-slate-700"}`}
      style={{ backgroundColor: checked ? accent : undefined }}
    >
      <span
        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
    <div className="flex flex-col cursor-pointer select-none" onClick={() => onChange(!checked)}>
      <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{label}</span>
      {description && <span className="text-xs text-slate-500 mt-0.5">{description}</span>}
    </div>
  </div>
);

export default FormToggle;
