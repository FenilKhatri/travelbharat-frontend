import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import http from "../../../../lib/axios";

export const useSettingsLogic = () => {
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

  return {
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
  };
};
