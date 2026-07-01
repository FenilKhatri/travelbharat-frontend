import React from "react";
import { motion } from "framer-motion";
import { FiCamera, FiMail, FiShield, FiPhone, FiActivity } from "react-icons/fi";

const cardVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const ProfileAvatarCard = ({ user, uploading, handleImageUpload }) => {
  return (
    <div className="space-y-6 lg:col-span-1">
      <motion.div 
        variants={cardVariant}
        initial="hidden"
        animate="show"
        className="bg-white dark:bg-[#0A121F] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/40 relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E85D04]/5 blur-3xl rounded-full" />

        <div className="flex flex-col items-center text-center relative z-10">
          <div className="relative group mb-4">
            <img 
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=E85D04&color=fff&size=128`} 
              alt="Admin Avatar" 
              className={`w-32 h-32 rounded-full object-cover border-4 border-slate-100 dark:border-[#0A121F] shadow-lg transition duration-200 ${uploading ? "opacity-40" : ""}`}
            />
            
            <label className="absolute inset-0 bg-slate-950/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer text-white">
              <FiCamera size={22} className="mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">{uploading ? "Uploading..." : "Change Image"}</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageUpload} 
                className="hidden" 
                disabled={uploading}
              />
            </label>
          </div>

          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || "Administrator"}</h2>
          <span className="mt-1 text-xs uppercase tracking-wider font-extrabold text-[#E85D04] dark:text-[#FFA034] bg-[#E85D04]/10 px-3 py-1 rounded-full border border-[#E85D04]/20">
            {user?.role || "Admin"} Account
          </span>

          <div className="w-full flex flex-col gap-3 text-sm text-left text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/40 mt-6 pt-5">
            <div className="flex items-center gap-3">
              <FiMail className="text-slate-400 shrink-0" size={16} />
              <span className="truncate">{user?.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <FiShield className="text-slate-400 shrink-0" size={16} />
              <span className="capitalize">{user?.authProvider || "Local"} Session provider</span>
            </div>
            {user?.phone && (
              <div className="flex items-center gap-3">
                <FiPhone className="text-slate-400 shrink-0" size={16} />
                <span>{user.phone}</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={cardVariant}
        initial="hidden"
        animate="show"
        className="bg-white dark:bg-[#0A121F] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/40"
      >
        <h3 className="text-sm uppercase tracking-wider font-bold text-slate-400 mb-4 flex items-center gap-2">
          <FiActivity size={16} className="text-[#E85D04]" />
          <span>Activity Status</span>
        </h3>

        <div className="space-y-4 text-xs font-semibold">
          <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800/45">
            <span className="text-slate-400">Account status</span>
            <span className="text-emerald-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Active
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-400">Created date</span>
            <span className="text-slate-700 dark:text-slate-350">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileAvatarCard;
