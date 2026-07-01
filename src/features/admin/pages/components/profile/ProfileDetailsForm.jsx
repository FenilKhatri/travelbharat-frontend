import React from "react";
import { motion } from "framer-motion";
import { FiUser, FiPhone, FiMapPin, FiFileText, FiSave } from "react-icons/fi";
import Button from "../../../../../components/ui/Button";
import Input from "../../../../../components/ui/Input";

const cardVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const ProfileDetailsForm = ({ profileData, setProfileData, handleProfileUpdate, loading }) => {
  return (
    <motion.div
      variants={cardVariant}
      initial="hidden"
      animate="show"
      className="bg-white dark:bg-[#0A121F] rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800/40 space-y-6"
    >
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800/40">
        <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 flex items-center justify-center text-[#E85D04]">
          <FiUser size={20} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Details</h3>
          <p className="text-xs text-slate-400">Update your public credentials and descriptions</p>
        </div>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="name"
            labelName="Full Name"
            icon={FiUser}
            type="text"
            placeholder="Enter name"
            value={profileData.name}
            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
            required
          />
          <Input
            label="phone"
            labelName="Phone Number"
            icon={FiPhone}
            type="text"
            placeholder="Enter contact number"
            value={profileData.phone}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="city"
            labelName="City Location"
            icon={FiMapPin}
            type="text"
            placeholder="Enter city"
            value={profileData.city}
            onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
          />
          <Input
            label="state"
            labelName="State Location"
            icon={FiMapPin}
            type="text"
            placeholder="Enter state"
            value={profileData.state}
            onChange={(e) => setProfileData({ ...profileData, state: e.target.value })}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-semibold text-slate-500 dark:text-slate-400 ml-0.5 flex items-center gap-1.5">
            <FiFileText size={14} />
            <span>Bio Description</span>
          </label>
          <textarea
            rows={4}
            value={profileData.bio}
            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
            placeholder="Tell explorers something about yourself or your travel expertise..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-800 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04] text-sm transition"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button 
            type="submit" 
            disabled={loading} 
            className="flex items-center gap-2 px-6 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl cursor-pointer transition shadow-xs"
          >
            <FiSave size={16} /> 
            <span>{loading ? "Saving Changes..." : "Save Changes"}</span>
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProfileDetailsForm;
