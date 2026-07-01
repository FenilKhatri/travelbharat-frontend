import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail, FiCalendar, FiShield, FiUser } from "react-icons/fi";
import { MdVerified, MdSecurity } from "react-icons/md";
import http from "../../../lib/axios";
import AdminPageLayout from "../components/ui/AdminPageLayout";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminUserDetails", id],
    queryFn: () => http.get(`/admin/users/${id}`)});

  const user = data?.data?.user || data?.data;

  if (isLoading) return <div className="p-8 text-center text-slate-500">Loading user details...</div>;
  if (isError || !user) return <div className="p-8 text-center text-red-500">Error loading user.</div>;

  const actions = (
    <button
      onClick={() => navigate("/admin/users")}
      className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer"
    >
      <FiArrowLeft size={16} /> Back
    </button>
  );

  return (
    <AdminPageLayout
      title={user.name || "User Details"}
      subtitle="Detailed view of user profile and account status"
      actions={actions}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-3xl overflow-hidden shadow-sm p-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-800 mb-4 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#E85D04] font-black text-3xl">
              {user.profileImage ? (
                <img src={user.profileImage?.url || user.profileImage} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name ? user.name[0].toUpperCase() : <FiUser size={32} />
              )}
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">{user.name}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 mb-4">
              <FiMail size={14} /> {user.email}
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full text-xs font-bold uppercase">
                {user.role}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${user.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>
                {user.isActive ? <MdVerified size={14} /> : <MdSecurity size={14} />}
                {user.isActive ? "ACTIVE" : "SUSPENDED"}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0A121F] p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800/40 rounded-3xl shadow-sm">
            <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Account Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <FiShield size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Auth Provider</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200 capitalize">{user.authProvider || "Local email"}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Joined Date</p>
                  <p className="font-bold text-slate-800 dark:text-slate-200">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default UserDetails;
