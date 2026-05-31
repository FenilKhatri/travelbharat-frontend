import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import http from '../../../lib/axios';

const AdminModeration = () => {
  const [activeTab, setActiveTab] = useState('new');
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['moderationRequests'],
    queryFn: () => http.get('/blogs/admin/moderation/requests')
  });

  const mutationOpts = {
    onSuccess: (data) => {
      toast.success(data?.data?.message || "Action successful");
      queryClient.invalidateQueries(['moderationRequests']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Action failed");
    }
  };

  const approveBlog = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/approve`), ...mutationOpts });
  const rejectBlog = useMutation({ mutationFn: ({ id, reason }) => http.put(`/blogs/admin/moderation/${id}/reject`, { reason }), ...mutationOpts });
  
  const approveEdit = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/approve-edit`), ...mutationOpts });
  const rejectEdit = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/reject-edit`), ...mutationOpts });
  
  const approveDelete = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/approve-delete`), ...mutationOpts });
  const rejectDelete = useMutation({ mutationFn: (id) => http.put(`/blogs/admin/moderation/${id}/reject-delete`), ...mutationOpts });

  if (isLoading) {
    return <div className="p-8 text-center text-[#E85D04]">Loading moderation data...</div>;
  }

  const { newBlogs = [], editRequests = [], deleteRequests = [] } = data?.data || {};

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

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-8">Content Moderation</h1>

      <div className="flex gap-4 mb-8">
        {[
          { id: 'new', label: 'New Blogs', count: newBlogs.length },
          { id: 'edit', label: 'Edit Requests', count: editRequests.length },
          { id: 'delete', label: 'Delete Requests', count: deleteRequests.length }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors flex items-center gap-2 ${activeTab === tab.id ? 'bg-[#E85D04] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
          >
            {tab.label}
            <span className="bg-black/20 px-2 py-0.5 rounded-md text-xs">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Blog Title</th>
              <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Author</th>
              <th className="p-4 font-bold text-slate-700 dark:text-slate-300">Date</th>
              <th className="p-4 font-bold text-slate-700 dark:text-slate-300 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(activeTab === 'new' ? newBlogs : activeTab === 'edit' ? editRequests : deleteRequests).map(blog => (
              <tr key={blog._id} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
                  <Link to={`/blogs/${blog.slug}`} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition" title="View Current">
                    <FiEye size={14}/>
                  </Link>
                  <button onClick={() => handleApprove(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition" title="Approve">
                    <FiCheck size={16}/>
                  </button>
                  <button onClick={() => handleReject(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition" title="Reject">
                    <FiX size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(activeTab === 'new' ? newBlogs : activeTab === 'edit' ? editRequests : deleteRequests).length === 0 && (
          <div className="p-8 text-center text-slate-500">No requests in this category.</div>
        )}
      </div>
    </div>
  );
};

export default AdminModeration;
