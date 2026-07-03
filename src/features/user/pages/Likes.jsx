import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiHeart, FiStar, FiImage, FiTrash2 } from "react-icons/fi";
import PageLoader from "../../../components/ui/PageLoader";
import Checkbox from "../../../components/ui/Checkbox";
import { toast } from "react-toastify";
import http from "../../../lib/axios";

const Likes = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['userLikes'],
    queryFn: () => http.get("/likes")
  });
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);
  
  const likesData = data?.likes || data?.data?.likes || data?.data?.data?.likes || [];

  const toggleSelectAll = () => {
    if (selectedIds.length === likesData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(likesData.map(l => l._id));
    }
  };

  const toggleSelection = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleBulkUnlike = async () => {
    if (selectedIds.length === 0) return;
    
    if (!window.confirm(`Are you sure you want to remove ${selectedIds.length} items from your likes?`)) return;

    setIsProcessingBulk(true);
    
    const results = await Promise.allSettled(
      selectedIds.map(id => {
        const like = likesData.find(l => l._id === id);
        return http.post(`/likes/toggle`, { entityType: like.entityType, entityId: like.entityId._id });
      })
    );
    
    const failed = results.filter(r => r.status === 'rejected');
    if (failed.length > 0) {
      toast.error(`Failed to remove ${failed.length} items`);
    } else {
      toast.success(`Successfully removed ${selectedIds.length} items`);
    }
    
    setSelectedIds([]);
    setIsProcessingBulk(false);
    queryClient.invalidateQueries(['userLikes']);
    queryClient.invalidateQueries(['userProfile']);
  };

  const toggleMutation = useMutation({
    mutationFn: ({ entityType, entityId }) => http.post(`/likes/toggle`, { entityType, entityId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['userLikes']);
      queryClient.invalidateQueries(['userProfile']);
    },
    onError: () => toast.error("Failed to update like status")
  });

  const handleUnlike = (entityType, entityId) => {
    toggleMutation.mutate({ entityType, entityId });
  };

  const getLinkPrefix = (type) => {
      switch (type) {
          case 'state': return 'states';
          case 'city': return 'cities';
          case 'destination': return 'places';
          case 'blog': return 'blogs';
          case 'festival': return 'festivals';
          default: return '';
      }
  };

  const renderItems = (items) => {
    if (!items || items.length === 0) return null;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((like) => {
            const item = like.entityId;
            if (!item) return null;
            const linkPrefix = getLinkPrefix(like.entityType);
            return (
                <motion.div key={like._id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden flex flex-col group relative">
                <div className="absolute top-4 left-4 z-20">
                  <Checkbox 
                    checked={selectedIds.includes(like._id)} 
                    onChange={(e) => { e.stopPropagation(); toggleSelection(like._id); }} 
                  />
                </div>
                <Link to={`/${linkPrefix}/${item.slug}`} className="h-40 bg-slate-100 dark:bg-slate-800 relative block overflow-hidden">
                    {item.images?.thumbnail ? (
                    <img src={item.images.thumbnail} alt={item.name || item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400"><FiImage size={32} /></div>
                    )}
                    <button onClick={(e) => { e.preventDefault(); handleUnlike(like.entityType, item._id); }} className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-red-500 hover:scale-110 transition cursor-pointer">
                        <FiHeart className="fill-red-500" />
                    </button>
                    <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded capitalize">{like.entityType}</span>
                </Link>
                <div className="p-4 flex flex-col flex-1">
                    <Link to={`/${linkPrefix}/${item.slug}`}>
                    <h4 className="font-black text-base text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition line-clamp-1">{item.name || item.title}</h4>
                    </Link>
                    {item.stateId && <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">{item.stateId.name || ""}</p>}
                    
                    <div className="mt-auto pt-3 flex items-center justify-between">
                    {item.rating && (
                        <div className="flex items-center gap-1 text-[#E85D04] font-bold text-xs">
                            <FiStar size={12} className="fill-[#E85D04]" /> <span>{item.rating?.toFixed(1)}</span>
                        </div>
                    )}
                    </div>
                </div>
                </motion.div>
            )
          })}
        </div>
    );
  };

  return (
    <div className="max-w-[1600px] w-full mx-auto px-4 pt-30 pb-24 min-h-[80vh] relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <FiHeart className="text-red-500 fill-red-500" size={32} />
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Liked Content</h1>
        </div>
        {likesData.length > 0 && (
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer select-none">
            <Checkbox 
              checked={selectedIds.length === likesData.length && likesData.length > 0} 
              onChange={toggleSelectAll} 
            />
            Select All
          </label>
        )}
      </div>

      {isLoading ? (
        <PageLoader fullScreen={false} message="Loading likes..." size="md" />
      ) : likesData.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
          <FiHeart className="mx-auto text-slate-400 mb-4" size={48} />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Liked Content</h3>
          <p className="text-slate-500 mb-6">You haven't liked anything yet. Show some love to your favorite places!</p>
          <Link to="/places" className="px-6 py-3 bg-[#E85D04] text-white font-bold rounded-xl hover:bg-[#D05203] transition-colors">Explore India</Link>
        </div>
      ) : (
        renderItems(likesData)
      )}

      {/* Floating Action Bar */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
          <div className="bg-white dark:bg-[#0c1018] backdrop-blur-xl rounded-full shadow-2xl border border-slate-200 dark:border-slate-800 p-2 flex items-center gap-4">
            <span className="pl-4 font-bold text-slate-700 dark:text-slate-200 text-sm">
              {selectedIds.length} selected
            </span>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={handleBulkUnlike}
              disabled={isProcessingBulk}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-500/10 dark:hover:bg-red-500/20 font-bold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiTrash2 />
              <span>Unlike</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="pr-4 pl-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-bold text-sm cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Likes;