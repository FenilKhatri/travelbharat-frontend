import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';

const ModerationTable = ({ 
  currentList, 
  activeTab, 
  selectedIds, 
  toggleSelection, 
  toggleAll, 
  handleApprove, 
  handleReject 
}) => {
  return (
    <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-55/40 dark:bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-slate-300 text-[#E85D04] focus:ring-[#E85D04]"
                  checked={currentList.length > 0 && selectedIds.length === currentList.length}
                  onChange={toggleAll}
                />
              </th>
              <th className="p-4 font-bold">Blog Title</th>
              <th className="p-4 font-bold">Author</th>
              <th className="p-4 font-bold">Date</th>
              <th className="p-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm">
            {currentList.map(blog => (
              <tr key={blog._id} className={`transition-colors ${selectedIds.includes(blog._id) ? 'bg-[#E85D04]/5 dark:bg-[#E85D04]/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/20'}`}>
                <td className="p-4 text-center">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-[#E85D04] focus:ring-[#E85D04]"
                    checked={selectedIds.includes(blog._id)}
                    onChange={() => toggleSelection(blog._id)}
                  />
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{activeTab === 'edit' ? blog.editRequest.title : blog.title}</p>
                  {activeTab === 'delete' && <p className="text-red-500 text-xs mt-1">Reason: {blog.deleteRequest.reason}</p>}
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 font-medium">{blog.author?.name}</td>
                <td className="p-4 text-slate-500 text-sm">
                  {new Date(
                    activeTab === 'new' ? blog.createdAt : 
                    activeTab === 'edit' ? blog.editRequest.requestedAt : 
                    blog.deleteRequest.requestedAt
                  ).toLocaleDateString()}
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <Link to={`/blogs/${blog.slug}`} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition cursor-pointer" title="View Current">
                    <FiEye size={14}/>
                  </Link>
                  <button onClick={() => handleApprove(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition cursor-pointer" title="Approve">
                    <FiCheck size={16}/>
                  </button>
                  <button onClick={() => handleReject(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition cursor-pointer" title="Reject">
                    <FiX size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {currentList.length === 0 && (
          <div className="p-8 text-center text-slate-500">No requests in this category.</div>
        )}
      </div>
    </div>
  );
};

export default ModerationTable;
