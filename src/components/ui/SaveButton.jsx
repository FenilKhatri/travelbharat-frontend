import React, { useState, useEffect } from 'react';
import { FiHeart } from 'react-icons/fi';
import { useAuth } from '../../../context/AuthContext';
import http from '../../../lib/axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SaveButton = ({ itemId, itemType, initialCount = 0, className = "" }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && itemId) {
      http.get(`/saved-items/check/${itemType}/${itemId}`)
        .then(res => setIsSaved(res.data?.data?.isSaved || false))
        .catch(err => console.error(err));
    } else {
      setIsSaved(false);
    }
  }, [user, itemId, itemType]);

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info("Please login to save this item.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await http.post("/saved-items/toggle", { itemId, itemType });
      const currentlySaved = res.data?.data?.isSaved;
      setIsSaved(currentlySaved);
      setCount(prev => currentlySaved ? prev + 1 : prev - 1);
      toast.success(currentlySaved ? "Saved to your list!" : "Removed from your list.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save item.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleSave} 
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all shadow-sm active:scale-95 ${
        isSaved 
          ? 'bg-rose-50 text-rose-500 border border-rose-200 hover:bg-rose-100 dark:bg-rose-500/10 dark:border-rose-500/30' 
          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900 dark:bg-[#0A121F] dark:border-white/10 dark:text-white/70 dark:hover:text-white'
      } ${className}`}
    >
      <motion.div animate={isSaved ? { scale: [1, 1.4, 1] } : {}} transition={{ duration: 0.3 }}>
        <FiHeart className={isSaved ? 'fill-rose-500 text-rose-500' : ''} />
      </motion.div>
      <span>{count > 0 ? count : 'Save'}</span>
    </button>
  );
};

export default SaveButton;
