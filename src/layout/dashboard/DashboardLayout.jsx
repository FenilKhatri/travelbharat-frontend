import { Outlet, useLocation, Link } from "react-router-dom";
import { useState, useEffect, Suspense, memo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiSun, FiMoon, FiChevronRight, FiChevronLeft, FiMenu, FiBell } from "react-icons/fi";

import Sidebar from "./Sidebar";
import NotificationBell from "./NotificationBell";
import { sidebarConfig } from "./sidebar.config";
import { useAuth } from "../../context/AuthContext";
import GlobalLoader from "../../components/ui/GlobalLoader";

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
};

const DashboardLayout = memo(({ theme, toggleTheme }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();

  const roleConfig = sidebarConfig[user?.role] || {};
  const fallbackTitle = roleConfig.title || "Admin Panel";

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const pathSegments = location.pathname.split("/").filter(Boolean);

  const getBreadcrumbLabel = (segment) => {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 bg-background text-primary`}>
      
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* main Layout Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/70 dark:bg-[#050816]/70 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/40 sticky top-0 z-30">
          
          {/* LEFT - Collapsible Trigger & Breadcrumbs */}
          <div className="flex items-center gap-4">
            
            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden md:flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition duration-200 cursor-pointer"
            >
              {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
            </button>

            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 cursor-pointer"
            >
              <FiMenu size={18} />
            </button>

            {/* Dynamic Breadcrumbs */}
            <nav className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400">
              <span className="text-slate-400 dark:text-slate-600">TravelBharat</span>
              {pathSegments.map((segment, idx) => {
                const url = `/${pathSegments.slice(0, idx + 1).join("/")}`;
                const isLast = idx === pathSegments.length - 1;
                
                return (
                  <div key={url} className="flex items-center gap-1.5">
                    <FiChevronRight size={14} className="text-slate-300 dark:text-slate-700" />
                    {isLast ? (
                      <span className="text-[#E85D04] dark:text-[#FFA034] truncate max-w-[120px] sm:max-w-[200px]">
                        {getBreadcrumbLabel(segment)}
                      </span>
                    ) : (
                      <Link 
                        to={url} 
                        className="hover:text-slate-800 dark:hover:text-white transition"
                      >
                        {getBreadcrumbLabel(segment)}
                      </Link>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>

          {/* RIGHT - Actions, Theme Switcher & Admin Info */}
          <div className="flex items-center gap-3">
            
            {/* Quick Notification Bell */}
            <NotificationBell />

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
              title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            {/* Separator */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />

            {/* User display badge */}
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {user?.name || "Administrator"}
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#E85D04] dark:text-[#FFA034]">
                {user?.role || "Admin"}
              </span>
            </div>

          </div>
        </header>

        {/* CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 max-w-[1920px] mx-auto w-full relative z-10">
          
          {/* Subtle page background details */}
          <div className="absolute top-0 right-10 w-96 h-96 bg-[#E85D04]/2 blur-[100px] rounded-full pointer-events-none -z-10" />
          
          <AnimatePresence mode="popLayout">
            <motion.div
              key={location.pathname}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Suspense fallback={<GlobalLoader />}>
                <Outlet />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
});

export default DashboardLayout;
