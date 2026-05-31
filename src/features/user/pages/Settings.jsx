import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiSettings, FiLock, FiLogOut } from "react-icons/fi";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const passwordMutation = useMutation({
    mutationFn: (payload) => http.put("/auth/change-password", payload),
    onSuccess: () => {
      toast.success("Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to change password")
  });

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error("New passwords do not match!");
    }
    passwordMutation.mutate({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
  };

  const handleLogout = async () => {
      try {
          await logout();
          navigate("/login");
      } catch (err) {
          toast.error("Failed to logout");
      }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-30 pb-24">
      <div className="flex items-center gap-3 mb-10">
        <FiSettings className="text-[#E85D04]" size={32} />
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Settings</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-2">
            <div className="p-4 bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                <button className="w-full text-left px-4 py-3 bg-[#E85D04]/10 text-[#E85D04] font-bold rounded-xl flex items-center gap-3">
                   <FiLock /> Security
                </button>
                <button onClick={handleLogout} className="w-full mt-2 text-left px-4 py-3 text-red-500 font-bold rounded-xl flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-500/10 transition">
                   <FiLogOut /> Logout
                </button>
            </div>
         </div>
         
         <div className="md:col-span-2">
            <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Change Password</h3>
               <form onSubmit={handlePasswordSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1.5">Current Password</label>
                    <input type="password" required value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1.5">New Password</label>
                    <input type="password" required value={passwordForm.newPassword} onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-500 mb-1.5">Confirm New Password</label>
                    <input type="password" required value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})} className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-[#E85D04]/20" />
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40">
                     <button type="submit" disabled={passwordMutation.isLoading} className="px-6 py-2.5 bg-[#E85D04] text-white font-bold rounded-xl hover:bg-[#D05203] transition disabled:opacity-60">
                        Update Password
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
    </div>
  );
};

export default Settings;
