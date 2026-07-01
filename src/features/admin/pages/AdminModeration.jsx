import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiGrid, FiList } from 'react-icons/fi';
import AdminPageLayout from '../components/ui/AdminPageLayout';
import { useModerationLogic } from './hooks/useModerationLogic';
import ModerationTable from './components/moderation/ModerationTable';
import ModerationGrid from './components/moderation/ModerationGrid';

const AdminModeration = () => {
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminModerationViewMode") || "list");

  useEffect(() => {
    localStorage.setItem("adminModerationViewMode", viewMode);
  }, [viewMode]);

  const {
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
  } = useModerationLogic();

  if (isLoading) {
    return <div className="p-8 text-center text-[#E85D04]">Loading moderation data...</div>;
  }

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
        <ModerationTable 
          currentList={currentList}
          activeTab={activeTab}
          selectedIds={selectedIds}
          toggleSelection={toggleSelection}
          toggleAll={toggleAll}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      )}

      {viewMode === "grid" && (
        <ModerationGrid 
          currentList={currentList}
          activeTab={activeTab}
          selectedIds={selectedIds}
          toggleSelection={toggleSelection}
          handleApprove={handleApprove}
          handleReject={handleReject}
        />
      )}
    </AdminPageLayout>
  );
};

export default AdminModeration;
