import React from 'react';
import { FiMail, FiTrash2, FiXCircle } from 'react-icons/fi';
import { MdVerified } from 'react-icons/md';
import CustomDropdown from '../../../../../components/ui/CustomDropdown';

const UserRow = ({ userItem, onToggleActive, onRoleChange, onDeleteClick, onRowClick }) => {
  return (
    <tr 
      onClick={() => onRowClick(userItem)}
      className="hover:bg-slate-50/50 dark:hover:bg-slate-850/5 transition cursor-pointer"
    >
      <td className="py-4 px-6">
        <div className="flex items-center gap-3.5">
          {userItem.profileImage ? (
            <img
              src={userItem.profileImage?.url || userItem.profileImage}
              alt={userItem.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800 shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 text-[#E85D04] font-black flex items-center justify-center shrink-0">
              {userItem.name ? userItem.name[0].toUpperCase() : "?"}
            </div>
          )}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200">{userItem.name}</h4>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <FiMail size={12} />
              {userItem.email}
            </span>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 w-36" onClick={(e) => e.stopPropagation()}>
        <CustomDropdown
          value={userItem.role}
          onChange={(val) => onRoleChange(e, userItem, val)}
          options={[
            { value: "user", label: "User" },
            { value: "admin", label: "Admin" },
          ]}
        />
      </td>
      <td className="py-4 px-6 font-semibold capitalize text-xs text-slate-400">
        {userItem.authProvider || "Local email"}
      </td>
      <td className="py-4 px-6">
        <button
          onClick={(e) => onToggleActive(e, userItem)}
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${userItem.isActive
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20"
            : "bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
            }`}
        >
          {userItem.isActive ? (
            <>
              <MdVerified size={12} />
              <span>Active</span>
            </>
          ) : (
            <>
              <FiXCircle size={12} />
              <span>Suspended</span>
            </>
          )}
        </button>
      </td>
      <td className="py-4 px-6 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => onDeleteClick(e, userItem._id)}
            title="Remove user permanently"
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
