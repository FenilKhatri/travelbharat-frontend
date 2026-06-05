import { useState, useRef, useEffect, useCallback } from "react";
import { FiChevronDown, FiSearch, FiCheck } from "react-icons/fi";

const CustomDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  disabled = false,
  error = "",
  searchable = false,
  multiple = false,
  className = "",
  id = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const selectedOption = multiple 
    ? options.filter((o) => Array.isArray(value) && value.includes(o.value))
    : options.find((o) => o.value === value);

  const filteredOptions = searchable
    ? options.filter((o) =>
        o.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIndex];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [focusedIndex]);

  const handleSelect = useCallback(
    (val) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValue = currentValues.includes(val)
          ? currentValues.filter(v => v !== val)
          : [...currentValues, val];
        onChange(newValue);
      } else {
        onChange(val);
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
      }
    },
    [onChange, multiple, value]
  );

  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
          handleSelect(filteredOptions[focusedIndex].value);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        setFocusedIndex(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) =>
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Tab":
        setIsOpen(false);
        setSearchTerm("");
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative ${isOpen ? 'z-50' : ''} ${className}`}
      id={id}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setFocusedIndex(-1);
          }
        }}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`
          w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm text-left
          border transition-all duration-200 cursor-pointer
          ${
            error
              ? "border-red-400 focus:ring-red-300/40"
              : isOpen
              ? "border-[#E85D04]/60 ring-2 ring-[#E85D04]/20"
              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
          }
          ${
            disabled
              ? "opacity-50 cursor-not-allowed bg-slate-100 dark:bg-slate-900/50"
              : "bg-white/50 dark:bg-slate-900/50"
          }
          focus:outline-none
        `}
      >
        <span
          className={`truncate pr-2 ${
            (multiple ? selectedOption.length > 0 : selectedOption)
              ? "text-slate-900 dark:text-slate-100 font-medium"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {multiple 
            ? (selectedOption.length > 0 ? selectedOption.map(o => o.label).join(", ") : placeholder)
            : (selectedOption ? selectedOption.label : placeholder)}
        </span>
        <FiChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Error */}
      {error && (
        <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>
      )}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute z-50 mt-1.5 w-full bg-white dark:bg-[#0D1526] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200"
          role="listbox"
        >
          {/* Search */}
          {searchable && (
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <div className="relative">
                <FiSearch
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setFocusedIndex(-1);
                  }}
                  className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#E85D04]/40"
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <ul
            ref={listRef}
            className="max-h-52 overflow-y-auto py-1 custom-scrollbar"
            role="listbox"
          >
            {filteredOptions.length === 0 ? (
              <li className="px-4 py-3 text-sm text-slate-400 dark:text-slate-500 text-center">
                No options found
              </li>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = multiple 
                  ? Array.isArray(value) && value.includes(option.value)
                  : option.value === value;
                const isFocused = index === focusedIndex;
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={`
                      flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer transition-colors duration-100
                      ${
                        isSelected
                          ? "bg-[#E85D04]/10 text-[#E85D04] font-semibold"
                          : isFocused
                          ? "bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }
                    `}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && (
                      <FiCheck size={16} className="text-[#E85D04] shrink-0 ml-2" />
                    )}
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
