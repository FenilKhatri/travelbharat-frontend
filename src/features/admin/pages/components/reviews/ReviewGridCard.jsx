import React from 'react';
import { FiClock, FiMapPin, FiStar, FiUser, FiCheck, FiX, FiMessageSquare, FiTrash2 } from 'react-icons/fi';

const ReviewGridCard = ({ review, onApprove, onReject, onRespondClick, onDeleteClick, onRowClick }) => {
  return (
    <div 
      onClick={() => onRowClick(review)}
      className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer p-5 relative"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          {review.userId?.profileImage ? (
            <img src={review.userId.profileImage?.url || review.userId.profileImage} alt={review.userId.name} className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-850" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#E85D04]/10 text-[#E85D04] text-[10px] font-bold flex items-center justify-center shrink-0">
              {review.userId?.name ? review.userId.name[0].toUpperCase() : <FiUser />}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-xs font-bold truncate max-w-[120px]">{review.userId?.name || "Guest Traveler"}</p>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <FiClock size={10} />
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
          review.isApproved ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450" : "bg-amber-500/10 text-amber-600 dark:text-amber-500"
        }`}>
          {review.isApproved ? "Approved" : "Pending"}
        </span>
      </div>

      <div className="flex items-center gap-1.5 text-xs font-semibold mb-3">
        <FiMapPin className="text-[#E85D04] shrink-0" size={14} />
        <span className="truncate max-w-[150px]">{review.placeId?.name || "Deleted Destination"}</span>
      </div>

      <div className="flex items-center gap-0.5 text-amber-500 mb-3">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} size={12} className={i < review.rating ? "fill-amber-500" : "text-slate-200 dark:text-slate-800"} />
        ))}
      </div>

      <div className="flex-1 mb-4">
        {review.title && <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mb-0.5 truncate">{review.title}</h5>}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
          {review.comment}
        </p>
        {review.adminResponse && (
          <div className="mt-2 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850/50 rounded-lg text-[10px] italic text-[#E85D04] dark:text-[#FFA034] line-clamp-2">
            <span className="font-bold uppercase tracking-wider not-italic mr-1 text-[9px] bg-[#E85D04]/15 px-1.5 py-0.5 rounded-sm">Reply:</span>
            {review.adminResponse}
          </div>
        )}
      </div>

      <div className="mt-auto pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
        <div className="flex gap-1">
          {!review.isApproved ? (
            <button onClick={(e) => { e.stopPropagation(); onApprove(review._id); }} className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-lg transition cursor-pointer"><FiCheck size={14} /></button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onReject(review._id); }} className="p-1.5 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-lg transition cursor-pointer"><FiX size={14} /></button>
          )}
          <button onClick={(e) => onRespondClick(e, review)} className="p-1.5 text-slate-400 hover:text-[#E85D04] hover:bg-orange-50 dark:hover:bg-[#E85D04]/10 rounded-lg transition cursor-pointer"><FiMessageSquare size={14} /></button>
        </div>
        <button onClick={(e) => { e.stopPropagation(); onDeleteClick(review._id); }} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition cursor-pointer"><FiTrash2 size={14} /></button>
      </div>
    </div>
  );
};

export default ReviewGridCard;
