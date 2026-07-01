import React, { useState, useEffect, useRef } from 'react';
import { FiHeart } from 'react-icons/fi';
import http from '../../lib/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "framer-motion";

const LikeButton = ({ entityId, entityType, initialCount = 0, className = "" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (user && entityId) {
      http.get(`/likes/check/${entityType}/${entityId}`)
        .then(res => setIsLiked(res.data?.data?.isLiked || false))
        .catch(err => console.error("Failed to fetch initial like status", err));
    } else {
      setIsLiked(false);
    }
  }, [user, entityId, entityType]);

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info("Please login to like this item.");
      navigate("/auth");
      return;
    }
    
    // Prevent spam clicking while API is processing
    if (isProcessing) {
      toast.warning("Please wait a moment...", { toastId: "like-spam-warning", autoClose: 1000 });
      return;
    }

    // Clear any pending timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Optimistic Update
    const previousLiked = isLiked;
    const newLikedState = !isLiked;
    
    setIsLiked(newLikedState);
    setCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
    setIsProcessing(true);

    // Call API
    http.post("/likes/toggle", { entityId, entityType })
      .then(res => {
        const serverLiked = res.data?.data?.isLiked;
        const serverCount = res.data?.data?.likeCount;
        
        setIsLiked(serverLiked);
        if (serverCount !== undefined) {
          setCount(serverCount);
        }
        
        // Background invalidations
        queryClient.invalidateQueries({ queryKey: ['userLikes'] });
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['userDashboardStats'] });
      })
      .catch(err => {
        // Revert optimistic update on failure
        setIsLiked(previousLiked);
        setCount(prev => previousLiked ? prev + 1 : Math.max(0, prev - 1));
        toast.error(err.response?.data?.message || "Failed to update like status.");
      })
      .finally(() => {
        // Add a small artificial delay before allowing next click to prevent rapid spam
        timeoutRef.current = setTimeout(() => {
          setIsProcessing(false);
        }, 500);
      });
  };

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <button 
      onClick={handleLike} 
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer ${
        isLiked 
          ? 'bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100' 
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
      } ${className}`}
    >
      <motion.div animate={isLiked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
        <FiHeart className={isLiked ? 'fill-rose-500 text-rose-500' : ''} />
      </motion.div>
      <span>{count > 0 ? count : 'Like'}</span>
    </button>
  );
};

export default LikeButton;
