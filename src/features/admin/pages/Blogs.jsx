import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { FiBookOpen, FiTrash2, FiImage, FiEye, FiEyeOff } from "react-icons/fi";
import { FaPencilAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";

import { useAdminList } from "../hooks/useAdminList";
import { useAdminMutations } from "../hooks/useAdminMutations";
import Checkbox from "../../../components/ui/Checkbox";

const Blogs = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const { data, isLoading, isError, error, searchParams, setSearchParams } = useAdminList({
    queryKey: "adminBlogs",
    endpoint: "/blogs/admin/all"
  });

  const { deleteMutation, updateMutation } = useAdminMutations({
    queryKey: ["adminBlogs"],
    updateEndpoint: (id) => `/blogs/admin/${id}`,
    deleteEndpoint: (id) => `/blogs/admin/${id}`,
    successDeleteMsg: "Blog deleted!"
  });

  const blogs = data?.data?.data?.blogs || data?.data?.blogs || [];
  const pagination = data?.data?.data?.pagination || data?.data?.pagination || { total: 0, pages: 1 };

  const togglePublish = {
    mutate: ({ id, val }) => updateMutation.mutate({ id, payload: { isPublished: val } }, {
      onSuccess: () => toast.success(val ? "Blog published!" : "Blog unpublished!")
    })
  };

  const handleEditClick = (e, b) => {
    e.stopPropagation();
    navigate(`/admin/blogs/edit/${b._id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const handleRowClick = (b) => {
    navigate(`/admin/blogs/${b._id}`);
  };

  const renderHeader = ({ isAllSelected, toggleSelectAll }) => (
    <>
      <th className="py-4 px-6 w-12">
        <Checkbox checked={isAllSelected || false} onChange={toggleSelectAll} />
      </th>
      <th className="py-4 px-6">Blog Post</th>
      <th className="py-4 px-6">Category</th>
      <th className="py-4 px-6">Read Time</th>
      <th className="py-4 px-6">Published</th>
      <th className="py-4 px-6">Views</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (b, { isSelected, toggleSelection }) => (
    <tr 
      key={b._id} 
      onClick={() => handleRowClick(b)}
      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b border-slate-100 dark:border-slate-800/30 cursor-pointer"
    >
      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected || false} onChange={() => toggleSelection(b._id)} />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          {b.images?.thumbnail ? (
            <img src={b.images.thumbnail?.url || b.images.thumbnail} alt={b.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><FiImage size={16} className="text-slate-400" /></div>
          )}
          <div>
            <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{b.title}</p>
            <p className="text-xs text-slate-400 line-clamp-1">{b.excerpt}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="inline-block whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize">{b.category?.replace(/-/g, " ")}</span>
      </td>
      <td className="py-4 px-6 text-slate-500">{b.readTime || "—"} min</td>
      <td className="py-4 px-6">
        <button
          onClick={(e) => { e.stopPropagation(); togglePublish.mutate({ id: b._id, val: !b.isPublished }); }}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition ${b.isPublished ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"}`}
        >
          {b.isPublished ? <><FiEye size={12} /> Published</> : <><FiEyeOff size={12} /> Draft</>}
        </button>
      </td>
      <td className="py-4 px-6 text-slate-500">{b.views || 0}</td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button onClick={(e) => handleEditClick(e, b)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"><FaPencilAlt size={15} /></button>
          <button onClick={(e) => handleDeleteClick(e, b._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"><FiTrash2 size={15} /></button>
        </div>
      </td>
    </tr>
  );

  const renderGridCard = (b, { isSelected, toggleSelection }) => (
    <div 
      key={b._id} 
      className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer relative"
    >
      <div className="absolute top-4 left-4 z-20">
        <Checkbox checked={isSelected || false} onChange={(e) => { e.stopPropagation(); toggleSelection(b._id); }} />
      </div>
      <div onClick={() => handleRowClick(b)} className="h-40 bg-slate-100 dark:bg-slate-800 relative">
        {b.images?.thumbnail ? (
          <img src={b.images.thumbnail?.url || b.images.thumbnail} alt={b.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <FiImage size={32} />
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-1">
            <span className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded">
              {b.category?.replace(/-/g, " ")}
            </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1" onClick={() => handleRowClick(b)}>
        <h4 className="font-black text-lg text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition line-clamp-2">{b.title}</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{b.excerpt}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <button
            onClick={(e) => { e.stopPropagation(); togglePublish.mutate({ id: b._id, val: !b.isPublished }); }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold cursor-pointer transition ${b.isPublished ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" : "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20"}`}
          >
            {b.isPublished ? <><FiEye size={12} /> Published</> : <><FiEyeOff size={12} /> Draft</>}
          </button>
          <div className="flex items-center gap-1">
            <button onClick={(e) => handleEditClick(e, b)} className="p-2 text-slate-400 hover:text-[#E85D04] bg-slate-50 dark:bg-slate-800 hover:bg-[#E85D04]/10 rounded-lg transition"><FaPencilAlt size={14} /></button>
            <button onClick={(e) => handleDeleteClick(e, b._id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
          </div>
        </div>
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
          toast.error(`Failed to delete ${failed.length} items`);
        } else {
          toast.success(`Successfully deleted ${ids.length} items`);
        }
        clearSelection();
      }
    }
  ];

  return (
    <>
      <AdminDataExplorer
        title="Blogs"
        subtitle="Create, manage and publish travel blog articles."
        onAddClick={() => navigate("/admin/blogs/create")}
        addButtonLabel="New Blog Post"
        searchPlaceholder="Search blogs..."
        filters={[]}
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={blogs}
        pagination={pagination}
        renderHeader={renderHeader}
        renderRow={renderRow}
        renderGridCard={renderGridCard}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={bulkActions}
        emptyStateMessage={
          <div className="flex flex-col items-center justify-center">
            <FiBookOpen size={36} className="mx-auto mb-3 text-slate-300" />
            No blog posts yet.
          </div>
        }
      />

      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Blog Post?</h3>
            <p className="text-sm text-slate-500 mb-6">This action is permanent and cannot be undone.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 border border-slate-200 dark:border-slate-800 text-slate-600 font-semibold rounded-xl text-sm cursor-pointer">Cancel</button>
              <button onClick={() => { deleteMutation.mutate(confirmDelete); setConfirmDelete(null); }} className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Blogs;
