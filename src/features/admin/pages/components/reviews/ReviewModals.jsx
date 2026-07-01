import React from 'react';
import { FiX } from 'react-icons/fi';

export const ReviewResponseModal = ({
  responseModal,
  setResponseModal,
  adminReplyText,
  setAdminReplyText,
  handleRespondSubmit,
  respondMutation
}) => {
  if (!responseModal) return null;

  return (
    <div className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scaleIn">
        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/40 mb-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Response</h3>
          <button onClick={() => setResponseModal(null)} className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleRespondSubmit} className="space-y-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl text-xs text-slate-500">
            <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">
              Review by {responseModal.userId?.name || "Guest"}:
            </p>
            <p className="italic">"{responseModal.comment}"</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Your Response</label>
            <textarea
              rows={4}
              required
              value={adminReplyText}
              onChange={(e) => setAdminReplyText(e.target.value)}
              placeholder="Thank you for sharing your feedback with the community! We appreciate..."
              className="w-full px-4 py-2.5 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={() => setResponseModal(null)}
              className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-305 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={respondMutation.isLoading}
              className="px-5 py-2 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition"
            >
              Submit Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ReviewDeleteModal = ({ confirmDelete, setConfirmDelete, deleteMutation }) => {
  if (!confirmDelete) return null;

  return (
    <div className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-850 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Review?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Deleting this review will remove it permanently and update the destination's average rating scores. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-305 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate(confirmDelete)}
            className="px-5 py-2 bg-red-500 hover:bg-red-655 text-white font-bold rounded-xl text-sm transition"
          >
            Delete Review
          </button>
        </div>
      </div>
    </div>
  );
};
