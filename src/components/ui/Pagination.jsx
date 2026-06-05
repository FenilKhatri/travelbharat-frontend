import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

/**
 * Reusable Pagination component.
 * @param {Object} pagination - Object containing { total, page, pages }
 * @param {Function} onPageChange - Function to call when page changes, passing the new page number.
 */
const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total } = pagination;

  return (
    <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800/40 bg-white dark:bg-[#0A121F]">
      <span className="text-xs font-semibold text-slate-400">
        Showing page {page} of {pages} ({total} total)
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition"
        >
          <FiChevronLeft size={14} />
          <span>Prev</span>
        </button>
        <button
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition"
        >
          <span>Next</span>
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
