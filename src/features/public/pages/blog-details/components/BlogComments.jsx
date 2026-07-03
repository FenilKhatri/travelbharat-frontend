import { FiMessageSquare, FiUser, FiSend } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import Button from "../../../../../components/ui/Button";

const BlogComments = ({
  blog,
  comments,
  commentText,
  setCommentText,
  handlePostComment,
  commentMutation,
}) => {
  return (
    <div
      id="comments"
      className="mt-24 pt-16 border-t border-slate-200 dark:border-slate-800 font-sans"
    >
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white">
            <FiMessageSquare size={22} />
          </div>
          Responses{" "}
          <span className="text-[#E85D04] font-bold text-2xl">
            ({blog.commentCount || comments.length || 0})
          </span>
        </h3>
      </div>

      {/* Comment Input */}
      <div className="bg-slate-50 dark:bg-[#0A121F] p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 mb-12 shadow-xs transition-colors focus-within:border-[#E85D04]/50 focus-within:bg-white dark:focus-within:bg-[#0A121F]">
        <div className="flex gap-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-300 dark:border-slate-700">
            <FiUser size={18} />
          </div>
          <div className="flex-1">
            <textarea
              rows="3"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full bg-transparent border-none p-2 focus:outline-none focus:ring-0 text-slate-900 dark:text-white text-lg resize-none placeholder-slate-400"
            />
            <div className="flex justify-end mt-4">
              <Button
                onClick={handlePostComment}
                disabled={commentMutation.isPending || !commentText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#E85D04] text-white font-bold rounded-full hover:bg-[#D05203] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md shadow-[#E85D04]/20"
              >
                {commentMutation.isPending ? (
                  "Posting..."
                ) : (
                  <>
                    <span>Post</span>
                    <FiSend size={16} />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div key={comment._id} className="group flex gap-5">
            <div className="shrink-0">
              {comment.author?.profileImage ? (
                <img
                  src={comment.author.profileImage}
                  alt={comment.author.name}
                  className="w-12 h-12 rounded-full object-cover shadow-sm border border-slate-200 dark:border-slate-700"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 shadow-sm border border-slate-300 dark:border-slate-700 font-bold">
                  {comment.author?.name?.charAt(0) || "U"}
                </div>
              )}
            </div>

            <div className="flex-1 bg-white dark:bg-slate-900 p-6 rounded-3xl rounded-tl-none border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-shadow">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                <h5 className="font-bold text-slate-900 dark:text-white text-base">
                  {comment.author?.name || "Traveler"}
                </h5>
                <span className="text-sm font-medium text-slate-400">
                  {formatDistanceToNow(new Date(comment.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                {comment.text}
              </p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiMessageSquare size={32} className="text-slate-400" />
            </div>
            <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              No Responses Yet
            </h4>
            <p className="text-slate-500 dark:text-slate-400">
              Be the first to share your thoughts on this article!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogComments;
