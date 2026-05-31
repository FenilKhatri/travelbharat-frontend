import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiSave, FiArrowLeft, FiUpload, FiPlus, FiTrash2, FiImage, FiSettings, FiAlignLeft, FiHelpCircle, FiFileText } from "react-icons/fi";
import { toast } from "react-toastify";
import http from "../../../lib/axios";
import CustomDropdown from "../../../components/ui/CustomDropdown";

import { SharedBlogFormFields, INITIAL_BLOG_FORM } from "../../../components/shared/SharedBlogFormFields";

// Removed inline definitions

const BlogForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditing = !!id;

  const [form, setForm] = useState(INITIAL_BLOG_FORM);
  const [uploadingImage, setUploadingImage] = useState(null);

  // States & Cities for Select
  const { data: statesData } = useQuery({ queryKey: ["adminStates"], queryFn: () => http.get("/states/admin/all?limit=100") });
  const { data: citiesData } = useQuery({ queryKey: ["adminCities"], queryFn: () => http.get("/cities/admin/all?limit=100") });
  const { data: placesData } = useQuery({ queryKey: ["adminPlaces"], queryFn: () => http.get("/places/admin/all?limit=100") });

  const states = statesData?.data?.data?.states || [];
  const cities = citiesData?.data?.data?.cities || [];
  const places = placesData?.data?.data?.places || [];

  const { data: queryData, isLoading: isFetching, isError } = useQuery({
    queryKey: ["adminBlog", id],
    queryFn: () => http.get(`/blogs/admin/${id}`),
    enabled: isEditing,
  });

  useEffect(() => {
    const b = queryData?.data?.data?.blog || queryData?.data?.blog;
    if (b) {
      setForm({
        title: b.title || "",
        slug: b.slug || "",
        content: b.content || "",
        excerpt: b.excerpt || "",
        category: b.category || "travel-guide",
        tags: b.tags || [],
        images: {
          hero: b.images?.hero || "",
          thumbnail: b.images?.thumbnail || "",
          gallery: b.images?.gallery || [],
        },
        stateId: b.stateId || "",
        relatedCities: b.relatedCities || [],
        relatedDestinations: b.relatedDestinations || [],
        travelTips: b.travelTips || [],
        faqs: b.faqs || [],
        priority: b.priority || 0,
        featured: b.featured || false,
        isPublished: b.isPublished || false,
        seo: {
          metaTitle: b.seo?.metaTitle || "",
          metaDescription: b.seo?.metaDescription || "",
          keywords: b.seo?.keywords || [],
        },
      });
    }
  }, [queryData]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to load blog data");
      navigate("/admin/blogs");
    }
  }, [isError, navigate]);

  const createMutation = useMutation({
    mutationFn: (payload) => http.post("/blogs/admin/create", payload),
    onSuccess: () => {
      toast.success("Blog created!");
      queryClient.invalidateQueries(["adminBlogs"]);
      navigate("/admin/blogs");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to create blog"),
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => http.put(`/blogs/admin/${id}`, payload),
    onSuccess: () => {
      toast.success("Blog updated!");
      queryClient.invalidateQueries(["adminBlogs"]);
      navigate("/admin/blogs");
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to update blog"),
  });

  const isSaving = createMutation.isPending || updateMutation.isPending;

  const handleSave = (e, asPublished) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error("Title and Content are required.");
    const payload = { ...form, isPublished: asPublished };
    isEditing ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const handleImageUpload = async (e, fieldPath, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(fieldPath);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await http.post("/upload/single", fd, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.data?.image?.url || res.data?.image?.url;
      if (isGallery) {
        setForm(prev => ({ ...prev, images: { ...prev.images, gallery: [...prev.images.gallery, url] } }));
      } else {
        const [parent, child] = fieldPath.split(".");
        setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: url } }));
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploadingImage(null);
    }
  };

  // Removed inline functions

  if (isFetching) return <div className="text-center p-10">Loading blog data...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-24 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/admin/blogs")} className="p-2 border rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"><FiArrowLeft /></button>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white">{isEditing ? "Edit Blog Post" : "Create Blog Post"}</h1>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={(e) => handleSave(e, false)} disabled={isSaving} className="px-5 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl text-sm transition">
            Save as Draft
          </button>
          <button onClick={(e) => handleSave(e, true)} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition">
            <FiSave /> Publish Post
          </button>
        </div>
      </div>

      <form className="space-y-6">
        <SharedBlogFormFields 
          form={form} 
          setForm={setForm} 
          states={states} 
          cities={cities} 
          places={places} 
          handleImageUpload={handleImageUpload} 
          uploadingImage={uploadingImage} 
          isAdmin={true} 
        />
      </form>
    </div>
  );
};

export default BlogForm;
