import React from "react";
import { useProfileLogic } from "./hooks/useProfileLogic";
import ProfileAvatarCard from "./components/profile/ProfileAvatarCard";
import ProfileDetailsForm from "./components/profile/ProfileDetailsForm";
import ProfilePasswordForm from "./components/profile/ProfilePasswordForm";

const Profile = () => {
  const {
    user,
    profileData,
    setProfileData,
    passwords,
    setPasswords,
    uploading,
    loading,
    passLoading,
    handleProfileUpdate,
    handleImageUpload,
    handlePasswordUpdate
  } = useProfileLogic();

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Profile & Security</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your administrative credentials, profile bio, avatar, and password logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar & Information Details */}
        <ProfileAvatarCard 
          user={user} 
          uploading={uploading} 
          handleImageUpload={handleImageUpload} 
        />

        {/* Right Side: Configuration Forms */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Profile Information */}
          <ProfileDetailsForm
            profileData={profileData}
            setProfileData={setProfileData}
            handleProfileUpdate={handleProfileUpdate}
            loading={loading}
          />

          {/* Section 2: Password Update */}
          <ProfilePasswordForm
            user={user}
            passwords={passwords}
            setPasswords={setPasswords}
            handlePasswordUpdate={handlePasswordUpdate}
            passLoading={passLoading}
          />

        </div>
      </div>
    </div>
  );
};

export default Profile;