import { FiMessageSquare, FiUser } from "react-icons/fi";

const BlogComments = ({ blog, comments, commentText, setCommentText, handlePostComment, commentMutation }) => {
  return (
    <div id="comments" className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-3">
        <FiMessageSquare className="text-[#E85D04]" />
        Comments ({blog.commentCount || comments.length || 0})
      </h3>

      <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm mb-10">
        <h4 className="font-bold text-slate-900 dark:text-white mb-6">Leave a Reply</h4>
        <textarea
          rows="4"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Share your thoughts..."
          className="w-full bg-slate-50 dark:bg-[#050B14] border border-slate-200 dark:border-slate-800 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#E85D04] text-slate-900 dark:text-white mb-4 resize-none"
        />
        <button
          onClick={handlePostComment}
          disabled={commentMutation.isPending}
          className="px-8 py-3 bg-[#E85D04] text-white font-bold rounded-xl hover:bg-[#D05203] transition-colors disabled:opacity-50 cursor-pointer"
        >
          {commentMutation.isPending ? "Posting..." : "Post Comment"}
        </button>
      </div>

      <div className="space-y-6">
        {comments.map(comment => (
          <div key={comment._id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              {comment.author?.profileImage ? (
                <img src={comment.author.profileImage} alt={comment.author.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                  <FiUser size={20} />
                </div>
              )}
              <div>
                <h5 className="font-bold text-slate-900 dark:text-white text-sm">{comment.author?.name || 'User'}</h5>
                <span className="text-xs text-slate-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{comment.text}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-slate-400">No comments yet. Be the first!</p>}
      </div>
    </div>
  );
};

export default BlogComments;
