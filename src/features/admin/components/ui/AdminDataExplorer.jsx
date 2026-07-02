import { useState, useEffect } from "react";
import { FiPlus, FiGrid, FiList } from "react-icons/fi";
import AdminPageLayout from "./AdminPageLayout";
import AdminPagination from "./AdminPagination";
import SearchAndFilter from "../../../../components/ui/SearchAndFilter";

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
  emptyStateMessage = "No items found."
}) => {
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminViewMode") || "list");

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
                    {renderHeader()}
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
                    items.map(item => renderRow(item))
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
                items.map(item => renderGridCard(item))
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
    </AdminPageLayout>
  );
};

export default AdminDataExplorer;
