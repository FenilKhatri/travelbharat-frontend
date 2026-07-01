import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSettings, FiImage, FiList, FiPlus, FiSave, FiTrash2, FiX, FiUpload, FiCheck, FiLink } from "react-icons/fi";
import http from "../../../lib/axios";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import { toast } from "react-toastify";

const Settings = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("general");

  // Hero Banners Modals
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    image: "",
    publicId: "",
    buttonLink: "",
    buttonText: "Explore Now",
    page: "home",
    priority: 0,
    isActive: true
  });
  const [uploadingBanner, setUploadingBanner] = useState(false);

  // Settings Forms
  const [newSetting, setNewSetting] = useState({
    key: "",
    value: "",
    category: "general",
    description: ""
  });

  // Queries
  const { data: settingsData, isLoading: settingsLoading } = useQuery({
    queryKey: ["adminSettings"],
    queryFn: async () => {
      const res = await http.get("/admin/settings");
      return res.data.settings || [];
    }
  });

  const { data: bannersData, isLoading: bannersLoading } = useQuery({
    queryKey: ["adminBanners"],
    queryFn: async () => {
      const res = await http.get("/admin/banners");
      return res.data.banners || [];
    }
  });

  // Mutations - Settings
  const saveSettingMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await http.post("/admin/settings", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Site setting saved successfully!");
      setNewSetting({ key: "", value: "", category: "general", description: "" });
      queryClient.invalidateQueries(["adminSettings"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to save setting");
    }
  });

  const deleteSettingMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/admin/settings/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Site setting deleted.");
      queryClient.invalidateQueries(["adminSettings"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete setting");
    }
  });

  // Mutations - Banners
  const saveBannerMutation = useMutation({
    mutationFn: async (payload) => {
      if (editingBanner) {
        const response = await http.put(`/admin/banners/${editingBanner._id}`, payload);
        return response.data;
      } else {
        const response = await http.post("/admin/banners", payload);
        return response.data;
      }
    },
    onSuccess: () => {
      toast.success(editingBanner ? "Banner updated!" : "Banner created!");
      setIsBannerModalOpen(false);
      setEditingBanner(null);
      setBannerForm({ title: "", subtitle: "", image: "", publicId: "", buttonLink: "", buttonText: "Explore Now", page: "home", priority: 0, isActive: true });
      queryClient.invalidateQueries(["adminBanners"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to save banner");
    }
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/admin/banners/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Hero banner deleted.");
      queryClient.invalidateQueries(["adminBanners"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete banner");
    }
  });

  // Image Upload helper
  const handleBannerImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingBanner(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await http.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageData = uploadRes.data.image;
      setBannerForm((prev) => ({ 
        ...prev, 
        image: imageData.url,
        publicId: imageData.publicId || imageData.public_id || ""
      }));
      toast.success("Banner image uploaded successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload banner image.");
    } finally {
      setUploadingBanner(false);
    }
  };

  const handleEditBannerClick = (banner) => {
    setEditingBanner(banner);
    setBannerForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: banner.image || "",
      publicId: banner.publicId || "",
      buttonLink: banner.buttonLink || "",
      buttonText: banner.buttonText || "Explore Now",
      page: banner.page || "home",
      priority: banner.priority || 0,
      isActive: banner.isActive ?? true
    });
    setIsBannerModalOpen(true);
  };

  const handleOpenCreateBanner = () => {
    setEditingBanner(null);
    setBannerForm({ title: "", subtitle: "", image: "", publicId: "", buttonLink: "", buttonText: "Explore Now", page: "home", priority: 0, isActive: true });
    setIsBannerModalOpen(true);
  };

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Configurations</h3>
              
              {settingsLoading ? (
                <div className="space-y-4 animate-pulse">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-16 bg-slate-100 dark:bg-slate-850 rounded-xl" />
                  ))}
                </div>
              ) : settingsData?.length === 0 ? (
                <div className="text-center py-8 text-slate-400 font-semibold">
                  No system variables found.
                </div>
              ) : (
                <div className="space-y-4">
                  {settingsData?.map((setting) => (
                    <div 
                      key={setting._id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/40 rounded-xl gap-3 hover:shadow-xs transition"
                    >
                      <div className="min-w-0">
                        <span className="text-[9px] uppercase font-black bg-[#E85D04]/10 text-[#E85D04] px-2 py-0.5 rounded-sm tracking-wide">
                          {setting.category}
                        </span>
                        <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1">{setting.key}</h5>
                        <p className="text-xs text-slate-400 font-semibold truncate max-w-[300px] mt-0.5">{setting.description || "No description"}</p>
                      </div>
                      <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                        <span className="font-bold text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg max-w-[200px] truncate">
                          {setting.value}
                        </span>
                        <button
                          onClick={() => deleteSettingMutation.mutate(setting._id)}
                          className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upsert Setting form */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 space-y-5">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save configuration</h3>
              
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  saveSettingMutation.mutate(newSetting);
                }} 
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Key</label>
                  <input
                    type="text"
                    required
                    value={newSetting.key}
                    onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                    placeholder="e.g. SITE_LOGO"
                    className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Value</label>
                  <input
                    type="text"
                    required
                    value={newSetting.value}
                    onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                    placeholder="e.g. TravelBharat"
                    className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
                  <CustomDropdown
                    value={newSetting.category}
                    onChange={(val) => setNewSetting({ ...newSetting, category: val })}
                    options={[
                      { value: "general", label: "General" },
                      { value: "social", label: "Social Media" },
                      { value: "contact", label: "Contact Details" },
                      { value: "seo", label: "SEO Configurations" },
                    ]}
                    placeholder="Select Category"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
                  <textarea
                    rows={2}
                    value={newSetting.description}
                    onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                    placeholder="Describe variable usage..."
                    className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saveSettingMutation.isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition cursor-pointer"
                >
                  <FiSave size={16} />
                  <span>Save Parameter</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Hero Banners Tab */}
      {activeTab === "banners" && (
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

export default Settings;
