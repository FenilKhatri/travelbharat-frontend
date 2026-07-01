import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { FiX, FiSettings, FiLogOut, FiUser, FiChevronRight, FiChevronLeft } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import http from "../../lib/axios";
import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { sidebarConfig } from "./sidebar.config";
import { useAuth } from "../../context/AuthContext";
import logoDark from "../../assets/logo_dark.png";
import logoLight from "../../assets/logo_light.png";
import { toast } from "react-toastify";

// Portal tooltip for collapsed state
const SidebarTooltip = ({ label, y }) =>
  createPortal(
    <div
      className="fixed left-20 z-[9999] flex items-center pointer-events-none animate-fadeIn"
      style={{ top: `${y}px`, transform: "translateY(-50%)" }}
    >
      <div className="w-0 h-0 border-t-6 border-t-transparent border-b-6 border-b-transparent border-r-6 border-r-slate-800 dark:border-r-slate-900" />
      <div className="bg-slate-800 dark:bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap">
        {label}
      </div>
    </div>,
    document.body
  );

const Sidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loggingOut, setLoggingOut] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, label: "", y: 0 });

  const { data: notificationsData } = useQuery({
    queryKey: ["adminNotifications"],
    queryFn: async () => {
      const res = await http.get("/notifications/admin");
      return res.data;
    },
    enabled: user?.role === "admin"
  });
  const unreadCount = notificationsData?.unreadCount || 0;

  const roleConfig = sidebarConfig[user?.role] || {};
  const navLinks = roleConfig.links || [];

  const handleMouseEnter = (e, label) => {
    if (!collapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ show: true, label, y: rect.top + rect.height / 2 });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, label: "", y: 0 });
  };

  const handleLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await logout();
      toast.success("Logged out successfully!");
      navigate("/auth");
    } catch (error) {
      console.error(error);
      toast.error("Logout failed!");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      {collapsed && tooltip.show && (
        <SidebarTooltip label={tooltip.label} y={tooltip.y} />
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen min-h-screen overflow-y-auto flex flex-col bg-white dark:bg-[#050816] border-r border-slate-200/80 dark:border-slate-800/60 shadow-xl transition-all duration-300 ease-in-out ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          } ${collapsed ? "md:w-20 w-72" : "md:w-64 w-72"}`}
      >
        {/* HEADER / LOGO */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800/40">
          <Link to="/" className="flex items-center gap-3">
            <img
              src={logoDark}
              alt="TravelBharat Logo"
              className="h-8 w-auto object-contain shrink-0 dark:hidden"
            />
            <img
              src={logoLight}
              alt="TravelBharat Logo"
              className="h-8 w-auto object-contain shrink-0 hidden dark:block"
            />
            {!collapsed && (
              <span className="font-black text-slate-800 dark:text-white tracking-wide text-base bg-linear-to-r from-[#E85D04] to-[#FF9E00] bg-clip-text text-transparent">
                TravelBharat
              </span>
            )}
          </Link>

          <button
            className="md:hidden text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white cursor-pointer"
            onClick={() => setMobileOpen(false)}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-none">
          {navLinks.map(({ to, label, icon: Icon }) => {
            const isActive = to === '/'
              ? location.pathname === '/'
              : to === '/admin' || to === '/user'
                ? location.pathname === to
                : location.pathname.startsWith(to);
            return (
              <div
                key={to}
                onMouseEnter={(e) => handleMouseEnter(e, label)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={`relative flex items-center rounded-xl transition duration-200 group
                    ${collapsed ? "justify-center px-0" : "gap-3.5 px-4"}
                    py-3 text-sm font-semibold
                    ${isActive
                      ? "bg-[#E85D04]/10 text-[#E85D04] dark:text-[#FFA034] shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-3 bottom-3 w-1 bg-[#E85D04] rounded-r-full" />
                  )}
                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform group-hover:scale-105 ${isActive ? "text-[#E85D04]" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-350"
                      }`}
                  />
                  {!collapsed && <span className="flex-1">{label}</span>}
                  {!collapsed && to === "/admin/notifications" && unreadCount > 0 && (
                    <span className="bg-[#E85D04] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                  {collapsed && to === "/admin/notifications" && unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#E85D04] rounded-full" />
                  )}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* PROFILE FOOTER SECTION */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-[#070D1F]/30">
          {collapsed ? (
            <div className="flex flex-col items-center gap-3 py-1">
              <Link to={user?.role === 'admin' ? "/admin/profile" : "/user/profile"}>
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-[#E85D04]/30 hover:border-[#E85D04] transition duration-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center font-bold border border-[#E85D04]/20 hover:border-[#E85D04] transition duration-200">
                    {user?.name ? user.name[0].toUpperCase() : <FiUser />}
                  </div>
                )}
              </Link>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                title="Logout"
                className="p-2 rounded-xl text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Link to={user?.role === 'admin' ? "/admin/profile" : "/user/profile"} className="shrink-0">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center font-bold border border-[#E85D04]/20">
                      {user?.name ? user.name[0].toUpperCase() : <FiUser />}
                    </div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {user?.name || "Admin user"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                    {user?.email || "admin@travelbharat.com"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800/40">
                <Link
                  to={user?.role === 'admin' ? "/admin/profile" : "/user/profile"}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-[#E85D04] dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <FiSettings size={14} />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                >
                  <FiLogOut size={14} />
                  <span>{loggingOut ? "..." : "Logout"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
