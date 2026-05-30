import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiPhone, FiCamera, FiShield, FiKey, FiSave, FiMapPin, FiFileText, FiActivity } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import { authService } from "../../../services/authService";
import http from "../../../lib/axios";
import { toast } from "react-toastify";

// Motion Variants
const cardVariant = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Profile = () => {
  const { user, fetchUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    state: user?.state || "",
    city: user?.city || "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(profileData);
      toast.success("Profile updated successfully!");
      fetchUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Client-side file size verification (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image file size must be less than 5MB");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await http.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = uploadRes.data.image.url;

      // Immediately save image to user profile
      await authService.updateProfile({ ...profileData, profileImage: imageUrl });
      toast.success("Profile image updated!");
      fetchUser();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    
    setPassLoading(true);
    try {
      await authService.changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      });
      toast.success("Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password");
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Profile & Security</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your administrative credentials, profile bio, avatar, and password logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar & Information Details */}
        <div className="space-y-6 lg:col-span-1">
          <motion.div 
            variants={cardVariant}
            initial="hidden"
            animate="show"
            className="bg-white dark:bg-[#0A121F] rounded-2xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800/40 relative overflow-hidden"
          >
            {/* Soft decorative background dot */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#E85D04]/5 blur-3xl rounded-full" />

            <div className="flex flex-col items-center text-center relative z-10">
              <div className="relative group mb-4">
                <img 
                  src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "Admin")}&background=E85D04&color=fff&size=128`} 
                  alt="Admin Avatar" 
                  className={`w-32 h-32 rounded-full object-cover border-4 border-slate-100 dark:border-[#0A121F] shadow-lg transition duration-200 ${uploading ? "opacity-40" : ""}`}
                />
                
                {/* Upload overlay */}
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

              {/* Quick Info Grid */}
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

          {/* Activity Section */}
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

        {/* Right Side: Configuration Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Profile Information */}
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

          {/* Section 2: Password Update */}
          {user?.authProvider !== "google" && (
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
          )}

        </div>
      </div>
    </div>
  );
};

export default Profile;
