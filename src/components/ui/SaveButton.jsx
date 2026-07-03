import React, { useState, useEffect, useRef } from 'react';
import { FiBookmark } from 'react-icons/fi';
import http from '../../lib/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "framer-motion";

const SaveButton = ({ entityId, entityType, initialIsSaved = false, className = "", iconOnly = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isSaved, setIsSaved] = useState(initialIsSaved);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    setIsSaved(initialIsSaved);
    if (user && entityId && entityType) {
       http.get(`/saved-items/check/${entityType}/${entityId}`)
         .then(res => {
             if (res.data?.data?.isSaved !== undefined) {
                 setIsSaved(res.data.data.isSaved);
             }
         })
         .catch(err => console.error("Error checking saved status:", err));
    }
  }, [initialIsSaved, user, entityId, entityType]);

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info("Please login to save this item.");
      navigate("/auth");
      return;
    }
    
    if (isProcessing) {
      return;
    }

    if (isSaved) {
       setShowConfirmModal(true);
       return;
    }

    executeToggle(false);
  };

  const executeToggle = (currentlySaved) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    const previousSaved = currentlySaved;
    const newSavedState = !currentlySaved;
    
    // Optimistic Update
    setIsSaved(newSavedState);
    setIsProcessing(true);
    setShowConfirmModal(false);

    // Call API
    http.post("/saved-items/toggle", { itemId: entityId, itemType: entityType })
      .then(res => {
        const serverSaved = res.data?.data?.isSaved;
        if (serverSaved !== undefined) {
            setIsSaved(serverSaved);
            toast.success(serverSaved ? "Item saved successfully!" : "Item removed from saved list.");
        } else {
            toast.success(newSavedState ? "Item saved successfully!" : "Item removed from saved list.");
        }
        
        // Synchronize Saved Items page
        queryClient.invalidateQueries({ queryKey: ['savedItems'] });
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['userDashboardStats'] });
      })
      .catch(err => {
        // Revert optimistic update on failure
        setIsSaved(previousSaved);
        toast.error(err.response?.data?.message || "Failed to update save status.");
      })
      .finally(() => {
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(false);
        }, 500);
      });
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const buttonStyles = iconOnly
    ? `flex items-center justify-center transition-all duration-300 cursor-pointer ${
        isSaved 
          ? 'text-blue-500' 
          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
      } ${className}`
    : `flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 cursor-pointer ${
        isSaved 
          ? 'bg-blue-50 text-blue-500 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      } ${className}`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <button
        onClick={handleSave}
        disabled={isProcessing}
        className={buttonStyles}
        aria-label={isSaved ? "Unsave" : "Save"}
      >
        <motion.div animate={isSaved ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
          <FiBookmark className={isSaved ? 'fill-blue-500 text-blue-500' : ''} size={iconOnly ? 20 : 16} />
        </motion.div>
        {!iconOnly && <span>{isSaved ? 'Saved' : 'Save'}</span>}
      </button>

      {/* Confirmation Popover */}
      {showConfirmModal && (
        <>
          {/* Invisible backdrop to catch clicks outside */}
          <div 
            className="fixed inset-0 z-9998"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirmModal(false); }}
          />
          <div 
             className="absolute bottom-full right-1/2 translate-x-1/2 mb-4 lg:mb-0 lg:bottom-1/2 lg:right-full lg:mr-4 lg:translate-x-0 lg:translate-y-1/2 z-9999 w-[260px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 text-center flex flex-col items-center animate-in fade-in zoom-in-95 duration-200"
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
          >
             <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 mx-auto flex items-center justify-center mb-3">
                <FiBookmark className="text-[#E85D04]" size={20} />
             </div>
             <h3 className="text-base font-black text-slate-900 dark:text-white mb-2">Remove Save?</h3>
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
               Are you sure you want to remove this item from your saved list?
             </p>
             <div className="flex gap-2 w-full">
               <button 
                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowConfirmModal(false); }}
                 className="flex-1 px-3 py-2.5 rounded-lg font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-sm"
               >
                 Cancel
               </button>
               <button 
                 onClick={(e) => { e.preventDefault(); e.stopPropagation(); executeToggle(true); }}
                 className="flex-1 px-3 py-2.5 rounded-lg font-bold bg-[#E85D04] text-white hover:bg-[#D05203] transition-colors text-sm"
               >
                 OK
               </button>
             </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SaveButton;
