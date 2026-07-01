import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../../../context/AuthContext";
import { authService } from "../../../../services/authService";
import http from "../../../../lib/axios";

export const useProfileLogic = () => {
  const { user, fetchUser } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    state: user?.state || "",
    city: user?.city || ""
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        phone: user.phone || "",
        bio: user.bio || "",
        state: user.state || "",
        city: user.city || ""
      });
    }
  }, [user]);

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

  return {
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
  };
};
