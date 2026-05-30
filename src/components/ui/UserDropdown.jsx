import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { userRoutes } from "../../features/public/data/routes/user.routes";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const UserDropdown = ({ open, setOpen }) => {
  const ref = useRef();
  const { logout } = useAuth();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  if (!open) return null;

  return (
    <div
      ref={ref}
      className="
        absolute right-0 mt-3 w-56
        bg-white dark:bg-[#0A1628]
        border border-slate-200 dark:border-slate-800
        shadow-2xl rounded-2xl p-2 z-50 transform origin-top-right transition-all
      "
    >
      <div className="flex flex-col gap-1 mb-2">
        {userRoutes.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-[#E85D04]/10 text-[#E85D04]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white"
              }`
            }
          >
            <Icon size={18} className="opacity-70" />
            {label}
          </NavLink>
        ))}
      </div>
      
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left"
        >
          <FiLogOut size={18} className="opacity-70" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserDropdown;


