import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { FaSlidersH, FaUndo } from "react-icons/fa";

/**
 * Reusable premium Search & Filter component.
 * Syncs seamlessly with React Router's search parameters.
 */
const SearchAndFilter = ({
  searchPlaceholder = "Search...",
  filters = [],
  sortOptions = [],
  showDateRange = false,
  className = "",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // Local state for search input to allow smooth typing before debounce
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Debounced search logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchParams((prev) => {
        if (searchTerm.trim()) {
          prev.set("search", searchTerm.trim());
        } else {
          prev.delete("search");
        }
        prev.set("page", "1"); // Reset to page 1 on search
        return prev;
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm, setSearchParams]);

  // Sync search input value if URL parameter changes externally
  const urlSearch = searchParams.get("search") || "";
  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  const handleFilterChange = (key, value) => {
    setSearchParams((prev) => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.set("page", "1"); // Reset page
      return prev;
    });
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSearchParams(new URLSearchParams());
  };

  const activeFiltersCount = Array.from(searchParams.keys()).filter(
    (k) => k !== "page" && k !== "limit"
  ).length;

  return (
    <div className={`w-full space-y-4 ${className}`}>
      
      {/* Search Input and Collapsible Trigger */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#E85D04] transition duration-200 text-sm shadow-xs"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          {/* Filter toggle button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center justify-center gap-2 px-5 py-3 border rounded-xl text-sm font-semibold transition cursor-pointer ${
              isOpen || activeFiltersCount > 0
                ? "bg-[#E85D04] border-[#E85D04] text-white shadow-md shadow-[#E85D04]/20"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <FaSlidersH size={16} />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="flex items-center justify-center w-5 h-5 text-xs bg-white dark:bg-slate-950 text-[#E85D04] font-black rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Reset button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={handleClearAll}
              title="Reset Filters"
              className="flex items-center justify-center p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <FaUndo size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter panel (Desktop grid / Mobile drawer or dropdown) */}
      {isOpen && (
        <div className="p-6 bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fadeIn">
          
          {/* Dynamic Filters */}
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {filter.label}
              </label>
              <select
                value={searchParams.get(filter.key) || ""}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#E85D04]"
              >
                <option value="">All</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Sorting Dropdown */}
          {sortOptions.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={searchParams.get("sort") || ""}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#E85D04]"
              >
                <option value="">Default</option>
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Date range picker support */}
          {showDateRange && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  From Date
                </label>
                <input
                  type="date"
                  value={searchParams.get("startDate") || ""}
                  onChange={(e) => handleFilterChange("startDate", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#E85D04]"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  To Date
                </label>
                <input
                  type="date"
                  value={searchParams.get("endDate") || ""}
                  onChange={(e) => handleFilterChange("endDate", e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-[#E85D04]"
                />
              </div>
            </>
          )}

        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;
