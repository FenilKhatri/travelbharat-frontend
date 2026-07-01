
import {
  FiCompass, FiCalendar, FiMapPin, FiStar, FiSun, FiWind
} from "react-icons/fi";
import {
  FaCrown, FaLandmark, FaTree, FaGem, FaWater, FaUtensils,
  FaChurch, FaPalette, FaMountain
} from "react-icons/fa6";
import { BADGES_CONFIG } from "../../config/badges.config";

const renderIcon = (iconName, size = 14) => {
  switch (iconName?.toLowerCase()) {
    case "crown": return <FaCrown size={size} />;
    case "landmark": return <FaLandmark size={size} />;
    case "star": return <FiStar size={size} />;
    case "trending-up": return <FiWind size={size} />; // fallback
    case "church": return <FaChurch size={size} />;
    case "palette": return <FaPalette size={size} />;
    case "trees": return <FaTree size={size} />;
    case "party-popper": return <FiCalendar size={size} />; // fallback for party-popper
    case "compass": return <FiCompass size={size} />;
    case "mountain": return <FaMountain size={size} />;
    case "utensils": return <FaUtensils size={size} />;
    case "waves": return <FaWater size={size} />;
    case "sun": return <FiSun size={size} />;
    case "leaf": return <FaTree size={size} />; // fallback
    case "gem": return <FaGem size={size} />;
    case "map-pin": return <FiMapPin size={size} />;
    case "calendar": return <FiCalendar size={size} />;
    default: return <FiStar size={size} />;
  }
};

const TravelBadge = ({ badgeName, className = "" }) => {
  if (!badgeName) return null;

  const config = BADGES_CONFIG[badgeName];
  if (!config) return null;

  const Icon = renderIcon(config.icon);

  return (
    <div
      className={`group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full backdrop-blur-md transition-all duration-250 hover:scale-[1.03] overflow-hidden ${className}`}
      style={{
        backgroundColor: "rgba(10, 15, 25, 0.82)",
        border: "1px solid rgba(255, 255, 255, 0.10)",
        borderLeft: `4px solid ${config.color}`,
        minHeight: "32px",
        boxShadow: `0 6px 18px ${config.glow || 'rgba(0,0,0,0.25)'}`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(20, 25, 35, 0.9)";
        e.currentTarget.style.boxShadow = `0 8px 24px ${config.glow || 'rgba(0,0,0,0.35)'}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(10, 15, 25, 0.82)";
        e.currentTarget.style.boxShadow = `0 6px 18px ${config.glow || 'rgba(0,0,0,0.25)'}`;
      }}
    >
      <span
        className="shrink-0 drop-shadow-md"
        style={{ color: config.color }}
      >
        {Icon}
      </span>
      <span
        className="text-[#FFFFFF] text-xs font-semibold whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-md"
        style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}
      >
        {config.name}
      </span>
    </div>
  );
};

export default TravelBadge;
