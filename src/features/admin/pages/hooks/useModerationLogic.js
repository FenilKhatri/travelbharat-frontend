import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import http from "../../../../lib/axios";

export const useModerationLogic = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [selectedIds, setSelectedIds] = useState([]);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['moderationRequests'],
    queryFn: () => http.get('/blogs/admin/moderation/requests')
  });

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
    setSelectedIds([]);
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

  return {
    activeTab,
    setActiveTab,
    selectedIds,
    setSelectedIds,
    isLoading,
    newBlogs,
    editRequests,
    deleteRequests,
    currentList,
    handleReject,
    handleApprove,
    toggleSelection,
    toggleAll,
    handleBulkApprove,
    handleBulkReject
  };
};
