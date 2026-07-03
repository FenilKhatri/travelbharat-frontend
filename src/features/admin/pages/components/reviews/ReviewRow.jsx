import React from 'react';
import { FiClock, FiMapPin, FiStar, FiUser, FiCheck, FiX, FiMessageSquare, FiTrash2 } from 'react-icons/fi';
import Checkbox from "../../../../../components/ui/Checkbox";

const ReviewRow = ({ review, onApprove, onReject, onRespondClick, onDeleteClick, onRowClick, isSelected, toggleSelection }) => {
  return (
    <tr 
      onClick={() => onRowClick(review)}
      className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b border-slate-100 dark:border-slate-800/30 cursor-pointer"
    >
      <td className="py-4 px-6" onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected || false} onChange={() => toggleSelection(review._id)} />
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2.5">
          {review.userId?.profileImage ? (
            <img
              src={review.userId.profileImage?.url || review.userId.profileImage}
              alt={review.userId.name}
              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-850"
            />
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
      </td>
      <td className="py-4 px-6 font-semibold">
        <div className="flex items-center gap-1.5 text-xs">
          <FiMapPin className="text-[#E85D04] shrink-0" size={14} />
          <span className="truncate max-w-[150px]">{review.placeId?.name || "Deleted Destination"}</span>
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="max-w-[280px]">
          {review.title && <h5 className="font-extrabold text-xs text-slate-800 dark:text-slate-200 mb-0.5 truncate">{review.title}</h5>}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {review.comment}
          </p>
          {review.adminResponse && (
            <div className="mt-1.5 p-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850/50 rounded-lg text-[10px] italic text-[#E85D04] dark:text-[#FFA034]">
              <span className="font-bold uppercase tracking-wider not-italic mr-1 text-[9px] bg-[#E85D04]/15 px-1.5 py-0.5 rounded-sm">Reply:</span>
              {review.adminResponse}
            </div>
          )}
        </div>
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-0.5 text-amber-500">
          {[...Array(5)].map((_, i) => (
            <FiStar
              key={i}
              size={12}
              className={i < review.rating ? "fill-amber-500" : "text-slate-200 dark:text-slate-800"}
            />
          ))}
        </div>
      </td>
      <td className="py-4 px-6">
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          review.isApproved
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450"
            : "bg-amber-500/10 text-amber-600 dark:text-amber-500"
        }`}>
          {review.isApproved ? "Approved" : "Pending Approval"}
        </span>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          {!review.isApproved ? (
            <button
              onClick={(e) => { e.stopPropagation(); onApprove(review._id); }}
              title="Approve & Publish"
              className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 rounded-xl transition cursor-pointer"
            >
              <FiCheck size={16} />
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onReject(review._id); }}
              title="Reject & Hide"
              className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition cursor-pointer"
            >
              <FiX size={16} />
            </button>
          )}
          <button
            onClick={(e) => onRespondClick(e, review)}
            title="Write administrative response"
            className="p-2 text-slate-400 hover:text-[#E85D04] hover:bg-orange-50 dark:hover:bg-[#E85D04]/10 rounded-xl transition cursor-pointer"
          >
            <FiMessageSquare size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteClick(review._id); }}
            title="Delete permanently"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ReviewRow;
