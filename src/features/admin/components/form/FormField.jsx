const FormField = ({ label, required, children, span2, helpText, error }) => (
  <div className={span2 ? "md:col-span-2" : ""}>
    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
      {label} {required && <span className="text-[#E85D04]">*</span>}
    </label>
    {children}
    {helpText && !error && (
      <p className="text-xs text-slate-400 mt-1">{helpText}</p>
    )}
    {error && (
      <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
    )}
  </div>
);

export default FormField;
