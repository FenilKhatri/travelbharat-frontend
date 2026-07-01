import React from "react";
import { FiSettings, FiImage } from "react-icons/fi";
import { useSettingsLogic } from "./hooks/useSettingsLogic";
import SystemSettings from "./components/settings/SystemSettings";
import HeroBanners from "./components/settings/HeroBanners";

const Settings = () => {
  const {
    activeTab,
    setActiveTab,
    isBannerModalOpen,
    setIsBannerModalOpen,
    editingBanner,
    bannerForm,
    setBannerForm,
    uploadingBanner,
    newSetting,
    setNewSetting,
    settingsData,
    settingsLoading,
    bannersData,
    bannersLoading,
    saveSettingMutation,
    deleteSettingMutation,
    saveBannerMutation,
    deleteBannerMutation,
    handleBannerImageUpload,
    handleEditBannerClick,
    handleOpenCreateBanner
  } = useSettingsLogic();

  return (
    <div className="space-y-6 pb-12">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Platform Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Configure site branding metadata, manage hero banners, and tune system variables.</p>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/40">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 cursor-pointer transition ${
            activeTab === "general"
              ? "border-[#E85D04] text-[#E85D04]"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <FiSettings size={16} />
          <span>System Configurations</span>
        </button>

        <button
          onClick={() => setActiveTab("banners")}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-bold border-b-2 cursor-pointer transition ${
            activeTab === "banners"
              ? "border-[#E85D04] text-[#E85D04]"
              : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <FiImage size={16} />
          <span>Homepage Hero Banners</span>
        </button>
      </div>

      {/* General Settings Tab */}
      {activeTab === "general" && (
        <SystemSettings 
          settingsLoading={settingsLoading}
          settingsData={settingsData}
          deleteSettingMutation={deleteSettingMutation}
          newSetting={newSetting}
          setNewSetting={setNewSetting}
          saveSettingMutation={saveSettingMutation}
        />
      )}

      {/* Hero Banners Tab */}
      {activeTab === "banners" && (
        <HeroBanners 
          bannersLoading={bannersLoading}
          bannersData={bannersData}
          handleOpenCreateBanner={handleOpenCreateBanner}
          handleEditBannerClick={handleEditBannerClick}
          deleteBannerMutation={deleteBannerMutation}
          isBannerModalOpen={isBannerModalOpen}
          setIsBannerModalOpen={setIsBannerModalOpen}
          editingBanner={editingBanner}
          bannerForm={bannerForm}
          setBannerForm={setBannerForm}
          saveBannerMutation={saveBannerMutation}
          uploadingBanner={uploadingBanner}
          handleBannerImageUpload={handleBannerImageUpload}
        />
      )}
    </div>
  );
};

export default Settings;
