import React from "react";
import { motion } from "framer-motion";
import { FiKey } from "react-icons/fi";
import Button from "../../../../../components/ui/Button";
import Input from "../../../../../components/ui/Input";

const cardVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const ProfilePasswordForm = ({ user, passwords, setPasswords, handlePasswordUpdate, passLoading }) => {
  if (user?.authProvider === "google") {
    return null;
  }

  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      animate="show"
      className="bg-white dark:bg-[#0A121F] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800/40 space-y-6"
    >
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/40">
        <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 flex items-center justify-center text-[#E85D04]">
          <FiKey size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Change Password</h3>
          <p className="text-xs text-slate-400">Regularly updates protect server admin access</p>
        </div>
      </div>

      <form onSubmit={handlePasswordUpdate} className="space-y-5">
        <Input
          label="currentPassword"
          labelName="Current Password"
          icon={FiKey}
          type="password"
          placeholder="Enter current password"
          value={passwords.currentPassword}
          onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="newPassword"
            labelName="New Password"
            icon={FiKey}
            type="password"
            placeholder="Min 6 characters"
            value={passwords.newPassword}
            onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            required
            minLength={6}
          />
          <Input
            label="confirmPassword"
            labelName="Confirm New Password"
            icon={FiKey}
            type="password"
            placeholder="Retype new password"
            value={passwords.confirmPassword}
            onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
            required
            minLength={6}
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={passLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl cursor-pointer transition shadow-xs"
          >
            <FiKey size={16} />
            <span>{passLoading ? "Updating Password..." : "Update Password"}</span>
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfilePasswordForm;
