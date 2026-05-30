import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiUser, FiMenu, FiX, FiMoon, FiSun, FiChevronDown, FiMapPin } from "react-icons/fi";
import { useState, useEffect } from "react";
// import Logo from "../../assets/logo.png"; // Using text logo for now until provided
import { useAuth } from "../../context/AuthContext";
import { navLinks } from "../../features/public/data/routes/public.routes";
import Button from "../../components/ui/Button";
import UserDropdown from "../../components/ui/UserDropdown";
import AuthSkeleton from "../../components/feedback/skeleton/AuthSkeleton";
import MobileAuthSkeleton from "../../components/feedback/skeleton/MobileAuthSkeleton";
import LogoutButton from "../../components/ui/LogoutButton";
import logoDark from "../../assets/logo_dark.png";
import logoLight from "../../assets/logo_light.png";

const Navbar = ({ theme, toggleTheme }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === "/";

  // Handle scroll for transparent-to-solid navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navClass = isHome && !scrolled && !menuOpen
    ? "bg-transparent text-slate-800 dark:text-white"
    : "glass text-slate-800 dark:text-white";

  const activeLinks = ({ isActive }) =>
    `p-2 font-medium transition duration-300 ${isActive
      ? "border-b-2 border-[#E85D04] text-[#E85D04]"
      : "hover:text-[#E85D04]"
    }`;

  const DesktopAuthButtons = () => {
    if (loading) return <AuthSkeleton />;

    if (!user) {
      return (
        <NavLink to="/auth">
          <Button variant="primary">
            <FiUser size={18} /> Sign In
          </Button>
        </NavLink>
      );
    }

    return (
      <div className="flex items-center gap-3">
        {user?.role === "admin" && (
          <NavLink to="/admin/dashboard" title="Go to Admin Panel">
            <Button variant="danger" className="cursor-pointer">Admin Panel</Button>
          </NavLink>
        )}

        {user?.role === "user" && (
          <div className="relative">
            <button
              onClick={() => setUserOpen((prev) => !prev)}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#E85D04] text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium hidden lg:block">{user.name}</span>
              <FiChevronDown size={16} />
            </button>
            <UserDropdown open={userOpen} setOpen={setUserOpen} />
          </div>
        )}

        {/* <LogoutButton /> is handled inside UserDropdown now for cleaner UI */}
      </div>
    );
  };

  const MobileAuthButtons = () => {
    if (loading) return <MobileAuthSkeleton />;

    if (!user) {
      return (
        <NavLink to="/auth" className="w-full">
          <Button className="w-full">
            <FiUser size={18} /> Sign In
          </Button>
        </NavLink>
      );
    }

    return (
      <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#E85D04] text-white flex items-center justify-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800 dark:text-white">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        {user?.role === "admin" && (
          <NavLink to="/admin/dashboard">
            <Button variant="secondary" className="w-full">Admin Dashboard</Button>
          </NavLink>
        )}

        {user?.role === "user" && (
          <>
            <NavLink to="/user/profile">
              <Button variant="ghost" className="w-full justify-start">My Profile</Button>
            </NavLink>
            <NavLink to="/user/trips">
              <Button variant="ghost" className="w-full justify-start">My Trips</Button>
            </NavLink>
            <NavLink to="/user/wishlist">
              <Button variant="ghost" className="w-full justify-start">Wishlist</Button>
            </NavLink>
          </>
        )}

        <LogoutButton className="w-full mt-2" />
      </div>
    );
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navClass}`}>
        <nav className="max-w-[1600px] w-full mx-auto flex items-center justify-between px-4 py-3 md:py-4">

          {/* LOGO */}
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <img src={logoDark} alt="Logo" className="h-16 w-auto object-contain dark:hidden" />
            <img src={logoLight} alt="Logo" className="h-16 w-auto object-contain hidden dark:block" />
          </NavLink>

          {/* DESKTOP LINKS */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks?.map((link) => (
              <li key={link.path}>
                <NavLink to={link.path} className={activeLinks}>
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* RIGHT ACTIONS */}
          <div className="hidden md:flex items-center gap-4">
            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className={`p-2 rounded-full transition-colors ${isHome && !scrolled
                  ? 'bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-slate-200'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <DesktopAuthButtons />
          </div>

          {/* MOBILE BUTTONS */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-colors ${isHome && !scrolled && !menuOpen
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                }`}
            >
              {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            <button
              onClick={() => setMenuOpen(true)}
              className={isHome && !scrolled && !menuOpen ? 'text-slate-800 dark:text-white' : 'text-slate-800 dark:text-white'}
            >
              <FiMenu size={28} />
            </button>
          </div>
        </nav>
      </header>

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden transition-opacity"
        />
      )}

      {/* MOBILE DRAWER */}
      <div
        className={`
          fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-[#0A1628]
          z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out
          md:hidden flex flex-col
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800/50">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 shrink-0">
            <img src={logoDark} alt="Logo" className="h-8 w-auto object-contain dark:hidden" />
            <img src={logoLight} alt="Logo" className="h-8 w-auto object-contain hidden dark:block" />
          </NavLink>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 dark:text-slate-400"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="p-5 flex-1 overflow-y-auto flex flex-col gap-2">
          {navLinks?.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-lg font-medium transition-colors ${isActive
                  ? "bg-[#E85D04]/10 text-[#E85D04] dark:bg-[#E85D04]/20"
                  : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}

          <div className="mt-auto">
            <MobileAuthButtons />
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;


