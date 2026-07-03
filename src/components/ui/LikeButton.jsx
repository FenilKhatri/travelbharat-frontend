import React, { useState, useEffect, useRef } from 'react';
import { FiHeart } from 'react-icons/fi';
import http from '../../lib/axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from "framer-motion";

const LikeButton = ({ entityId, entityType, initialIsLiked = false, className = '', iconOnly = false }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const timeoutRef = useRef(null);

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const updateCaches = (likedState) => {
    queryClient.setQueriesData({
      predicate: (query) => {
        // Only target queries that are likely to contain lists or details of entities
        const key = query.queryKey[0];
        if (typeof key !== 'string') return false;
        return [
          'states', 'cities', 'places', 'stateBySlug', 'cityBySlug', 'placeDetails', 
          'festivalsByState', 'placesByState', 'placesByCity', 'hotelsByCity', 'restaurantsByCity', 
          'publicStates', 'publicCities', 'publicPlaces', 'trendingPlaces', 'featuredStates', 
          'allPlacesForPlanner', 'filterStates', 'allBlogs', 'popularBlogs', 'blog', 'userLikes'
        ].some(k => key.includes(k));
      }
    }, (oldData) => {
      if (!oldData) return oldData;
      
      const updateRecursively = (obj) => {
        if (Array.isArray(obj)) {
           // For userLikes cache: if unliking, remove the entire Like document from the array
           if (likedState === false) {
               obj = obj.filter(item => {
                   if (item && item.entityId && typeof item.entityId === 'object') {
                       return item.entityId._id !== entityId;
                   }
                   return true;
               });
           }

           return obj.map(item => {
               // Special case for UserLikes which is an array of Like documents with populated entityId
               if (item && item.entityId && typeof item.entityId === 'object' && item.entityId._id === entityId) {
                   return {
                       ...item,
                       entityId: {
                           ...item.entityId,
                           isLiked: likedState,
                           likeCount: likedState ? (item.entityId.likeCount || 0) + 1 : Math.max(0, (item.entityId.likeCount || 0) - 1),
                           likes: likedState ? (item.entityId.likes || 0) + 1 : Math.max(0, (item.entityId.likes || 0) - 1)
                       }
                   };
               }
               
               if (item && item._id === entityId) {
                   return { 
                       ...item, 
                       isLiked: likedState, 
                       likeCount: likedState ? (item.likeCount || 0) + 1 : Math.max(0, (item.likeCount || 0) - 1),
                       likes: likedState ? (item.likes || 0) + 1 : Math.max(0, (item.likes || 0) - 1)
                   };
               }
               return updateRecursively(item);
           });
        } else if (obj !== null && typeof obj === 'object') {
           // Skip circular references or DOM elements if any
           if (obj._id === entityId) {
               return { 
                   ...obj, 
                   isLiked: likedState, 
                   likeCount: likedState ? (obj.likeCount || 0) + 1 : Math.max(0, (obj.likeCount || 0) - 1),
                   likes: likedState ? (obj.likes || 0) + 1 : Math.max(0, (obj.likes || 0) - 1)
               };
           }
           const newObj = {};
           for (const key in obj) {
               newObj[key] = updateRecursively(obj[key]);
           }
           return newObj;
        }
        return obj;
      };

      return updateRecursively(oldData);
    });
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info("Please login to like this item.");
      navigate("/auth");
      return;
    }
    
    if (isProcessing) {
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const previousLiked = isLiked;
    const newLikedState = !isLiked;
    
    // Optimistic Update
    setIsLiked(newLikedState);
    setIsProcessing(true);
    updateCaches(newLikedState);

    // Call API
    http.post("/likes/toggle", { entityId, entityType })
      .then(res => {
        const serverLiked = res.data?.data?.isLiked;
        if (serverLiked !== undefined && serverLiked !== newLikedState) {
            setIsLiked(serverLiked);
            updateCaches(serverLiked);
        }
        
        toast.success(newLikedState ? "Liked successfully!" : "Removed from likes.");
        
        // Synchronize Liked Items page properly after success
        queryClient.invalidateQueries({ queryKey: ['userLikes'] });
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        queryClient.invalidateQueries({ queryKey: ['userDashboardStats'] });
      })
      .catch(err => {
        // Revert optimistic update on failure
        setIsLiked(previousLiked);
        updateCaches(previousLiked);
        toast.error(err.response?.data?.message || "Failed to update like status.");
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
        isLiked 
          ? 'text-rose-500' 
          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
      } ${className}`
    : `flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all duration-300 cursor-pointer ${
        isLiked 
          ? 'bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20' 
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      } ${className}`;

  return (
    <button
      onClick={handleLike}
      disabled={isProcessing}
      className={buttonStyles}
      aria-label={isLiked ? "Unlike" : "Like"}
    >
      <motion.div animate={isLiked ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
        <FiHeart className={isLiked ? 'fill-rose-500 text-rose-500' : ''} size={iconOnly ? 20 : 16} />
      </motion.div>
      {!iconOnly && <span>{isLiked ? 'Liked' : 'Like'}</span>}
    </button>
  );
};

export default LikeButton;
