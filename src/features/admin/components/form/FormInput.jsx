import CharCount from "./CharCount";

const baseInputCls =
  "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 focus:border-[#E85D04]/60 transition";

const FormInput = ({ value, onChange, placeholder, maxLength, showCount, type = "text", className = "", disabled = false, ...props }) => (
  <div>
    <input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`${baseInputCls} ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
      {...props}
    />
    {showCount && maxLength && <CharCount value={value} max={maxLength} />}
  </div>
);

export { baseInputCls };
export default FormInput;
