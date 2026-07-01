import React from 'react';

const TripDeleteModal = ({ confirmDelete, setConfirmDelete, deleteMutation }) => {
  if (!confirmDelete) return null;

  return (
    <div className="fixed inset-0 bg-slate-955/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-850 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scaleIn">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Delete Itinerary?</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Are you sure you want to remove this user itinerary from TravelBharat? The traveler will lose access to this saved plan.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setConfirmDelete(null)}
            className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-305 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteMutation.mutate(confirmDelete)}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition cursor-pointer"
          >
            Delete Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripDeleteModal;
