import React from 'react';
import { FiShare2, FiMessageCircle } from "react-icons/fi";
import LikeButton from "../../../../../components/ui/LikeButton";
import SaveButton from "../../../../../components/ui/SaveButton";
import Button from "../../../../../components/ui/Button";

const StickyActionBar = ({ blog, handleShare }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:left-8 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0 z-40">
      <div className="flex lg:flex-col items-center gap-4 p-3 bg-white/90 dark:bg-[#0c1018]/80 backdrop-blur-xl rounded-full lg:rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10">
        
        <LikeButton 
          entityId={blog._id} 
          entityType="blog" 
          initialIsLiked={blog.isLiked} 
          className="w-12! h-12! p-0! flex items-center justify-center rounded-full bg-transparent! hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-300" 
          iconOnly
        />
        
        <div className="w-px h-6 lg:w-8 lg:h-px bg-slate-200 dark:bg-white/10" />
        
        <Button 
          variant="ghost"
          onClick={() => {
             const element = document.getElementById("comments");
             if (element) {
                const y = element.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top: y, behavior: 'smooth' });
             }
          }}
          className="w-12! h-12! p-0! rounded-full flex items-center justify-center text-slate-700 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-[#E85D04] dark:hover:text-[#E85D04] bg-transparent!"
          aria-label="Jump to comments"
        >
          <FiMessageCircle size={20} />
        </Button>

        <div className="w-px h-6 lg:w-8 lg:h-px bg-slate-200 dark:bg-white/10" />

        <div className="w-12 h-12 flex items-center justify-center">
          <SaveButton 
             entityId={blog._id} 
             entityType="blog" 
             initialIsSaved={blog.isSaved}
             className="w-12! h-12! p-0! flex items-center justify-center rounded-full bg-transparent! hover:bg-slate-100! dark:hover:bg-white/5! text-slate-700! dark:text-slate-300!"
             iconOnly
          />
        </div>

        <div className="w-px h-6 lg:w-8 lg:h-px bg-slate-200 dark:bg-white/10" />

        <Button 
          variant="ghost"
          onClick={() => handleShare('native')} 
          className="w-12! h-12! p-0! rounded-full flex items-center justify-center text-slate-700! dark:text-slate-400! hover:bg-slate-100! dark:hover:bg-white/5! hover:text-[#E85D04]! dark:hover:text-[#E85D04]! bg-transparent!"
          aria-label="Share article"
        >
          <FiShare2 size={20} />
        </Button>

      </div>
    </div>
  );
};

export default StickyActionBar;
