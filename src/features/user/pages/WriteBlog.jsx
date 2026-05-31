import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiX, FiUpload, FiImage, FiChevronDown } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../lib/axios";
import { toast } from "react-toastify";

import { SharedBlogFormFields, INITIAL_BLOG_FORM } from "../../../components/shared/SharedBlogFormFields";

const WriteBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const [form, setForm] = useState(INITIAL_BLOG_FORM);

  // States & Cities for Select
  const { data: statesData } = useQuery({ queryKey: ["publicStates"], queryFn: () => http.get("/states?limit=100") });
  const { data: citiesData } = useQuery({ queryKey: ["publicCities"], queryFn: () => http.get("/cities?limit=100") });
  const { data: placesData } = useQuery({ queryKey: ["publicPlaces"], queryFn: () => http.get("/places?limit=100") });

  const states = statesData?.data?.data?.states || [];
  const cities = citiesData?.data?.data?.cities || [];
  const places = placesData?.data?.data?.places || [];

  const queryClient = useQueryClient();

  const { data: myBlogsData } = useQuery({
    queryKey: ['myBlogs'],
    queryFn: () => http.get('/blogs/user/my-blogs'),
    enabled: !!id
  });

  const blogToEdit = myBlogsData?.data?.blogs?.find(b => b._id === id);

  useEffect(() => {
    if (blogToEdit) {
      setForm({
        title: blogToEdit.title || "",
        slug: blogToEdit.slug || "",
        content: blogToEdit.content || "",
        excerpt: blogToEdit.excerpt || "",
        category: blogToEdit.category || "travel-guide",
        tags: blogToEdit.tags || [],
        images: { 
          hero: blogToEdit.images?.hero || "", 
          thumbnail: blogToEdit.images?.thumbnail || "", 
          gallery: blogToEdit.images?.gallery || [] 
        },
        stateId: blogToEdit.stateId || "",
        relatedCities: blogToEdit.relatedCities || [],
        relatedDestinations: blogToEdit.relatedDestinations || [],
        travelTips: blogToEdit.travelTips || [],
        faqs: blogToEdit.faqs || [],
        priority: blogToEdit.priority || 0,
        featured: blogToEdit.featured || false,
        isPublished: blogToEdit.status === 'published',
        seo: { 
          metaTitle: blogToEdit.seo?.metaTitle || "", 
          metaDescription: blogToEdit.seo?.metaDescription || "",
          keywords: blogToEdit.seo?.keywords || []
        }
      });
    }
  }, [blogToEdit]);

  const createMutation = useMutation({
    mutationFn: (payload) => id ? http.put(`/blogs/${id}`, payload) : http.post("/blogs/create", payload),
    onSuccess: () => { 
      toast.success(id ? "Blog updated successfully!" : "Blog created successfully!");
      queryClient.invalidateQueries(["myBlogs"]);
      navigate("/user/my-blogs"); // or some other page
    },
    onError: (err) => toast.error(err?.response?.data?.message || (id ? "Failed to update blog" : "Failed to create blog")),
  });

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(field);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await http.post("/upload/single", formData, { headers: { "Content-Type": "multipart/form-data" } });
      const url = res.data?.data?.image?.url || res.data?.image?.url;
      const [parent, child] = field.split(".");
      setForm((prev) => ({ ...prev, [parent]: { ...prev[parent], [child]: url } }));
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      status: form.isPublished ? 'published' : 'draft'
    };
    createMutation.mutate(payload);
  };

  const isSubmitting = createMutation.isLoading;

  return (
    <div className="space-y-6 pt-30 pb-12 max-w-4xl mx-auto px-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{id ? "Edit Blog" : "Write a Blog"}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Share your travel experiences with the community.</p>
      </div>

      <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <SharedBlogFormFields 
            form={form} 
            setForm={setForm} 
            states={states} 
            cities={cities} 
            places={places} 
            handleImageUpload={handleImageUpload} 
            uploadingImage={uploadingImage} 
            isAdmin={false} 
          />
          
          {/* Status */}
          <div className="flex gap-6 mt-6">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">
              <input type="radio" checked={form.isPublished === true} onChange={() => setForm({ ...form, isPublished: true })} className="w-4 h-4 accent-[#E85D04]" /> Publish
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-slate-600 dark:text-slate-300">
              <input type="radio" checked={form.isPublished === false} onChange={() => setForm({ ...form, isPublished: false })} className="w-4 h-4 accent-[#E85D04]" /> Draft
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <button type="button" onClick={() => navigate("/user/profile")} className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-xl text-sm transition cursor-pointer">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-sm transition cursor-pointer disabled:opacity-60">
              {isSubmitting ? "Saving..." : (id ? "Update Post" : "Submit Post")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WriteBlog;
