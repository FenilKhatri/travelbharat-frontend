import React from 'react';
import { FiCompass, FiUser, FiCalendar, FiMapPin, FiEye, FiTrash2 } from 'react-icons/fi';

const TripGridCard = ({ trip, onRowClick, onPreviewClick, onDeleteClick }) => {
  return (
    <div 
      onClick={() => onRowClick(trip)}
      className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer"
    >
      <div className="h-40 bg-slate-100 dark:bg-slate-800 relative">
        {trip.coverImage ? (
          <img src={trip.coverImage?.url || trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <FiCompass size={32} className="mb-2" />
            <span className="text-xs font-semibold uppercase tracking-wider">{trip.tripType}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#0A121F]/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-2 shadow-sm">
          {trip.userId?.profileImage ? (
            <img src={trip.userId.profileImage?.url || trip.userId.profileImage} alt={trip.userId.name} className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-[8px] font-bold flex items-center justify-center">
              {trip.userId?.name ? trip.userId.name[0].toUpperCase() : <FiUser />}
            </div>
          )}
          <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 truncate max-w-[80px]">
            {trip.userId?.name || "Unknown"}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <h4 className="font-black text-base text-slate-900 dark:text-white mb-2 group-hover:text-[#E85D04] transition line-clamp-1">{trip.name}</h4>
        
        <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-4">
          <div className="flex items-center gap-1.5"><FiCalendar size={14} />{trip.totalDays ?? 1} Days</div>
          <div className="flex items-center gap-1.5"><FiMapPin size={14} />{trip.places?.length || 0} Places</div>
        </div>

        <div className="mt-auto flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800/50">
          <span className="text-xs font-bold text-slate-400 capitalize">{trip.budget || "moderate"}</span>
          <div className="flex items-center gap-1">
            {trip.isPublic && (
              <button onClick={(e) => onPreviewClick(e, trip._id)} className="p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"><FiEye size={14} /></button>
            )}
            <button onClick={(e) => onDeleteClick(e, trip._id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripGridCard;
