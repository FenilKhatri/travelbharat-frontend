import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../lib/axios";

export const useAdminForm = ({
  queryKey,
  fetchEndpoint, 
  createEndpoint,
  updateEndpoint,
  listRoute, 
  initialState,
  dataExtractor,
  onSuccessCreate = "Created successfully!",
  onSuccessUpdate = "Updated successfully!"
}) => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState(initialState);
  const [uploadingImage, setUploadingImage] = useState(null);

  const { data: queryData, isLoading, isError } = useQuery({
    queryKey: [queryKey, id],
    queryFn: () => http.get(fetchEndpoint(id)),
    enabled: isEditing
  });

  useEffect(() => {
    if (isEditing && queryData) {
      const entity = dataExtractor(queryData);
      if (entity) {
        setForm(entity);
      }
    }
  }, [queryData, isEditing, dataExtractor]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load data");
      navigate(listRoute);
    }
  }, [isError, navigate, listRoute]);

  const createMutation = useMutation({
    mutationFn: (payload) => http.post(createEndpoint, payload),
    onSuccess: () => {
      toast.success(onSuccessCreate);
      queryClient.invalidateQueries({ queryKey });
      navigate(listRoute);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Creation failed"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => http.put(updateEndpoint(id), payload),
    onSuccess: () => {
      toast.success(onSuccessUpdate);
      queryClient.invalidateQueries({ queryKey });
      // Invalidate specific item cache too
      queryClient.invalidateQueries({ queryKey: [queryKey, id] });
      navigate(listRoute);
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Update failed"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (payload) => {
    isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const uploadSingleImage = async (file, fieldPath) => {
    setUploadingImage(fieldPath);
    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await http.post("/upload/single", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res?.data?.data?.image?.url || res?.data?.image?.url || res?.data?.url;
      if (!url) throw new Error("URL missing in response");
      return url;
    } finally {
      setUploadingImage(null);
    }
  };

  const uploadMultipleImages = async (files, fieldPath) => {
    setUploadingImage(fieldPath);
    try {
      const fd = new FormData();
      Array.from(files).forEach(file => fd.append("images", file));
      const res = await http.post("/upload/multiple", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const urls = res?.data?.data?.images?.map(img => img.url) || res?.data?.images?.map(img => img.url);
      if (!urls || urls.length === 0) throw new Error("No image URLs returned from server");
      return urls;
    } finally {
      setUploadingImage(null);
    }
  };

  return {
    id,
    isEditing,
    form,
    setForm,
    isLoading,
    isError,
    isSaving,
    handleSave,
    uploadingImage,
    uploadSingleImage,
    uploadMultipleImages
  };
};
