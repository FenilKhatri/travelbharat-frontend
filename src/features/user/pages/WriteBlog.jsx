import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FiX, FiUpload, FiImage, FiChevronDown } from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../../lib/axios";
import { toast } from "react-toastify";
import PageLoader from "../../../components/ui/PageLoader";

import {
  FormCard,
  FormField,
  FormInput,
  FormTextarea,
  FormImageUpload,
  ArrayEditor,
  FormToggle,
  FormHeader,
  FormSEO,
  FormGallery} from "../../admin/components/form";
import CustomDropdown from "../../../components/ui/CustomDropdown";

const CATEGORIES = [
  "travel-guide", "destination", "food", "culture", 
  "adventure", "heritage", "festivals", "tips", 
  "budget-travel", "luxury-travel", "wildlife", "spiritual", "other"
];

const INITIAL_BLOG_FORM = {
  title: "",
  slug: "",
  content: "",
  excerpt: "",
  category: "travel-guide",
  tags: [],
  images: { hero: "", thumbnail: "" },
  gallery: [],
  stateId: "",
  relatedCities: [],
  relatedDestinations: [],
  travelTips: [],
  faqs: [],
  isPublished: false};

const WriteBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [uploadingImage, setUploadingImage] = useState(false);
  const [form, setForm] = useState(INITIAL_BLOG_FORM);

  // States & Cities for Select
  const { data: statesData } = useQuery({ queryKey: ["publicStates"], queryFn: () => http.get("/states?limit=100") });
  const { data: citiesData } = useQuery({ queryKey: ["publicCities"], queryFn: () => http.get("/cities?limit=100") });
  const { data: placesData } = useQuery({ queryKey: ["publicPlaces"], queryFn: () => http.get("/places?limit=100") });

  const states = statesData?.data?.data?.states || [];
  const cities = citiesData?.data?.data?.cities || [];
  const places = placesData?.data?.data?.places || [];

  const queryClient = useQueryClient();

  const { data: myBlogsData, isLoading: isLoadingBlog } = useQuery({
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
          thumbnail: blogToEdit.images?.thumbnail || ""},
        gallery: blogToEdit.images?.gallery || [],
        stateId: blogToEdit.stateId || "",
        relatedCities: blogToEdit.relatedCities || [],
        relatedDestinations: blogToEdit.relatedDestinations || [],
        travelTips: blogToEdit.travelTips || [],
        faqs: blogToEdit.faqs || [],
        isPublished: blogToEdit.status === 'published'});
    }
  }, [blogToEdit]);

  const createMutation = useMutation({
    mutationFn: (payload) => id ? http.put(`/blogs/${id}`, payload) : http.post("/blogs/create", payload),
    onSuccess: () => { 
      toast.success(id ? "Blog updated successfully!" : "Blog created successfully!");
      queryClient.invalidateQueries(["myBlogs"]);
      navigate("/user/profile"); // or some other page
    },
    onError: (err) => toast.error(err?.response?.data?.message || (id ? "Failed to update blog" : "Failed to create blog"))});

  const uploadSingleImage = async (file, path) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await http.post("/upload/single", formData, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data?.data?.image?.url || res.data?.image?.url;
  };
  
  const uploadMultipleImages = async (files, path) => {
      const formData = new FormData();
      Array.from(files).forEach(file => formData.append("images", file));
      const res = await http.post("/upload/multiple", formData, { headers: { "Content-Type": "multipart/form-data" } });
      return res.data?.data?.images?.map(img => img.url) || res.data?.images?.map(img => img.url) || [];
  };

  const handleImgUpload = async (file, path) => {
    setUploadingImage(path);
    try {
      const url = await uploadSingleImage(file, path);
      const keys = path.split(".");
      if (keys.length === 1) {
          setForm(prev => ({ ...prev, [path]: url }));
      } else {
          const [parent, child] = keys;
          setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: url } }));
      }
      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const set = (key, value) => {
    setForm(prev => {
      const keys = key.split(".");
      if (keys.length === 1) return { ...prev, [key]: value };
      const [parent, child] = keys;
      return { ...prev, [parent]: { ...prev[parent], [child]: value } };
    });
  };

  const handleArrayString = (key, value) => {
    const arr = value.split(",").map(s => s.trim()).filter(Boolean);
    set(key, arr);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
        toast.error("Title and content are required.");
        return;
    }
    const payload = {
      ...form,
      images: {
          ...form.images,
          gallery: form.gallery
      },
      status: form.isPublished ? 'published' : 'draft'
    };
    createMutation.mutate(payload);
  };

  const isSubmitting = createMutation.isLoading || createMutation.isPending;

  if (isLoadingBlog) {
      return <div className="min-h-[60vh] flex items-center justify-center"><PageLoader fullScreen={false} size="md" /></div>;
  }

  return (
    <div className="space-y-6 pt-30 pb-12 max-w-4xl mx-auto px-4">
      <div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">{id ? "Edit Blog" : "Write a Blog"}</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Share your travel experiences with the community.</p>
      </div>

      <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <FormCard title="Basic Information">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Title" required><FormInput value={form.title} onChange={v => set("title", v)} /></FormField>
                    <FormField label="Slug"><FormInput value={form.slug} onChange={v => set("slug", v)} placeholder="Auto-generated if empty" /></FormField>
                    <FormField label="Category" required>
                        <CustomDropdown
                        value={form.category}
                        onChange={(val) => set("category", val)}
                        options={CATEGORIES.map(c => ({ value: c, label: c.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) }))}
                        placeholder="Select Category"
                        />
                    </FormField>
                    <FormField label="State (Optional)">
                        <CustomDropdown
                        value={form.stateId}
                        onChange={(val) => set("stateId", val)}
                        options={[
                            { value: "", label: "None" },
                            ...states.map(s => ({ value: s._id, label: s.name })),
                        ]}
                        placeholder="None"
                        searchable
                        />
                    </FormField>
                    <FormField label="Excerpt" span2><FormTextarea value={form.excerpt} onChange={v => set("excerpt", v)} rows={2} /></FormField>
                    <FormField label="Tags (comma separated)" span2><FormInput value={form.tags.join(", ")} onChange={v => handleArrayString("tags", v)} /></FormField>
                </div>
            </FormCard>

            <FormCard title="Content Editor">
                <div className="flex justify-between items-end mb-2">
                    <div className="text-xs text-slate-500 font-bold">Supports Markdown formatting</div>
                </div>
                <FormTextarea value={form.content} onChange={v => set("content", v)} placeholder="Write your amazing post here..." rows={20} required />
            </FormCard>

            <FormCard title="Images" defaultOpen={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <FormImageUpload
                    src={form.images.hero}
                    label="Hero Image (16:9)"
                    onUpload={e => handleImgUpload(e.target.files[0], "images.hero")}
                    uploading={uploadingImage === "images.hero"}
                    onRemove={() => set("images.hero", "")}
                    />
                    <FormImageUpload
                    src={form.images.thumbnail}
                    label="Thumbnail (1:1)"
                    aspect="aspect-square max-w-[250px]"
                    onUpload={e => handleImgUpload(e.target.files[0], "images.thumbnail")}
                    uploading={uploadingImage === "images.thumbnail"}
                    onRemove={() => set("images.thumbnail", "")}
                    />
                </div>
            </FormCard>
            
            <FormGallery 
                images={form.gallery.map(u => ({url: u}))}
                onChange={(newGallery) => set("gallery", newGallery.map(g => g.url))}
                onUpload={async (e) => {
                    setUploadingImage("gallery");
                    try {
                        const urls = await uploadMultipleImages(e.target.files, "gallery");
                        set("gallery", [...form.gallery, ...urls]);
                    } catch(err) {
                        toast.error("Upload failed");
                    } finally {
                        setUploadingImage(false);
                    }
                }}
                uploading={uploadingImage === "gallery"}
            />

            <FormCard title="Travel Tips" defaultOpen={false}>
                <ArrayEditor
                    items={form.travelTips.map(t => ({ tip: t }))}
                    onAdd={() => set("travelTips", [...form.travelTips, ""])}
                    onRemove={(idx) => set("travelTips", form.travelTips.filter((_, i) => i !== idx))}
                    renderItem={(item, idx, onChange) => (
                        <FormInput value={item.tip} onChange={v => {
                            const newTips = [...form.travelTips];
                            newTips[idx] = v;
                            set("travelTips", newTips);
                        }} placeholder={`Tip ${idx+1}`} />
                    )}
                />
            </FormCard>
            
            <FormCard title="FAQs" defaultOpen={false}>
                <ArrayEditor
                    items={form.faqs}
                    onAdd={() => set("faqs", [...form.faqs, { question: "", answer: "" }])}
                    onRemove={(idx) => set("faqs", form.faqs.filter((_, i) => i !== idx))}
                    renderItem={(item, idx, onChange) => (
                        <div className="space-y-3">
                            <FormInput value={item.question} onChange={v => onChange("question", v)} placeholder="Question" />
                            <FormTextarea value={item.answer} onChange={v => onChange("answer", v)} placeholder="Answer" rows={2} />
                        </div>
                    )}
                />
            </FormCard>

            <FormCard title="Related Content" defaultOpen={false}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <FormField label="Related Cities (Select Multiple)">
                    <CustomDropdown
                        multiple
                        searchable
                        value={form.relatedCities || []}
                        onChange={(val) => set("relatedCities", val)}
                        options={cities.map(c => ({ value: c._id, label: c.name }))}
                        placeholder="Select Cities..."
                    />
                    </FormField>
                    <FormField label="Related Destinations">
                    <CustomDropdown
                        multiple
                        searchable
                        value={form.relatedDestinations || []}
                        onChange={(val) => set("relatedDestinations", val)}
                        options={places.map(p => ({ value: p._id, label: p.name }))}
                        placeholder="Select Destinations..."
                    />
                    </FormField>
                </div>
            </FormCard>

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
