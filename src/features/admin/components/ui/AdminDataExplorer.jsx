import { useState, useEffect } from "react";
import { FiPlus, FiGrid, FiList } from "react-icons/fi";
import AdminPageLayout from "./AdminPageLayout";
import AdminPagination from "./AdminPagination";
import SearchAndFilter from "../../../../components/ui/SearchAndFilter";
import Checkbox from "../../../../components/ui/Checkbox";

const AdminDataExplorer = ({
  title,
  subtitle,
  onAddClick,
  addButtonLabel = "Add New",
  searchPlaceholder = "Search...",
  filters = [],
  isLoading,
  isError,
  error,
  items = [],
  pagination,
  renderHeader,
  renderRow,
  renderGridCard,
  emptyStateMessage = "No items found.",
  selectedIds = [],
  onSelectionChange,
  bulkActions = [],
}) => {
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminViewMode") || "list");
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  const isAllSelected = items.length > 0 && items.every(item => selectedIds.includes(item._id));
  
  const toggleSelectAll = (e) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      const newIds = new Set([...selectedIds, ...items.map(i => i._id)]);
      onSelectionChange(Array.from(newIds));
    } else {
      const visibleIds = items.map(i => i._id);
      onSelectionChange(selectedIds.filter(id => !visibleIds.includes(id)));
    }
  };

  const toggleSelection = (id) => {
    if (!onSelectionChange) return;
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  useEffect(() => {
    localStorage.setItem("adminViewMode", viewMode);
  }, [viewMode]);

  return (
    <AdminPageLayout
      title={title}
      subtitle={subtitle}
      actions={
        <>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('list')} 
              className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              title="List View"
            >
              <FiList size={16} />
            </button>
            <button 
              onClick={() => setViewMode('grid')} 
              className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              title="Grid View"
            >
              <FiGrid size={16} />
            </button>
          </div>
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm shadow-xs transition duration-200 cursor-pointer shrink-0"
            >
              <FiPlus size={16} />
              <span>{addButtonLabel}</span>
            </button>
          )}
        </>
      }
    >
      {/* Toolbar */}
      <SearchAndFilter
        searchPlaceholder={searchPlaceholder}
        filters={filters}
      />

      {/* List / Grid View Content */}
      <div className="bg-transparent">
        {viewMode === "list" ? (
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                    {renderHeader({ isAllSelected, toggleSelectAll })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm text-slate-600 dark:text-slate-300">
                  {isLoading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="py-4 px-6" colSpan="100%">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-200 dark:bg-slate-800 rounded-lg" />
                            <div className="space-y-2">
                              <div className="w-24 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                              <div className="w-36 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : isError ? (
                    <tr>
                      <td colSpan="100%" className="text-center py-10 text-red-500 font-bold">
                        Error loading items: {error?.message}
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="100%" className="text-center py-12 text-slate-400 font-semibold">
                        {emptyStateMessage}
                      </td>
                    </tr>
                  ) : (
                    items.map(item => renderRow(item, { isSelected: selectedIds.includes(item._id), toggleSelection }))
                  )}
                </tbody>
              </table>
            </div>
            {!isLoading && !isError && pagination && pagination.total > 0 && (
              <AdminPagination pagination={pagination} />
            )}
          </div>
        ) : (
          /* Grid View */
          <>
            {/* Grid Select All Bar */}
            {!isLoading && !isError && items.length > 0 && onSelectionChange && (
              <div className="flex items-center justify-between mb-4 px-2">
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer group">
                  <Checkbox 
                    checked={isAllSelected} 
                    onChange={toggleSelectAll} 
                    className="group-hover:ring-2 ring-[#E85D04]/30"
                  />
                  <span>Select All Visible</span>
                </label>
                {selectedIds.length > 0 && (
                  <span className="text-xs font-semibold text-[#E85D04]">
                    {selectedIds.length} items selected
                  </span>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {isLoading ? (
                [...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-4 animate-pulse h-64" />
                ))
              ) : isError ? (
                <div className="col-span-full text-center py-10 text-red-500 font-bold">
                  Error loading items: {error?.message}
                </div>
              ) : items.length === 0 ? (
                <div className="col-span-full text-center py-12 text-slate-400 font-semibold">
                  {emptyStateMessage}
                </div>
              ) : (
                items.map(item => renderGridCard(item, { isSelected: selectedIds.includes(item._id), toggleSelection }))
              )}
            </div>
            {!isLoading && !isError && pagination && pagination.total > 0 && (
              <div className="mt-6 bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm">
                <AdminPagination pagination={pagination} />
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Bulk Action Bar */}
      {selectedIds.length > 0 && bulkActions.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 border border-slate-700 dark:border-slate-200">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-700 dark:border-slate-200">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E85D04] text-white text-xs font-bold">
                {selectedIds.length}
              </span>
              <span className="font-bold whitespace-nowrap">items selected</span>
            </div>
            <div className="flex items-center gap-3">
              {bulkActions.map((action, i) => {
                const isDanger = action.variant === 'danger';
                return (
                  <button
                    key={i}
                    disabled={isProcessingBulk}
                    onClick={async () => {
                      if (action.requireConfirm !== false) {
                        if (!window.confirm(`Are you sure you want to ${action.label.toLowerCase()} ${selectedIds.length} items?`)) {
                          return;
                        }
                      }
                      setIsProcessingBulk(true);
                      try {
                        await action.onClick(selectedIds, () => onSelectionChange([]));
                      } finally {
                        setIsProcessingBulk(false);
                      }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer ${
                      isDanger
                        ? 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white dark:bg-red-500/20 dark:hover:bg-red-500'
                        : 'bg-white/10 hover:bg-white/20 dark:bg-slate-900/10 dark:hover:bg-slate-900/20'
                    } ${isProcessingBulk ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {action.icon && action.icon}
                    <span>{isProcessingBulk ? 'Processing...' : action.label}</span>
                  </button>
                );
              })}
              <button 
                onClick={() => onSelectionChange([])}
                disabled={isProcessingBulk}
                className="ml-2 text-sm text-slate-400 hover:text-white dark:text-slate-500 dark:hover:text-slate-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AdminDataExplorer;
