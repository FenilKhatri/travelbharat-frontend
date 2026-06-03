import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiStar, FiUser } from "react-icons/fi";
import PageLoader from "../../../components/ui/PageLoader";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { reviewService } from "../../../services/reviewService";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/ui/Button";

const ReviewSection = ({ placeId }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ['placeReviews', placeId],
    queryFn: () => reviewService.getPlaceReviews(placeId, { limit: 20 }),
    enabled: !!placeId
  });

  const reviews = data?.data?.reviews || [];

  const createReviewMutation = useMutation({
    mutationFn: (payload) => reviewService.createReview(payload),
    onSuccess: () => {
      toast.success("Review submitted for approval!");
      setComment("");
      setRating(5);
      queryClient.invalidateQueries(['placeReviews', placeId]);
      queryClient.invalidateQueries(['placeDetails']);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Review comment cannot be empty");
      return;
    }
    createReviewMutation.mutate({
      placeId,
      rating,
      comment
    });
  };

  return (
    <div>
      <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Traveler Reviews</h3>
      
      {/* Review Form (Only for logged-in users) */}
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl mb-8 border border-slate-100 dark:border-slate-800">
        {user ? (
          <form onSubmit={handleSubmit}>
            <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Write a Review</h4>
            
            <div className="mb-4 flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Your Rating:</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <FiStar 
                      size={24} 
                      className={star <= rating ? "fill-[#D4A72C] text-[#D4A72C]" : "text-slate-300 dark:text-slate-600"} 
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <textarea
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience..."
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-[#E85D04] text-slate-900 dark:text-white mb-4"
            />
            
            <Button 
              type="submit" 
              disabled={createReviewMutation.isLoading}
              className="w-full md:w-auto"
            >
              {createReviewMutation.isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        ) : (
          <div className="text-center py-6">
            <FiUser size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-600 dark:text-slate-400 mb-4">Please log in to write a review for this destination.</p>
            <Link to="/auth">
              <Button>Login to Review</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <PageLoader fullScreen={false} message="Loading reviews..." size="sm" />
        ) : reviews.length === 0 ? (
          <p className="text-center text-slate-500 py-6">No reviews yet. Be the first to review this place!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white dark:bg-[#060D18] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.userId?.profileImage ? (
                    <img src={review.userId.profileImage} alt={review.userId.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                      <FiUser size={18} />
                    </div>
                  )}
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white text-sm">{review.userId?.name || "Traveler"}</h5>
                    <p className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FiStar 
                      key={i} 
                      size={14} 
                      className={i < review.rating ? "fill-[#D4A72C] text-[#D4A72C]" : "text-slate-200 dark:text-slate-700"} 
                    />
                  ))}
                </div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {review.comment}
              </p>
              
              {review.adminResponse && (
                <div className="mt-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border-l-4 border-[#E85D04]">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">Response from TravelBharat:</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{review.adminResponse}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
