import React from 'react';
import { FiMail, FiTrash2, FiXCircle } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import CustomDropdown from '../../../../../components/ui/CustomDropdown';

const UserGridCard = ({ userItem, onToggleActive, onRoleChange, onDeleteClick, onRowClick }) => {
  return (
    <div 
      onClick={() => onRowClick(userItem)}
      className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer p-5 relative"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 shrink-0">
          {userItem.profileImage ? (
            <img src={userItem.profileImage?.url || userItem.profileImage} alt={userItem.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-[#E85D04]/10 text-[#E85D04] font-black text-xl flex items-center justify-center">
              {userItem.name ? userItem.name[0].toUpperCase() : "?"}
            </div>
          )}
        </div>
        <button
          onClick={(e) => onToggleActive(e, userItem)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${userItem.isActive
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20"
            : "bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
            }`}
        >
          {userItem.isActive ? <><MdVerified size={10} />Active</> : <><FiXCircle size={10} />Suspended</>}
        </button>
      </div>

      <h4 className="font-black text-base text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition line-clamp-1">{userItem.name}</h4>
      <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5 truncate">
        <FiMail size={12} className="shrink-0" />
        <span className="truncate">{userItem.email}</span>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</span>
          <div className="w-28" onClick={(e) => e.stopPropagation()}>
            <CustomDropdown
              value={userItem.role}
              onChange={(val) => onRoleChange({stopPropagation:()=>{}}, userItem, val)}
              options={[
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
              ]}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400 capitalize">{userItem.authProvider || "Local email"}</span>
          <button onClick={(e) => onDeleteClick(e, userItem._id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
        </div>
      </div>
    </div>
  );
};

export default UserGridCard;
