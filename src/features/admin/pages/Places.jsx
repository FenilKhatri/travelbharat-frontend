import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  FiMapPin,
  FiEdit,
  FiTrash2,
  FiImage,
  FiStar,
  FiTrendingUp
} from "react-icons/fi";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";

import { useAdminList } from "../hooks/useAdminList";
import { useAdminMutations } from "../hooks/useAdminMutations";
import { places_filters } from "../data/adminData";
import Checkbox from "../../../components/ui/Checkbox";

const Places = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  // Queries
  const { data, isLoading, isError, error } = useAdminList({
    queryKey: "adminPlaces",
    endpoint: "/places/admin/all",
    extractParams: (params) => ({
      category: params.get("category") || "",
      budget: params.get("budget") || ""
    })
  });

  const { deleteMutation, toggleStatus, updateMutation } = useAdminMutations({
    queryKey: ["adminPlaces"],
    updateEndpoint: (id) => `/places/admin/${id}`,
    deleteEndpoint: (id) => `/places/admin/${id}`,
    successDeleteMsg: "Place deleted permanently!"
  });

  const responseData = data?.data || {};
  const places = responseData.items || [];
  const pagination = {
    total: responseData.totalItems || 0,
    pages: responseData.totalPages || 1
  };

  const handleEditClick = (place) => navigate(`/admin/places/edit/${place._id}`);
  const handleOpenCreate = () => navigate("/admin/places/create");

  const handleToggleFeatured = (place) => {
    updateMutation.mutate({ id: place._id, payload: { featured: !place.featured } });
  };

  const handleToggleTrending = (place) => {
    updateMutation.mutate({ id: place._id, payload: { trending: !place.trending } });
  };

  const handleToggleActive = (place) => toggleStatus(place._id, place.isActive);

  const renderHeader = ({ isAllSelected, toggleSelectAll }) => (
    <>
      <th className="py-4 px-6 w-12">
        <Checkbox checked={isAllSelected || false} onChange={toggleSelectAll} />
      </th>
      <th className="py-4 px-6">Place Info</th>
      <th className="py-4 px-6">Location</th>
      <th className="py-4 px-6">Category / Ratings</th>
      <th className="py-4 px-6">Status / Tags</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (place, { isSelected, toggleSelection }) => (
    <tr
      key={place._id}
      onClick={() => navigate(`/admin/places/${place._id}`)}
      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b border-slate-100 dark:border-slate-800/30 cursor-pointer"
    >
      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected || false} onChange={() => toggleSelection(place._id)} />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          {place.images?.thumbnail ? (
            <img
              src={place.images.thumbnail?.url || place.images.thumbnail}
              alt={place.name}
              className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
              <FiImage size={20} />
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">
              {place.name}
            </h4>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="text-slate-700 dark:text-slate-300 font-semibold text-sm">
          {place.cityId?.name || place.stateId?.name || "Unknown"}
        </span>
      </td>
      <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">
        {place.category?.replace(/-/g, " ") || "Other"} / {place.rating || "N/A"}
      </td>
      <td className="py-4 px-6">
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(place); }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
            place.isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20"
              : "bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
          }`}
        >
          {place.isActive ? "Active" : "Hidden"}
        </button>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleEditClick(place); }}
            className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(place._id); }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderGridCard = (place, { isSelected, toggleSelection }) => (
    <div
      key={place._id}
      className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer relative"
    >
      <div className="absolute top-4 left-4 z-20">
        <Checkbox checked={isSelected || false} onChange={(e) => { e.stopPropagation(); toggleSelection(place._id); }} />
      </div>

      <div 
        onClick={() => navigate(`/admin/places/${place._id}`)}
        className="h-40 bg-slate-100 dark:bg-slate-800 relative"
      >
        {place.images?.thumbnail ? (
          <img
            src={place.images.thumbnail?.url || place.images.thumbnail}
            alt={place.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <FiImage size={32} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0A121F] via-transparent to-transparent opacity-80" />
      </div>
      <div className="p-4" onClick={() => navigate(`/admin/places/${place._id}`)}>
        <h4 className="font-bold text-lg leading-tight mb-1 line-clamp-1">{place.name}</h4>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <FiMapPin size={10} /> {place.cityId?.name || "Unknown"}
        </p>
      </div>
    </div>
  );

  const bulkActions = [
    {
      label: "Delete",
      icon: <FiTrash2 />,
      variant: "danger",
      onClick: async (ids, clearSelection) => {
        const results = await Promise.allSettled(
          ids.map(id => deleteMutation.mutateAsync(id))
        );
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
          import("react-toastify").then(({ toast }) => {
            toast.error(`Failed to delete ${failed.length} items`);
          });
        } else {
          import("react-toastify").then(({ toast }) => {
            toast.success(`Successfully deleted ${ids.length} items`);
          });
        }
        clearSelection();
      }
    }
  ];

  return (
    <>
      <AdminDataExplorer
        title="Places Directory"
        subtitle="Manage all tourist attractions, monuments, and places of interest."
        onAddClick={handleOpenCreate}
        addButtonLabel="Add New Place"
        searchPlaceholder="Search places by name or city..."
        filters={places_filters}
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={places}
        pagination={pagination}
        renderHeader={renderHeader}
        renderRow={renderRow}
        renderGridCard={renderGridCard}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={bulkActions}
        emptyStateMessage="No places registered."
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Delete Destination?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to delete this place? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete)}
                disabled={deleteMutation.isLoading}
                className="flex-1 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition disabled:opacity-50 cursor-pointer"
              >
                {deleteMutation.isLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Places;
