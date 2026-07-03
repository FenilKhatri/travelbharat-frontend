import { FiUser, FiTwitter, FiInstagram, FiLinkedin, FiFeather } from "react-icons/fi";

const BlogAuthorBox = ({ blog }) => {
  if (!blog || !blog.author) return null;
  
  return (
    <div className="mt-20 p-8 md:p-10 bg-slate-50 dark:bg-[#0A121F] rounded-3xl flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left shadow-xs border border-slate-200 dark:border-slate-800 font-sans">
      <div className="relative shrink-0">
        {blog.author.profileImage ? (
          <img src={blog.author.profileImage} alt={blog.author.name} className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover shadow-lg border-4 border-white dark:border-slate-800" />
        ) : (
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 border-4 border-white dark:border-slate-800 shadow-lg">
            <FiUser size={48} />
          </div>
        )}
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#E85D04] rounded-full flex items-center justify-center text-white border-4 border-white dark:border-[#0A121F]">
           <FiFeather size={18} />
        </div>
      </div>
      
      <div className="flex-1 flex flex-col items-center md:items-start">
        <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Written by</h3>
        <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4">
          {blog.author.name || "TravelBharat Editor"}
        </h4>
        
        <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed text-lg max-w-2xl">
          {blog.author.bio || "Passionate traveler and storyteller exploring the rich cultural heritage and breathtaking landscapes of India. Bringing you the best travel tips, guides, and hidden gems."}
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
          {blog.author.articleCount && (
             <span className="px-4 py-1.5 bg-white dark:bg-slate-800 rounded-full text-sm font-semibold text-slate-700 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-700">
               {blog.author.articleCount} Articles
             </span>
          )}
          
          <div className="flex items-center gap-3">
             {blog.author.socialLinks?.twitter && (
                <a href={blog.author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#1DA1F2] hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700">
                   <FiTwitter />
                </a>
             )}
             {blog.author.socialLinks?.instagram && (
                <a href={blog.author.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#E1306C] hover:bg-pink-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700">
                   <FiInstagram />
                </a>
             )}
             {blog.author.socialLinks?.linkedin && (
                <a href={blog.author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-[#0077B5] hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700">
                   <FiLinkedin />
                </a>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogAuthorBox;
