import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMap, FiBookOpen } from "react-icons/fi";
import { MdDashboard } from "react-icons/md";
import { FaCalendarCheck } from "react-icons/fa";

const AdminPageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] bg-white dark:bg-[#0A121F] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 text-center animate-fadeIn">
      
      <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
        <span className="text-4xl font-black">404</span>
      </div>
      
      <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
        Page Not Found
      </h1>
      
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md text-base">
        The admin page you are looking for does not exist, has been removed, or you don't have permission to view it.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold transition shadow-sm cursor-pointer"
        >
          <FiArrowLeft size={18} />
          Go Back
        </button>
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E85D04] hover:bg-[#D05203] text-white font-bold transition shadow-md cursor-pointer"
        >
          <MdDashboard size={18} />
          Return to Dashboard
        </Link>
      </div>

      <div className="border-t border-slate-100 dark:border-slate-800/60 pt-8 w-full max-w-2xl">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Navigation</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/admin/states" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-semibold transition cursor-pointer">
            <FiMap size={16} className="text-[#E85D04]" /> Manage States
          </Link>
          <Link to="/admin/festivals" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-semibold transition cursor-pointer">
            <FaCalendarCheck size={16} className="text-emerald-500" /> Manage Festivals
          </Link>
          <Link to="/admin/blogs" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 text-sm font-semibold transition cursor-pointer">
            <FiBookOpen size={16} className="text-blue-500" /> Manage Blogs
          </Link>
        </div>
      </div>
      
    </div>
  );
};

export default AdminPageNotFound;
