import React from 'react';
import { FiCompass, FiUser, FiCalendar, FiEye, FiTrash2 } from 'react-icons/fi';

const TripRow = ({ trip, onRowClick, onPreviewClick, onDeleteClick }) => {
  return (
    <tr 
      onClick={() => onRowClick(trip)}
      className="hover:bg-slate-50/50 dark:hover:bg-slate-900 transition cursor-pointer"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-4">
          {trip.coverImage ? (
            <img
              src={trip.coverImage?.url || trip.coverImage}
              alt={trip.name}
              className="w-16 h-10 object-cover rounded-lg bg-slate-100 shrink-0"
            />
          ) : (
            <div className="w-16 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-450 shrink-0">
              <FiCompass size={20} />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-bold text-slate-850 dark:text-slate-250 truncate max-w-[200px]">
              {trip.name}
            </h4>
            <span className="text-xs text-slate-400 capitalize">{trip.tripType} type</span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6">
        {trip.userId ? (
          <div className="flex items-center gap-2">
            {trip.userId.profileImage ? (
              <img
                src={trip.userId.profileImage?.url || trip.userId.profileImage}
                alt={trip.userId.name}
                className="w-7 h-7 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-[10px] font-bold flex items-center justify-center shrink-0">
                {trip.userId.name ? trip.userId.name[0].toUpperCase() : <FiUser />}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold truncate max-w-[120px]">{trip.userId.name}</p>
              <p className="text-[10px] text-slate-400 truncate max-w-[120px]">{trip.userId.email}</p>
            </div>
          </div>
        ) : (
          <span className="text-xs text-slate-450">Unknown Guest</span>
        )}
      </td>
      <td className="py-4 px-6 font-semibold">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <FiCalendar size={14} />
          <span>{trip.totalDays ?? 1} Days</span>
        </div>
      </td>
      <td className="py-4 px-6 font-semibold">
        <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs">
          {trip.places?.length || 0} destinations
        </span>
      </td>
      <td className="py-4 px-6 font-semibold text-xs capitalize text-slate-400">
        {trip.budget || "moderate"}
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          {trip.isPublic && (
            <button
              onClick={(e) => onPreviewClick(e, trip._id)}
              title="Preview public itinerary"
              className="p-2 text-slate-400 hover:text-slate-850 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition cursor-pointer"
            >
              <FiEye size={16} />
            </button>
          )}
          <button
            onClick={(e) => onDeleteClick(e, trip._id)}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default TripRow;
