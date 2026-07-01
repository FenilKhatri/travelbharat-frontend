import React from "react";
import { FiImage, FiPlus, FiTrash2, FiX, FiUpload } from "react-icons/fi";
import CustomDropdown from "../../../../../components/ui/CustomDropdown";

const HeroBanners = ({
  bannersLoading,
  bannersData,
  handleOpenCreateBanner,
  handleEditBannerClick,
  deleteBannerMutation,
  isBannerModalOpen,
  setIsBannerModalOpen,
  editingBanner,
  bannerForm,
  setBannerForm,
  saveBannerMutation,
  uploadingBanner,
  handleBannerImageUpload
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Slides</h3>
        <button
          onClick={handleOpenCreateBanner}
          className="flex items-center gap-2 px-4 py-2 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-xs transition cursor-pointer"
        >
          <FiPlus size={14} />
          <span>Add Slider Image</span>
        </button>
      </div>

      {bannersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 bg-slate-100 dark:bg-slate-850 rounded-2xl" />
          ))}
        </div>
      ) : bannersData?.length === 0 ? (
        <div className="text-center py-12 text-slate-400 bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl">
          No hero banners active. Add a new banner image.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bannersData?.map((banner) => (
            <div 
              key={banner._id} 
              className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative h-44 bg-slate-100 dark:bg-slate-800">
                {banner.image ? (
                  <img src={banner.image?.url || banner.image} alt={banner.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400"><FiImage size={28} /></div>
                )}
                <span className="absolute top-3 right-3 text-[10px] font-bold bg-[#E85D04] text-white px-2 py-0.5 rounded-full capitalize shadow-sm">
                  {banner.page} Banner
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">{banner.title || "No Title"}</h4>
                  <p className="text-xs text-slate-450 line-clamp-2">{banner.subtitle}</p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/40 mt-4 pt-3.5">
                  <span className="text-[10px] font-bold text-slate-400">Priority: {banner.priority}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditBannerClick(banner)}
                      className="px-2.5 py-1.5 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-xs font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteBannerMutation.mutate(banner._id)}
                      className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Banner Create/Edit Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/40 mb-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingBanner ? "Edit slider image" : "Add slider image"}
              </h3>
              <button onClick={() => setIsBannerModalOpen(false)} className="p-1 rounded-full text-slate-450 hover:text-slate-700 cursor-pointer">
                <FiX size={18} />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                saveBannerMutation.mutate(bannerForm);
              }} 
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Banner Title</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="e.g. Discover India State by State"
                  className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Subtitle / Promo description</label>
                <input
                  type="text"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  placeholder="e.g. Plan customizable itineraries and tourist routes..."
                  className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Page Location</label>
                  <CustomDropdown
                    value={bannerForm.page}
                    onChange={(val) => setBannerForm({ ...bannerForm, page: val })}
                    options={[
                      { value: "home", label: "Homepage" }
                    ]}
                    placeholder="Select Page"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Priority Weight</label>
                  <input
                    type="number"
                    value={bannerForm.priority}
                    onChange={(e) => setBannerForm({ ...bannerForm, priority: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.buttonText}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonText: e.target.value })}
                    placeholder="e.g. Explore Now"
                    className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Target Redirect URL</label>
                  <input
                    type="text"
                    value={bannerForm.buttonLink}
                    onChange={(e) => setBannerForm({ ...bannerForm, buttonLink: e.target.value })}
                    placeholder="e.g. /states"
                    className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  />
                </div>
              </div>

              {/* Slider Image Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Slider Image File</label>
                <div className="flex items-center gap-4">
                  {bannerForm.image ? (
                    <img src={bannerForm.image?.url || bannerForm.image} alt="Slider Preview" className="w-24 h-12 object-cover rounded-lg border border-slate-205" />
                  ) : (
                    <div className="w-24 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><FiImage /></div>
                  )}
                  <label className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition">
                    <FiUpload size={14} />
                    <span>{uploadingBanner ? "Uploading..." : "Upload Image"}</span>
                    <input type="file" onChange={handleBannerImageUpload} className="hidden" disabled={uploadingBanner} />
                  </label>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-655 dark:text-slate-305 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveBannerMutation.isLoading || uploadingBanner}
                  className="px-5 py-2 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition disabled:opacity-50"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroBanners;
