import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiCheck, FiX, FiEye, FiGrid, FiList } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import http from '../../../lib/axios';
import AdminPageLayout from '../components/ui/AdminPageLayout';

const AdminModeration = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedIds, setSelectedIds] = useState([]);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminModerationViewMode") || "list");
  const queryClient = useQueryClient();

  useEffect(() => {
    localStorage.setItem("adminModerationViewMode", viewMode);
  }, [viewMode]);

  const { data, isLoading } = useQuery({
    queryKey: ['moderationRequests'],
    queryFn: () => http.get('/blogs/admin/moderation/requests')
  });

  const getListByType = (cacheData, tab) => {
    if (!cacheData?.data) return [];
    if (tab === 'new') return cacheData.data.newBlogs || [];
    if (tab === 'edit') return cacheData.data.editRequests || [];
    return cacheData.data.deleteRequests || [];
  };

  const optimisticUpdate = async (id, tab, isReject = false) => {
    await queryClient.cancelQueries({ queryKey: ['moderationRequests'] });
    const previousData = queryClient.getQueryData(['moderationRequests']);
    
    queryClient.setQueryData(['moderationRequests'], (old) => {
      if (!old?.data) return old;
      const newData = { ...old, data: { ...old.data } };
      if (tab === 'new') {
        newData.data.newBlogs = newData.data.newBlogs.filter(b => b._id !== id);
      } else if (tab === 'edit') {
        newData.data.editRequests = newData.data.editRequests.filter(b => b._id !== id);
      } else {
        newData.data.deleteRequests = newData.data.deleteRequests.filter(b => b._id !== id);
      }
      return newData;
    });
    
    return { previousData };
  };

  const handleMutationError = (err, newTodo, context) => {
    queryClient.setQueryData(['moderationRequests'], context.previousData);
    toast.error(err?.response?.data?.message || "Action failed");
  };

  const handleMutationSuccess = (data) => {
    toast.success(data?.data?.message || "Action successful");
  };

  const handleMutationSettled = () => {
    queryClient.invalidateQueries(['moderationRequests']);
    setSelectedIds([]); // Clear selection after action
  };

  const mutationOpts = (tab, isReject = false) => ({
    onMutate: async (variables) => {
      const id = typeof variables === 'object' ? variables.id : variables;
      return optimisticUpdate(id, tab, isReject);
    },
    onError: handleMutationError,
    onSuccess: handleMutationSuccess,
    onSettled: handleMutationSettled
  });

  const approveBlog = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/approve`), ...mutationOpts('new') });
  const rejectBlog = useMutation({ mutationFn: ({ id, reason }) => http.put(`/blogs/admin/moderation/${id}/reject`, { reason }), ...mutationOpts('new', true) });
  
  const approveEdit = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/approve-edit`), ...mutationOpts('edit') });
  const rejectEdit = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/reject-edit`), ...mutationOpts('edit', true) });
  
  const approveDelete = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/approve-delete`), ...mutationOpts('delete') });
  const rejectDelete = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/reject-delete`), ...mutationOpts('delete', true) });

  if (isLoading) {
    return <div className="p-8 text-center text-[#E85D04]">Loading moderation data...</div>;
  }

  const { newBlogs = [], editRequests = [], deleteRequests = [] } = data?.data || {};
  const currentList = activeTab === 'new' ? newBlogs : activeTab === 'edit' ? editRequests : deleteRequests;

  const handleReject = (id, type) => {
    const reason = prompt("Enter rejection reason:");
    if (reason === null) return;
    if (type === 'new') rejectBlog.mutate({ id, reason });
    if (type === 'edit') rejectEdit.mutate(id);
    if (type === 'delete') rejectDelete.mutate(id);
  };

  const handleApprove = (id, type) => {
    if (window.confirm("Approve this request?")) {
      if (type === 'new') approveBlog.mutate(id);
      if (type === 'edit') approveEdit.mutate(id);
      if (type === 'delete') approveDelete.mutate(id);
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedIds.length === currentList.length && currentList.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentList.map(item => item._id));
    }
  };

  const handleBulkApprove = () => {
    if (!window.confirm(`Approve ${selectedIds.length} requests?`)) return;
    selectedIds.forEach(id => {
      if (activeTab === 'new') approveBlog.mutate(id);
      if (activeTab === 'edit') approveEdit.mutate(id);
      if (activeTab === 'delete') approveDelete.mutate(id);
    });
  };

  const handleBulkReject = () => {
    const reason = prompt(`Enter rejection reason for ${selectedIds.length} requests:`);
    if (reason === null) return;
    selectedIds.forEach(id => {
      if (activeTab === 'new') rejectBlog.mutate({ id, reason });
      if (activeTab === 'edit') rejectEdit.mutate(id);
      if (activeTab === 'delete') rejectDelete.mutate(id);
    });
  };

  return (
    <AdminPageLayout
      title="Content Moderation"
      subtitle="Review and moderate user submitted blogs and edit requests."
      actions={
        <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiGrid size={16} /></button>
        </div>
      }
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex gap-4">
          {[
            { id: 'new', label: 'New Blogs', count: newBlogs.length },
            { id: 'edit', label: 'Edit Requests', count: editRequests.length },
            { id: 'delete', label: 'Delete Requests', count: deleteRequests.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedIds([]); }}
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'bg-[#E85D04] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
            >
              {tab.label}
              <span className="bg-black/20 px-2 py-0.5 rounded-md text-xs">{tab.count}</span>
            </button>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex gap-2 animate-fadeIn">
            <button onClick={handleBulkApprove} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm transition flex items-center gap-2 cursor-pointer">
              <FiCheck size={16} /> Approve Selected ({selectedIds.length})
            </button>
            <button onClick={handleBulkReject} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold text-sm transition flex items-center gap-2 cursor-pointer">
              <FiX size={16} /> Reject Selected ({selectedIds.length})
            </button>
          </div>
        )}
      </div>

      {viewMode === "list" && (
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-55/40 dark:bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-[#E85D04] focus:ring-[#E85D04]"
                    checked={currentList.length > 0 && selectedIds.length === currentList.length}
                    onChange={toggleAll}
                  />
                </th>
                <th className="p-4 font-bold">Blog Title</th>
                <th className="p-4 font-bold">Author</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm">
              {currentList.map(blog => (
                <tr key={blog._id} className={`transition-colors ${selectedIds.includes(blog._id) ? 'bg-[#E85D04]/5 dark:bg-[#E85D04]/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'}`}>
                  <td className="p-4 text-center">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-[#E85D04] focus:ring-[#E85D04]"
                      checked={selectedIds.includes(blog._id)}
                      onChange={() => toggleSelection(blog._id)}
                    />
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{activeTab === 'edit' ? blog.editRequest.title : blog.title}</p>
                    {activeTab === 'delete' && <p className="text-red-500 text-xs mt-1">Reason: {blog.deleteRequest.reason}</p>}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{blog.author?.name}</td>
                  <td className="p-4 text-slate-500 text-sm">
                    {new Date(
                      activeTab === 'new' ? blog.createdAt : 
                      activeTab === 'edit' ? blog.editRequest.requestedAt : 
                      blog.deleteRequest.requestedAt
                    ).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    <Link to={`/blogs/${blog.slug}`} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition cursor-pointer" title="View Current">
                      <FiEye size={14}/>
                    </Link>
                    <button onClick={() => handleApprove(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition cursor-pointer" title="Approve">
                      <FiCheck size={16}/>
                    </button>
                    <button onClick={() => handleReject(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition cursor-pointer" title="Reject">
                      <FiX size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentList.length === 0 && (
            <div className="p-8 text-center text-slate-500">No requests in this category.</div>
          )}
        </div>
      </div>
      )}

      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {currentList.map(blog => (
            <div 
              key={blog._id} 
              className={`bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col p-5 relative ${selectedIds.includes(blog._id) ? 'ring-2 ring-[#E85D04]' : ''}`}
            >
              <div className="flex justify-between items-start mb-3">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-[#E85D04] focus:ring-[#E85D04] cursor-pointer"
                  checked={selectedIds.includes(blog._id)}
                  onChange={() => toggleSelection(blog._id)}
                />
                <div className="text-xs text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {new Date(
                    activeTab === 'new' ? blog.createdAt : 
                    activeTab === 'edit' ? blog.editRequest.requestedAt : 
                    blog.deleteRequest.requestedAt
                  ).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex-1 mb-4">
                <h4 className="font-black text-base text-slate-900 dark:text-white mb-1 line-clamp-2">{activeTab === 'edit' ? blog.editRequest.title : blog.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">By {blog.author?.name}</p>
                {activeTab === 'delete' && <p className="text-red-500 text-xs mt-2 bg-red-50 dark:bg-red-500/10 p-2 rounded-lg font-medium border border-red-100 dark:border-red-900/30">Reason: {blog.deleteRequest.reason}</p>}
              </div>

              <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
                <Link to={`/blogs/${blog.slug}`} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition cursor-pointer" title="View Current">
                  <FiEye size={14}/>
                </Link>
                <div className="flex gap-2">
                  <button onClick={() => handleApprove(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition cursor-pointer" title="Approve">
                    <FiCheck size={14}/>
                  </button>
                  <button onClick={() => handleReject(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition cursor-pointer" title="Reject">
                    <FiX size={14}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
          {currentList.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-500">No requests in this category.</div>
          )}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminModeration;
