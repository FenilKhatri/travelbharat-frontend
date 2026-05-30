import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import {
  FiMapPin,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiX,
  FiImage,
  FiUpload,
  FiStar,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
} from "react-icons/fi";
import http from "../../../lib/axios";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import { toast } from "react-toastify";

const Places = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Modal Control States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlace, setEditingPlace] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [uploadingImage, setUploadingImage] = useState({ thumbnail: false, hero: false });

  // Form State
  const initialForm = {
    name: "",
    stateId: "",
    cityId: "",
    description: "",
    category: "heritage",
    budget: "moderate",
    entryFee: {
      indian: "Free",
      foreigner: "Free"
    },
    timings: "Open 24 hours",
    featured: false,
    trending: false,
    isActive: true,
    images: {
      thumbnail: "",
      hero: ""
    }
  };
  const [form, setForm] = useState(initialForm);

  // URL Params
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const budgetFilter = searchParams.get("budget") || "";

  // Queries
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminPlaces", page, search, categoryFilter, budgetFilter],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (categoryFilter) params.category = categoryFilter;
      if (budgetFilter) params.budget = budgetFilter;

      const response = await http.get("/places/admin/all", { params });
      return response.data;
    },
    keepPreviousData: true
  });

  const responseData = data?.data || {};
  const places = responseData.places || [];
  const pagination = responseData.pagination || { total: 0, pages: 1 };

  // Fetch States for form options
  const { data: statesList = [] } = useQuery({
    queryKey: ["statesListForSelect"],
    queryFn: async () => {
      const res = await http.get("/states?limit=100");
      let states = res.data.data.states || [];
      // Make Gujarat appear first
      const gujaratIdx = states.findIndex(s => s.name.toLowerCase() === "gujarat");
      if (gujaratIdx !== -1) {
        const gujarat = states.splice(gujaratIdx, 1)[0];
        states.unshift(gujarat);
      }
      return states;
    }
  });

  // Fetch Cities based on selected State in Form
  const selectedStateSlug = statesList.find(s => s._id === form.stateId)?.slug;
  const { data: citiesList = [] } = useQuery({
    queryKey: ["citiesForSelect", selectedStateSlug],
    queryFn: async () => {
      if (!selectedStateSlug) return [];
      const res = await http.get(`/cities/state/${selectedStateSlug}`);
      let cities = res.data.data.cities || [];
      // Make Surat appear first if state is Gujarat
      if (selectedStateSlug.toLowerCase() === "gujarat") {
        const suratIdx = cities.findIndex(c => c.name.toLowerCase() === "surat");
        if (suratIdx !== -1) {
          const surat = cities.splice(suratIdx, 1)[0];
          cities.unshift(surat);
        }
      }
      return cities;
    },
    enabled: !!selectedStateSlug
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await http.post("/places/admin/create", payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Destination created successfully!");
      setIsFormOpen(false);
      setForm(initialForm);
      queryClient.invalidateQueries(["adminPlaces"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to create destination");
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await http.put(`/places/admin/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Destination details updated!");
      setIsFormOpen(false);
      setEditingPlace(null);
      setForm(initialForm);
      queryClient.invalidateQueries(["adminPlaces"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update destination");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/places/admin/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Destination deleted!");
      setConfirmDelete(null);
      queryClient.invalidateQueries(["adminPlaces"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete destination");
    }
  });

  const handleEditClick = (place) => {
    setEditingPlace(place);
    setForm({
      name: place.name || "",
      stateId: place.stateId?._id || place.stateId || "",
      cityId: place.cityId?._id || place.cityId || "",
      description: place.description || "",
      category: place.category || "heritage",
      budget: place.budget || "moderate",
      entryFee: {
        indian: place.entryFee?.indian || "Free",
        foreigner: place.entryFee?.foreigner || "Free"
      },
      timings: place.timings || "Open 24 hours",
      featured: place.featured || false,
      trending: place.trending || false,
      isActive: place.isActive ?? true,
      images: {
        thumbnail: place.images?.thumbnail || "",
        hero: place.images?.hero || ""
      }
    });
    setIsFormOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingPlace(null);
    setForm(initialForm);
    setIsFormOpen(true);
  };

  const handleImageUpload = async (e, fieldName) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage((prev) => ({ ...prev, [fieldName]: true }));
    const formData = new FormData();
    formData.append("image", file);

    try {
      const uploadRes = await http.post("/upload/single", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      const imageUrl = uploadRes.data.data.image.url;

      setForm((prev) => ({
        ...prev,
        images: {
          ...prev.images,
          [fieldName]: imageUrl
        }
      }));
      toast.success(`${fieldName} image uploaded successfully!`);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to upload image.");
    } finally {
      setUploadingImage((prev) => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.stateId || !form.cityId) {
      return toast.warning("State and City fields are required!");
    }

    if (editingPlace) {
      updateMutation.mutate({ id: editingPlace._id, payload: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleToggleFeatured = (place) => {
    updateMutation.mutate({
      id: place._id,
      payload: { featured: !place.featured }
    });
  };

  const handleToggleTrending = (place) => {
    updateMutation.mutate({
      id: place._id,
      payload: { trending: !place.trending }
    });
  };

  const handleToggleActive = (place) => {
    updateMutation.mutate({
      id: place._id,
      payload: { isActive: !place.isActive }
    });
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  // Filter Categories dropdown options
  const categoriesList = [
    { value: "heritage", label: "Heritage" },
    { value: "nature", label: "Nature" },
    { value: "temple", label: "Temple" },
    { value: "beach", label: "Beach" },
    { value: "hill-station", label: "Hill Station" },
    { value: "wildlife", label: "Wildlife" },
    { value: "adventure", label: "Adventure" },
    { value: "religious", label: "Religious" },
    { value: "modern", label: "Modern" },
    { value: "other", label: "Other" }
  ];

  const filters = [
    {
      key: "category",
      label: "Category",
      options: categoriesList
    },
    {
      key: "budget",
      label: "Budget",
      options: [
        { value: "budget", label: "Budget Friendly" },
        { value: "moderate", label: "Moderate" },
        { value: "luxury", label: "Luxury" }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Destinations</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Review, create, and manage registered tourist places across states.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
            <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiLayoutGrid size={16} /></button>
          </div>
          <button
            onClick={handleOpenCreate}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-xs transition duration-200 cursor-pointer shrink-0"
        >
          <FiPlus size={16} />
          <span>Add Destination</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <SearchAndFilter
        searchPlaceholder="Search destinations..."
        filters={filters}
      />

      {/* Destinations List Card */}
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-55/40 dark:bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                <th className="py-4 px-6">Destination</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Rating</th>
                <th className="py-4 px-6">Promoted</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm text-slate-650 dark:text-slate-350">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                        <div className="space-y-2">
                          <div className="w-32 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="w-20 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="py-4 px-6"><div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-20 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                    <td className="py-4 px-6"><div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                    <td className="py-4 px-6 text-right"><div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan="7" className="text-center py-10 text-red-500 font-bold">
                    Error loading destinations: {error?.message}
                  </td>
                </tr>
              ) : places.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 font-semibold">
                    <FiMapPin size={36} className="mx-auto mb-3 text-slate-300" />
                    No tourist places registered yet.
                  </td>
                </tr>
              ) : (
                places.map((place) => (
                  <tr key={place._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/5 transition">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        {place.images?.thumbnail ? (
                          <img
                            src={place.images.thumbnail}
                            alt={place.name}
                            className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                            <FiImage size={20} />
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{place.name}</h4>
                          <span className="text-xs text-slate-400 capitalize">{place.budget} budget</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold">
                      {place.cityId?.name || "—"}, {place.stateId?.name || "—"}
                    </td>

                    <td className="py-4 px-6 font-semibold capitalize text-xs">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md">
                        {place.category}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-[#E85D04] font-bold">
                        <FiStar size={14} className="fill-[#E85D04]" />
                        <span>{place.rating?.toFixed(1) || "0.0"}</span>
                        <span className="text-xs font-normal text-slate-400">({place.reviewCount})</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {/* Featured */}
                        <button
                          onClick={() => handleToggleFeatured(place)}
                          title="Toggle Featured"
                          className={`p-1.5 rounded-lg border transition duration-200 cursor-pointer ${
                            place.featured
                              ? "bg-amber-500/10 border-amber-500/20 text-amber-500"
                              : "border-slate-200 dark:border-slate-800 text-slate-300 hover:text-slate-500"
                          }`}
                        >
                          <FiStar size={14} className={place.featured ? "fill-amber-500" : ""} />
                        </button>
                        {/* Trending */}
                        <button
                          onClick={() => handleToggleTrending(place)}
                          title="Toggle Trending"
                          className={`p-1.5 rounded-lg border transition duration-200 cursor-pointer ${
                            place.trending
                              ? "bg-blue-500/10 border-blue-500/20 text-blue-500"
                              : "border-slate-200 dark:border-slate-800 text-slate-300 hover:text-slate-500"
                          }`}
                        >
                          <FiTrendingUp size={14} />
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(place)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
                          place.isActive
                            ? "bg-emerald-500/10 text-emerald-605 dark:text-emerald-450 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-650 dark:text-red-450 hover:bg-red-500/20"
                        }`}
                      >
                        {place.isActive ? "Active" : "Hidden"}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditClick(place)}
                          className="p-2 text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
                        >
                          <FiEdit size={16} />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(place._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && !isError && pagination.pages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800/40">
            <span className="text-xs font-semibold text-slate-400">
              Showing page {page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >
                <FiChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >
                <span>Next</span>
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
            
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800/45 mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingPlace ? `Edit Destination: ${editingPlace.name}` : "Add Destination"}
              </h3>
              <button onClick={() => setIsFormOpen(false)} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-pointer">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Destination Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Somnath Temple"
                    className="w-full px-4 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  >
                    {categoriesList.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* State & City Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">State</label>
                  <select
                    required
                    value={form.stateId}
                    onChange={(e) => setForm({ ...form, stateId: e.target.value, cityId: "" })}
                    className="w-full px-3 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  >
                    <option value="">Select State</option>
                    {statesList.map((st) => (
                      <option key={st._id} value={st._id}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">City</label>
                  <select
                    required
                    value={form.cityId}
                    disabled={!form.stateId}
                    onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04] disabled:opacity-50"
                  >
                    <option value="">Select City</option>
                    {citiesList.map((ct) => (
                      <option key={ct._id} value={ct._id}>{ct.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Overview Description</label>
                <textarea
                  required
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Detailed tour highlights and intro text..."
                  className="w-full px-4 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Budget Class</label>
                  <select
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    className="w-full px-3 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  >
                    <option value="budget">Budget Friendly</option>
                    <option value="moderate">Moderate</option>
                    <option value="luxury">Luxury</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Timings</label>
                  <input
                    type="text"
                    value={form.timings}
                    onChange={(e) => setForm({ ...form, timings: e.target.value })}
                    placeholder="e.g. 6 AM to 9 PM"
                    className="w-full px-4 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
                  />
                </div>
                <div className="flex gap-4 items-end pb-3">
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                      className="rounded text-[#E85D04] focus:ring-[#E85D04] w-4 h-4"
                    />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-bold text-xs">
                    <input
                      type="checkbox"
                      checked={form.trending}
                      onChange={(e) => setForm({ ...form, trending: e.target.checked })}
                      className="rounded text-[#E85D04] focus:ring-[#E85D04] w-4 h-4"
                    />
                    <span>Trending</span>
                  </label>
                </div>
              </div>

              {/* Entry Fees details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-slate-150 dark:border-slate-800/40">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Indian Entry Fee</label>
                  <input
                    type="text"
                    value={form.entryFee.indian}
                    onChange={(e) => setForm({
                      ...form,
                      entryFee: { ...form.entryFee, indian: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-[#E85D04]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Foreigner Entry Fee</label>
                  <input
                    type="text"
                    value={form.entryFee.foreigner}
                    onChange={(e) => setForm({
                      ...form,
                      entryFee: { ...form.entryFee, foreigner: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-1 focus:ring-[#E85D04]"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400">Thumbnail Image</label>
                  <div className="flex items-center gap-3">
                    {form.images.thumbnail ? (
                      <img src={form.images.thumbnail} alt="Thumbnail" className="w-14 h-14 object-cover rounded-lg border border-slate-200" />
                    ) : (
                      <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><FiImage /></div>
                    )}
                    <label className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition">
                      <FiUpload size={14} />
                      <span>{uploadingImage.thumbnail ? "Uploading..." : "Upload"}</span>
                      <input type="file" onChange={(e) => handleImageUpload(e, "thumbnail")} className="hidden" disabled={uploadingImage.thumbnail} />
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400">Hero Image</label>
                  <div className="flex items-center gap-3">
                    {form.images.hero ? (
                      <img src={form.images.hero} alt="Hero" className="w-20 h-10 object-cover rounded-lg border border-slate-200" />
                    ) : (
                      <div className="w-20 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center text-slate-400"><FiImage /></div>
                    )}
                    <label className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold rounded-lg cursor-pointer transition">
                      <FiUpload size={14} />
                      <span>{uploadingImage.hero ? "Uploading..." : "Upload"}</span>
                      <input type="file" onChange={(e) => handleImageUpload(e, "hero")} className="hidden" disabled={uploadingImage.hero} />
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/40">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-350 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isLoading || updateMutation.isLoading}
                  className="px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-xs transition duration-200 cursor-pointer"
                >
                  {editingPlace ? "Save Updates" : "Save Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Destination?</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
              Deleting this place will permanently remove it from state catalogs and all traveler itineraries. This action is irreversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-305 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete)}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition"
              >
                Delete Destination
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Places;
