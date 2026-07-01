import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch, FiX } from "react-icons/fi";
import { FaSlidersH, FaUndo } from "react-icons/fa";
import CustomDropdown from "./CustomDropdown";

const SearchAndFilter = ({
  searchPlaceholder = "Search...",
  filters = [],
  sortOptions = [],
  showDateRange = false,
  className = "",
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

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
    <div className={`relative z-40 w-full space-y-4 ${className}`}>
      
      {/* Search Input and Collapsible Trigger */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 bg-glass-bg backdrop-blur-md border border-glass-border rounded-xl text-primary placeholder:text-muted focus:outline-hidden focus:ring-2 focus:ring-accent transition duration-200 text-sm shadow-xs"
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
                ? "bg-accent border-accent text-white shadow-md shadow-accent/20"
                : "bg-glass-bg backdrop-blur-md border border-glass-border text-secondary hover:bg-surface-elevated"
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
              className="flex items-center justify-center p-3 border border-glass-border bg-glass-bg backdrop-blur-md text-muted hover:text-primary rounded-xl hover:bg-surface-elevated transition cursor-pointer"
            >
              <FaUndo size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Filter panel (Desktop grid / Mobile drawer or dropdown) */}
      {isOpen && (
        <div className="p-6 bg-glass-bg backdrop-blur-2xl border border-glass-border rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fadeIn">
          
          {/* Dynamic Filters */}
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {filter.label}
              </label>
              <CustomDropdown
                value={searchParams.get(filter.key) || ""}
                onChange={(val) => handleFilterChange(filter.key, val)}
                options={[
                  { value: "", label: "All" },
                  ...filter.options
                ]}
                placeholder="All"
              />
            </div>
          ))}

          {/* Sorting Dropdown */}
          {sortOptions.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Sort By
              </label>
              <CustomDropdown
                value={searchParams.get("sort") || ""}
                onChange={(val) => handleFilterChange("sort", val)}
                options={[
                  { value: "", label: "Default" },
                  ...sortOptions
                ]}
                placeholder="Default"
              />
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
