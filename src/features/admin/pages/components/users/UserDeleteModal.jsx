import React from 'react';
import { MdSecurity } from 'react-icons/md';

const UserDeleteModal = ({ confirmDelete, setConfirmDelete, deleteMutation }) => {
  if (!confirmDelete) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center gap-3.5 text-red-500 mb-4">
          <MdSecurity size={36} />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Account?</h3>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          Are you absolutely sure? This action will permanently remove this user account, and all associated tourist reviews and custom saved itineraries.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate(confirmDelete)}
            className="px-5 py-2 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl text-sm transition"
          >
            Delete permanently
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
