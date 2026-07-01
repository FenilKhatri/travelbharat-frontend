import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiEdit, FiTrash2, FiImage, FiMapPin } from "react-icons/fi";
import http from "../../../lib/axios";
import { toast } from "react-toastify";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";
import { useAdminList } from "../hooks/useAdminList";
import { useAdminMutations } from "../hooks/useAdminMutations";

const Cities = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(null);

  // Query states for the filter
  const { data: statesData } = useQuery({
    queryKey: ["adminStatesList"],
    queryFn: async () => {
      const res = await http.get("/states/admin/all?limit=100");
      return res?.data || res;
    },
    staleTime: 60000,
  });
  const statesList = statesData?.data?.items || [];

  const { data, isLoading, isError, error, searchParams, setSearchParams } = useAdminList({
    queryKey: "adminCities",
    endpoint: "/cities/admin/all",
    extractParams: (params) => ({ stateId: params.get("stateId") || "" })
  });

  const { deleteMutation, toggleStatus } = useAdminMutations({
    queryKey: ["adminCities"],
    updateEndpoint: (id) => `/cities/admin/${id}`,
    deleteEndpoint: (id) => `/cities/admin/${id}`,
    successDeleteMsg: "City deleted permanently!"
  });

  const cities = data?.data?.items || [];
  const pagination = {
    total: data?.data?.totalItems || 0,
    pages: data?.data?.totalPages || 1
  };

  const handleEditClick = (cityItem) => navigate(`/admin/cities/edit/${cityItem._id}`);
  const handleOpenCreate = () => navigate("/admin/cities/create");
  const handleToggleActive = (cityItem) => toggleStatus(cityItem._id, cityItem.isActive);

  const filters = [
    {
      key: "stateId",
      label: "Filter by State",
      options: statesList.map(s => ({ value: s._id, label: s.name }))
    }
  ];

  const renderHeader = () => (
    <>
      <th className="py-4 px-6">City / State</th>
      <th className="py-4 px-6">Places</th>
      <th className="py-4 px-6">Status</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (cityItem) => (
    <tr 
      key={cityItem._id} 
      onClick={() => navigate(`/admin/cities/${cityItem._id}`)}
      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/70 transition cursor-pointer"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          {cityItem.images?.thumbnail ? (
            <img
              src={cityItem.images.thumbnail?.url || cityItem.images.thumbnail}
              alt={cityItem.name}
              className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
              <FiImage size={20} />
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              {cityItem.name}
            </h4>
            <span className="text-xs text-slate-400 truncate max-w-[200px] block">
              {cityItem.stateId?.name || "Unknown State"}
            </span>
          </div>
        </div>
      </td>

      <td className="py-4 px-6 font-semibold">
        <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs">
          {cityItem.totalPlaces || 0} Places
        </span>
      </td>

      <td className="py-4 px-6">
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(cityItem); }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
            cityItem.isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20"
              : "bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
          }`}
        >
          {cityItem.isActive ? "Active" : "Hidden"}
        </button>
      </td>

      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleEditClick(cityItem); }}
            className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <FiEdit size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(cityItem._id); }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderGridCard = (cityItem) => (
    <div 
      key={cityItem._id} 
      onClick={() => navigate(`/admin/cities/${cityItem._id}`)}
      className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer relative"
    >
      <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
        {cityItem.images?.thumbnail ? (
          <img
            src={cityItem.images.thumbnail?.url || cityItem.images.thumbnail}
            alt={cityItem.name}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <FiImage size={32} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0A121F] to-transparent opacity-60" />
        <div className="absolute top-3 left-3 flex gap-2">
          {!cityItem.isActive && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              HIDDEN
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h4 className="font-bold text-lg leading-tight mb-1">{cityItem.name}</h4>
          <p className="text-xs text-white/80 capitalize flex items-center gap-1">
            <FiMapPin size={10} /> {cityItem.stateId?.name || "Unknown State"}
          </p>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex-1">
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {cityItem.tagline || cityItem.description || "No description provided."}
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-600 dark:text-slate-300">{cityItem.totalPlaces || 0} Places</span>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <button
            onClick={(e) => { e.stopPropagation(); handleEditClick(cityItem); }}
            className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition cursor-pointer"
          >
            <FiEdit size={14} /> Edit
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(cityItem._id); }}
            className="flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-450 rounded-lg transition cursor-pointer"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AdminDataExplorer
        title="Cities Directory"
        subtitle="Create, edit and manage Indian cities registered for TravelBharat explorer guides."
        onAddClick={handleOpenCreate}
        addButtonLabel="Add New City"
        searchPlaceholder="Search cities by name..."
        filters={filters}
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={cities}
        pagination={pagination}
        renderHeader={renderHeader}
        renderRow={renderRow}
        renderGridCard={renderGridCard}
        emptyStateMessage="No cities registered."
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Delete City?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to delete this city? This action cannot be undone.
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

export default Cities;
