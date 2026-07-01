import React, { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import http from '../../lib/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';

const LikeButton = ({ entityId, entityType, initialCount = 0, className = "" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const isLikingRef = React.useRef(false);

  useEffect(() => {
    setCount(initialCount);
  }, [initialCount]);

  useEffect(() => {
    if (user && entityId) {
      http.get(`/likes/check/${entityType}/${entityId}`)
        .then(res => setIsLiked(res.data?.data?.isLiked || false))
        .catch(err => console.error(err));
    } else {
      setIsLiked(false);
    }
  }, [user, entityId, entityType]);

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info("Please login to like this item.");
      navigate("/auth");
      return;
    }
    
    if (isLikingRef.current) return;
    isLikingRef.current = true;

    // Optimistic update
    const previousLiked = isLiked;
    setIsLiked(!isLiked);
    setCount(prev => !isLiked ? prev + 1 : prev - 1);
    setLoading(true);

    try {
      const res = await http.post("/likes/toggle", { entityId, entityType });
      const currentlyLiked = res.data?.data?.isLiked;
      const newCount = res.data?.data?.likeCount;
      
      setIsLiked(currentlyLiked);
      if (newCount !== undefined) {
         setCount(newCount);
      }
      
      // Invalidate queries that might depend on liked items
      queryClient.invalidateQueries(['userLikes']);
      queryClient.invalidateQueries(['userProfile']);
      queryClient.invalidateQueries(['userDashboardStats']);
      queryClient.invalidateQueries(['userNotifications']);
    } catch (err) {
      // Revert optimistic update
      setIsLiked(previousLiked);
      setCount(prev => previousLiked ? prev + 1 : prev - 1);
      toast.error(err.response?.data?.message || "Failed to like item.");
    } finally {
      setLoading(false);
      isLikingRef.current = false;
    }
  };

  return (
    <button 
      onClick={handleLike} 
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 cursor-pointer disabled:cursor-not-allowed ${
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
