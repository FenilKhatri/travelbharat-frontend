import { adminRoutes } from "../../features/public/data/routes/admin.routes";

import { ROLES } from "../../utils/constants";
import { MdDashboard } from "react-icons/md";
import { FiUsers, FiCreditCard, FiStar, FiSettings, FiCalendar, FiUser } from "react-icons/fi";
import { FaMale, FaMedkit, FaCalendarCheck, FaStethoscope, FaAddressBook, FaClipboardList } from "react-icons/fa";

export const sidebarConfig = {
    [ROLES.ADMIN]: {
        title: "Admin Panel",
        links: adminRoutes,
    },
};
