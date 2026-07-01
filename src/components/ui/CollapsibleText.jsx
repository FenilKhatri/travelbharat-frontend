import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const CollapsibleText = ({ title, icon: Icon, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!content) return null;

  return (
    <div className="relative pl-7 border-l-2 border-white/10">
      <div className="absolute w-3 h-3 bg-[#1a2540] border-2 border-white/20 rounded-full left-[-7px] top-1.5" />
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group cursor-pointer"
        aria-expanded={isOpen}
      >
        <h4 className="font-bold text-[#edf2ff] text-sm flex items-center gap-2 group-hover:text-[#E85D04] transition-colors">
          <Icon className="text-[#E85D04]" /> {title}
        </h4>
        <FiChevronDown className={`text-[#8fa3cc] transition-transform md:hidden ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] opacity-100 mt-3' : 'max-h-0 opacity-0 md:max-h-[1000px] md:opacity-100 md:mt-3'}`}>
        <p className="text-sm text-[#8fa3cc] leading-relaxed pb-4 md:pb-0 whitespace-pre-line">
          {content}
        </p>
      </div>
    </div>
  );
};

export default CollapsibleText;
