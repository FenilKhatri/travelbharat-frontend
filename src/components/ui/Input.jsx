import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Input = ({ icon: Icon, label, labelName, rightElement, type, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === "password";

  return (
    <div className="flex flex-col w-full gap-1.5">
      {labelName && (
        <label
          htmlFor={label}
          className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-0.5"
        >
          {labelName}
        </label>
      )}
      <div className="relative flex items-center justify-start gap-3 px-4 py-2.5 bg-transparent border border-slate-300 dark:border-slate-800 rounded-xl shadow-sm transition-all duration-200 focus-within:border-[#E85D04] focus-within:ring-4 focus-within:ring-[#E85D04]/20 group">
        {Icon && (
          <Icon
            size={18}
            className="text-slate-400 transition-colors duration-200 group-focus-within:text-[#E85D04]"
          />
        )}

        <input
          id={label}
          type={isPasswordField ? (showPassword ? "text" : "password") : type}
          {...props}
          className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-500 focus:outline-none text-sm md:text-base pr-8"
        />

        {isPasswordField ? (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer focus:outline-none"
          >
            {showPassword ? <FiEye size={18} /> : <FiEyeOff size={18} />}
          </button>
        ) : rightElement ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">
            {rightElement}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
