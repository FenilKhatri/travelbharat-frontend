import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';
import Checkbox from "../../../../../components/ui/Checkbox";

const ModerationGrid = ({ 
  currentList, 
  activeTab, 
  selectedIds, 
  toggleSelection, 
  handleApprove, 
  handleReject 
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {currentList.map(blog => (
        <div 
          key={blog._id} 
          className={`bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col p-5 relative ${selectedIds.includes(blog._id) ? 'ring-2 ring-[#E85D04]' : ''}`}
        >
          <div className="flex justify-between items-start mb-3">
            <Checkbox checked={selectedIds.includes(blog._id)} onChange={() => toggleSelection(blog._id)} />
            <div className="text-xs text-slate-500 font-semibold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {new Date(
                activeTab === 'new' ? blog.createdAt : 
                activeTab === 'edit' ? blog.editRequest.requestedAt : 
                blog.deleteRequest.requestedAt
              ).toLocaleDateString()}
            </div>
          </div>
          
          <div className="flex-1 mb-4">
            <h4 className="font-black text-base text-slate-900 dark:text-white mb-1 line-clamp-2">{activeTab === 'edit' ? blog.editRequest.title : blog.title}</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">By {blog.author?.name}</p>
            {activeTab === 'delete' && <p className="text-red-500 text-xs mt-2 bg-red-50 dark:bg-red-500/10 p-2 rounded-lg font-medium border border-red-100 dark:border-red-900/30">Reason: {blog.deleteRequest.reason}</p>}
          </div>

          <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800/50">
            <Link to={`/blogs/${blog.slug}`} className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition cursor-pointer" title="View Current">
              <FiEye size={14}/>
            </Link>
            <div className="flex gap-2">
              <button onClick={() => handleApprove(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition cursor-pointer" title="Approve">
                <FiCheck size={14}/>
              </button>
              <button onClick={() => handleReject(blog._id, activeTab)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition cursor-pointer" title="Reject">
                <FiX size={14}/>
              </button>
            </div>
          </div>
        </div>
      ))}
      {currentList.length === 0 && (
        <div className="col-span-full py-12 text-center text-slate-500">No requests in this category.</div>
      )}
    </div>
  );
};

export default ModerationGrid;
