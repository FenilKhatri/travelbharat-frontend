import { useSearchParams } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const AdminPagination = ({ isLoading, isError, pagination }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1");

  if (isLoading || isError || !pagination || pagination.pages <= 1) return null;

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", newPage.toString());
      return next;
    });
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800/40">
      <span className="text-xs font-semibold text-slate-400">
        Showing page {page} of {pagination.pages} ({pagination.total} total)
      </span>
      <div className="flex gap-2">
        <button
          disabled={page <= 1}
          onClick={() => handlePageChange(page - 1)}
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
        >
          <FiChevronLeft size={14} />
          <span>Prev</span>
        </button>
        <button
          disabled={page >= pagination.pages}
          onClick={() => handlePageChange(page + 1)}
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition cursor-pointer"
        >
          <span>Next</span>
          <FiChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
