import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { FiHeart, FiStar, FiImage } from "react-icons/fi";
import PageLoader from "../../../components/ui/PageLoader";
import { toast } from "react-toastify";
import http from "../../../lib/axios";

const Likes = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['userLikes'],
    queryFn: () => http.get("/likes")
  });
  
  const likesData = data?.likes || data?.data?.likes || data?.data?.data?.likes || [];

  const toggleMutation = useMutation({
    mutationFn: ({ entityType, entityId }) => http.post(`/likes/toggle`, { entityType, entityId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['userLikes']);
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
    <div className="max-w-[1600px] w-full mx-auto px-4 pt-30 pb-24 min-h-[80vh]">
      <div className="flex items-center gap-3 mb-10">
        <FiHeart className="text-red-500 fill-red-500" size={32} />
        <h1 className="text-4xl font-black text-slate-900 dark:text-white">Liked Content</h1>
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
    </div>
  );
};

export default Likes;