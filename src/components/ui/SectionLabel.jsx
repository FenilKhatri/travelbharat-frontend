const SectionLabel = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 text-[#E85D04] font-bold text-[10px] uppercase tracking-[0.2em] mb-4">
    <Icon size={12} />
    <span>{text}</span>
  </div>
);

export default SectionLabel;
