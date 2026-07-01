import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import CustomDropdown from "../../../../components/ui/CustomDropdown";
import { useDebounce } from "../../../../hooks/useDebounce";

const SidebarFilter = ({
  searchPlaceholder = "Search...",
  searchLabel = "Search",
  filters = [],
  sortOptions = [],
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Local state for smooth typing before debouncing
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setSearchParams((prev) => {
      if (debouncedSearchTerm.trim()) {
        prev.set("search", debouncedSearchTerm.trim());
      } else {
        prev.delete("search");
      }
      prev.set("page", "1");
      return prev;
    });
  }, [debouncedSearchTerm, setSearchParams]);

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
      prev.set("page", "1");
      return prev;
    });
  };

  const clearAll = () => {
    setSearchTerm("");
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="space-y-5">
      {/* Search */}
      <div>
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">{searchLabel}</label>
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-[#E85D04] transition-colors"
          />
        </div>
      </div>

      {/* Dynamic Filters */}
      {filters.map((filter) => (
        <div key={filter.key}>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">{filter.label}</label>
          <CustomDropdown
            value={searchParams.get(filter.key) || ""}
            onChange={(val) => handleFilterChange(filter.key, val)}
            options={[{ value: "", label: "All" }, ...filter.options]}
            placeholder="All"
          />
        </div>
      ))}

      {/* Sort Options */}
      {sortOptions.length > 0 && (
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Sort By</label>
          <CustomDropdown
            value={searchParams.get("sort") || ""}
            onChange={(val) => handleFilterChange("sort", val)}
            options={[{ value: "", label: "Default" }, ...sortOptions]}
            placeholder="Default"
          />
        </div>
      )}

      {/* Clear Filters */}
      <button 
        onClick={clearAll}
        className="w-full py-2.5 mt-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-[#E85D04] dark:hover:text-[#E85D04] bg-slate-100 dark:bg-slate-800 hover:bg-[#E85D04]/10 rounded-xl transition-colors"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default SidebarFilter;
