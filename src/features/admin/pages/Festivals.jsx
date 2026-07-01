import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FiEdit, FiTrash2, FiImage, FiCalendar } from "react-icons/fi";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";

import { useAdminList } from "../hooks/useAdminList";
import { useAdminMutations } from "../hooks/useAdminMutations";
import { fest_filters } from "../data/adminData";

const Festivals = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(null);

  // Fetch festivals
  const { data, isLoading, isError, error } = useAdminList({
    queryKey: "adminFestivals",
    endpoint: "/festivals/admin/all",
    extractParams: (params) => ({
      category: params.get("category") || ""
    })
  });

  const { deleteMutation, toggleStatus } = useAdminMutations({
    queryKey: ["adminFestivals"],
    updateEndpoint: (id) => `/festivals/admin/${id}`,
    deleteEndpoint: (id) => `/festivals/admin/${id}`,
    successDeleteMsg: "Festival deleted!"
  });

  const festivals = data?.data?.items || [];
  const pagination = {
    total: data?.data?.totalItems || 0,
    pages: data?.data?.totalPages || 1
  };

  const handleToggleActive = (f) => toggleStatus(f._id, f.isActive);
  const handleEditClick = (f) => navigate(`/admin/festivals/edit/${f._id}`);
  const handleOpenCreate = () => navigate("/admin/festivals/create");

  const renderHeader = () => (
    <>
      <th className="py-4 px-6">Festival</th>
      <th className="py-4 px-6">State</th>
      <th className="py-4 px-6">Month</th>
      <th className="py-4 px-6">Category</th>
      <th className="py-4 px-6">Status</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (f) => (
    <tr 
      key={f._id}
      onClick={() => navigate(`/admin/festivals/${f._id}`)}
      className="hover:bg-slate-50/50 dark:hover:bg-slate-900/70 transition cursor-pointer"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          {f.images?.thumbnail ? (
            <img src={f.images.thumbnail?.url || f.images.thumbnail} alt={f.name} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <FiImage size={20} />
            </div>
          )}
          <span className="font-bold text-slate-800 dark:text-slate-200">{f.name}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-slate-400" />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {f.stateIds?.[0]?.name || "Unknown"}
          </span>
        </div>
      </td>
      <td className="py-4 px-6 capitalize font-semibold">{f.month}</td>
      <td className="py-4 px-6 capitalize">
        <span className="inline-block px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500">
          {f.category}
        </span>
      </td>
      <td className="py-4 px-6">
        <button
          onClick={(e) => { e.stopPropagation(); handleToggleActive(f); }}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer ${
            f.isActive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20"
              : "bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
          }`}
        >
          {f.isActive ? "Active" : "Hidden"}
        </button>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={(e) => { e.stopPropagation(); handleEditClick(f); }} className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800 rounded-xl transition cursor-pointer">
            <FiEdit size={16} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(f._id); }} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer">
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderGridCard = (f) => (
    <div 
      key={f._id}
      onClick={() => navigate(`/admin/festivals/${f._id}`)}
      className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer relative"
    >
      <div className="h-44 bg-slate-100 dark:bg-slate-800 relative">
        {f.images?.thumbnail ? (
          <img src={f.images.thumbnail?.url || f.images.thumbnail} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300">
            <FiImage size={32} />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#0A121F] via-transparent to-transparent opacity-80" />
        <div className="absolute top-3 left-3 flex gap-2">
          {!f.isActive && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
              HIDDEN
            </span>
          )}
        </div>
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20 mb-1.5">
            <FiCalendar size={10} /> {f.month}
          </span>
          <h4 className="font-bold text-lg leading-tight mb-0.5 line-clamp-1">{f.name}</h4>
          <p className="text-xs text-white/80 capitalize flex items-center gap-1 mt-1">
            <FaMapMarkerAlt size={10} /> {f.stateIds?.[0]?.name || "Unknown"}
          </p>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 flex-1">
          {f.description || "No description provided."}
        </p>
        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/60">
          <button onClick={(e) => { e.stopPropagation(); handleEditClick(f); }} className="flex-1 flex items-center justify-center gap-1 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold transition">
            <FiEdit size={14} /> Edit
          </button>
          <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(f._id); }} className="flex items-center justify-center p-2 bg-red-50 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 text-red-600 dark:text-red-450 rounded-lg transition">
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <AdminDataExplorer
        title="Festivals Directory"
        subtitle="Manage Indian festivals and cultural celebrations."
        onAddClick={handleOpenCreate}
        addButtonLabel="Add New Festival"
        searchPlaceholder="Search festivals by name..."
        filters={fest_filters}
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={festivals}
        pagination={pagination}
        renderHeader={renderHeader}
        renderRow={renderRow}
        renderGridCard={renderGridCard}
        emptyStateMessage="No festivals found."
      />

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">Delete Festival?</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
              Are you sure you want to delete this festival? This action cannot be undone.
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

export default Festivals;
