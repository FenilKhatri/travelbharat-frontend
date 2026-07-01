import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const FormCard = ({ title, icon: Icon, action, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white dark:bg-[#0A121F] rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-visible">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer select-none"
      >
        <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 text-base">
          {Icon && <Icon size={16} className="text-[#E85D04]" />}
          {title}
        </h3>
        <div className="flex items-center gap-2">
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
          <FiChevronDown
            size={18}
            className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </button>
      <div
        className={`transition-all duration-300 ease-in-out ${isOpen ? "max-h-[10000px] opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}
      >
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default FormCard;
