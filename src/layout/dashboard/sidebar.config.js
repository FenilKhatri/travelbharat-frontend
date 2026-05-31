import { adminRoutes } from "../../features/public/data/routes/admin.routes";

import { ROLES } from "../../utils/constants";
import { MdDashboard } from "react-icons/md";
import { FiUsers, FiCreditCard, FiStar, FiSettings, FiCalendar, FiUser, FiHeart, FiNavigation, FiBookmark, FiEdit3 } from "react-icons/fi";
import { FaMale, FaMedkit, FaCalendarCheck, FaStethoscope, FaAddressBook, FaClipboardList } from "react-icons/fa";

export const sidebarConfig = {
    [ROLES.ADMIN]: {
        title: "Admin Panel",
        links: adminRoutes,
    },
    [ROLES.USER]: {
        title: "User Dashboard",
        links: [
            { to: "/user/profile", label: "Profile", icon: FiUser },
            { to: "/user/likes", label: "Likes", icon: FiHeart },
            { to: "/user/trips", label: "My Trips", icon: FiNavigation },
            { to: "/user/saved-blogs", label: "Saved Blogs", icon: FiStar },
            { to: "/user/write-blog", label: "Write Blog", icon: FiEdit3 },
            { to: "/user/settings", label: "Settings", icon: FiSettings },
        ],
    }
};
