import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";

const AdminPageLayout = ({ 
  title, 
  subtitle, 
  actionLabel, 
  actionLink, 
  actionIcon: ActionIcon = FiPlus,
  stats,
  children 
}) => {
  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">{title}</h1>
          {subtitle && <p className="text-slate-500 dark:text-slate-400 text-sm">{subtitle}</p>}
        </div>
        
        {actionLabel && actionLink && (
          <div className="flex items-center gap-3">
            <Link 
              to={actionLink} 
              className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#c44e03] text-white font-bold rounded-xl flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              <ActionIcon size={18} /> {actionLabel}
            </Link>
          </div>
        )}
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white dark:bg-[#0A121F] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className={`p-3 rounded-xl ${stat.colorClass || 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                  {Icon && <Icon size={24} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Content (Filters, Tables, Grids) */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default AdminPageLayout;
