const variants = {
  primary: "bg-[#E85D04] text-white hover:bg-[#DC2F02] cursor-pointer shadow-md hover:shadow-lg transition-all",
  secondary:
    "bg-[#D4A72C]/10 text-[#D4A72C] hover:bg-[#D4A72C]/20 border border-[#D4A72C]/30 dark:border-[#D4A72C]/50 cursor-pointer transition-all duration-300",
  outline:
    "border-2 border-[#E85D04] text-[#E85D04] hover:bg-[#E85D04] hover:text-white cursor-pointer transition-all",
  danger:
    "bg-red-500 text-white hover:bg-red-600 cursor-pointer transition duration-300 dark:bg-red-600 dark:hover:bg-red-700",
  ghost: "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-all",
  glass: "glass text-slate-800 dark:text-white hover:bg-white/90 dark:hover:bg-slate-800/90 cursor-pointer transition-all"
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm font-medium",
  lg: "px-8 py-3.5 text-base font-semibold"};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) => {
  return (
    <button
      type="button"
      className={`
        inline-flex items-center justify-center gap-2
        rounded-lg
        disabled:cursor-not-allowed disabled:opacity-60
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

