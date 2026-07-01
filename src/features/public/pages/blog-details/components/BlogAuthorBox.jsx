import { FiUser } from "react-icons/fi";

const BlogAuthorBox = ({ blog }) => {
  return (
    <div className="mt-16 p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left shadow-lg">
      {blog.author?.profileImage ? (
        <img src={blog.author.profileImage} alt={blog.author.name} className="w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white dark:border-slate-800 shrink-0" />
      ) : (
        <div className="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border-4 border-white dark:border-slate-800">
          <FiUser size={40} />
        </div>
      )}
      <div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {blog.author?.name || "TravelBharat Editor"}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
          {blog.author?.bio || "Passionate traveler and storyteller exploring the rich cultural heritage and breathtaking landscapes of India. Bringing you the best travel tips, guides, and hidden gems."}
        </p>
      </div>
    </div>
  );
};

export default BlogAuthorBox;
