import { BADGE_OPTIONS } from "../../../config/badges.config";

export default function BadgeSelector({ selectedBadges = [], primaryBadge = "", onChange }) {
  const toggleBadge = (badgeName) => {
    let newBadges = [...selectedBadges];
    let newPrimary = primaryBadge;

    if (newBadges.includes(badgeName)) {
      newBadges = newBadges.filter(b => b !== badgeName);
      if (newPrimary === badgeName) {
        newPrimary = newBadges.length > 0 ? newBadges[0] : "";
      }
    } else {
      newBadges.push(badgeName);
      if (!newPrimary) {
        newPrimary = badgeName;
      }
    }
    onChange(newBadges, newPrimary);
  };

  const setPrimary = (badgeName, e) => {
    e.stopPropagation(); // prevent toggleBadge
    if (!selectedBadges.includes(badgeName)) {
      onChange([...selectedBadges, badgeName], badgeName);
    } else {
      onChange(selectedBadges, badgeName);
    }
  };

  return (
    <div className="space-y-4 bg-white/50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <p className="text-xs text-slate-500 mb-2">Select badges to highlight this destination. Click the star icon to set as primary badge (shown on cards).</p>
      <div className="flex flex-wrap gap-2">
        {BADGE_OPTIONS.map((badge) => {
          const isSelected = selectedBadges.includes(badge.value);
          const isPrimary = primaryBadge === badge.value;
          
          return (
            <div 
              key={badge.value}
              onClick={() => toggleBadge(badge.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition border ${
                isSelected 
                  ? 'bg-[#E85D04]/10 text-[#E85D04] border-[#E85D04]/30' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <span>{badge.label}</span>
              {isSelected && (
                <button
                  type="button"
                  onClick={(e) => setPrimary(badge.value, e)}
                  title={isPrimary ? "Primary Badge" : "Set as Primary"}
                  className={`ml-1 transition-colors ${isPrimary ? 'text-amber-500 hover:text-amber-600' : 'text-slate-300 hover:text-slate-500 dark:hover:text-slate-100'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={isPrimary ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
