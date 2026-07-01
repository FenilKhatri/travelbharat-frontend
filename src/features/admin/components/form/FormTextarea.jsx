import CharCount from "./CharCount";
import { baseInputCls } from "./FormInput";

const FormTextarea = ({ value, onChange, placeholder, maxLength, showCount, rows = 3, className = "", disabled = false }) => (
  <div>
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`${baseInputCls} resize-none ${disabled ? "opacity-60 cursor-not-allowed" : ""} ${className}`}
    />
    {showCount && maxLength && <CharCount value={value} max={maxLength} />}
  </div>
);

export default FormTextarea;
