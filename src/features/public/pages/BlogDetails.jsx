import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiArrowLeft, FiCalendar, FiUser, FiLoader, FiShare2, FiHeart, FiMessageSquare, FiBookmark, FiEye, FiMapPin, FiInfo, FiImage, FiHelpCircle } from "react-icons/fi";
import { blogService } from "../../../services/blogService";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const BlogDetails = () => {
  const { slug } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeHeading, setActiveHeading] = useState("");
  const [commentText, setCommentText] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => blogService.getBlogBySlug(slug)
  });

  const blog = data?.data?.data?.blog || data?.data?.blog;

  const { data: savedData } = useQuery({
    queryKey: ['savedBlogs'],
    queryFn: () => blogService.getSavedBlogs(),
    enabled: !!user
  });

  useEffect(() => {
    if (blog && savedData) {
      const savedList = savedData?.data?.data?.blogs || savedData?.data?.blogs || savedData?.blogs || [];
      setIsBookmarked(savedList.some(b => b._id === blog._id));
    }
  }, [blog, savedData]);

  const { data: commentsData } = useQuery({
    queryKey: ['blogComments', blog?._id],
    queryFn: () => blogService.getComments(blog._id),
    enabled: !!blog?._id
  });
  const comments = commentsData?.data?.data?.comments || commentsData?.data?.comments || [];

  const likeMutation = useMutation({
    mutationFn: () => blogService.toggleLike(blog._id, 'Blog'),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog', slug]);
    },
    onError: () => toast.error("Failed to like. Please log in.")
  });

  const saveMutation = useMutation({
    mutationFn: () => blogService.toggleSaveBlog(blog._id),
    onSuccess: (response) => {
      const isSaved = response?.data?.isSaved;
      if (isSaved !== undefined) setIsBookmarked(isSaved);
      else setIsBookmarked(!isBookmarked);
      
      queryClient.invalidateQueries(['savedBlogs']);
      toast.success(isSaved ? "Saved article!" : "Removed from saved articles");
    },
    onError: () => toast.error("Failed to save. Please log in.")
  });

  const commentMutation = useMutation({
    mutationFn: (text) => blogService.addComment(blog._id, text),
    onSuccess: () => {
      setCommentText("");
      toast.success("Comment added!");
      queryClient.invalidateQueries(['blogComments', blog._id]);
      queryClient.invalidateQueries(['blog', slug]);
    },
    onError: () => toast.error("Failed to add comment. Please log in.")
  });

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    commentMutation.mutate(commentText);
  };

  // Generate TOC dynamically
  const headings = [
    { id: "content", title: "Article Content" }
  ];
  if (blog?.images?.gallery?.length > 0) headings.push({ id: "gallery", title: "Photo Gallery" });
  if (blog?.travelTips?.length > 0) headings.push({ id: "travel-tips", title: "Travel Tips" });
  if (blog?.faqs?.length > 0) headings.push({ id: "faqs", title: "FAQs" });
  headings.push({ id: "comments", title: "Comments" });

  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      let currentId = headings[0]?.id; // Default to first

      for (const el of headingElements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 150) {
          currentId = el.id;
        }
      }
      
      if (currentId) {
        setActiveHeading(currentId);
      }
    };
    window.addEventListener("scroll", handleScroll);
    
    // View Increment Logic
    if (slug && blog?._id) {
      const viewedBlogs = JSON.parse(sessionStorage.getItem('viewedBlogs') || '{}');
      if (!viewedBlogs[slug]) {
        blogService.incrementView(slug).catch(console.error);
        viewedBlogs[slug] = true;
        sessionStorage.setItem('viewedBlogs', JSON.stringify(viewedBlogs));
      }
    }
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [slug, blog?._id]);

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title;
    
    if (platform === 'native' && navigator.share) {
      navigator.share({ title, url }).catch(console.error);
      return;
    }
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    } else {
      toast.info(`Sharing via ${platform} (Simulated)`);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pt-24 flex items-center justify-center">
        <FiLoader className="animate-spin text-[#E85D04]" size={48} />
      </div>
    );
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pt-24 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Blog Post Not Found</h2>
        <Link to="/blogs" className="px-6 py-3 bg-[#E85D04] text-white rounded-xl font-bold hover:bg-[#D05203] transition">
          Return to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pb-24 font-sans text-slate-800 dark:text-slate-200">
      
      {/* ----------------------------------------------------
          HERO SECTION
      ---------------------------------------------------- */}
      <section className="relative w-full h-[60vh] md:h-[70vh] min-h-[500px]">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${blog.images?.hero || blog.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050B14] via-[#050B14]/70 to-[#050B14]/20" />
        
        <div className="absolute bottom-0 left-0 right-0 max-w-7xl mx-auto px-4 pb-16 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl"
          >
            <Link to="/blogs" className="inline-flex items-center gap-2 py-2 px-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 mb-8 transition font-medium text-sm">
              <FiArrowLeft size={16} /> Back to Articles
            </Link>
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
               <span className="bg-[#E85D04] text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#E85D04]/30">
                 {blog.category?.replace(/-/g, " ")}
               </span>
               <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-1.5 rounded-full text-xs font-semibold">
                 {blog.readTime || '5'} min Read
               </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white mb-8 leading-tight tracking-tight">
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium">
              <div className="flex items-center gap-3">
                {blog.author?.profileImage ? (
                  <img src={blog.author.profileImage} alt={blog.author.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-white border-2 border-slate-700">
                    <FiUser size={20} />
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="text-white font-bold text-base">{blog.author?.name || "TravelBharat Editor"}</span>
                  <span className="text-xs text-slate-400">Author & Explorer</span>
                </div>
              </div>
              
              <div className="h-10 w-px bg-slate-700 hidden sm:block" />
              
              <div className="flex items-center gap-2">
                <FiCalendar className="text-[#E85D04] text-lg" />
                <div className="flex flex-col">
                  <span className="text-white font-bold">{new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span className="text-xs text-slate-400">Published Date</span>
                </div>
              </div>
              
              <div className="h-10 w-px bg-slate-700 hidden sm:block" />
              
              <div className="flex items-center gap-5">
                <div className="flex flex-col items-center">
                  <span className="text-white font-bold flex items-center gap-1.5"><FiEye className="text-[#E85D04]"/> {blog.views || blog.viewCount || 0}</span>
                  <span className="text-xs text-slate-400">Views</span>
                </div>
                <button 
                  onClick={() => likeMutation.mutate()} 
                  className="flex flex-col items-center hover:opacity-80 transition cursor-pointer"
                  disabled={likeMutation.isPending}
                >
                  <span className="text-white font-bold flex items-center gap-1.5"><FiHeart className="text-[#E85D04]"/> {blog.likes || blog.likeCount || 0}</span>
                  <span className="text-xs text-slate-400">Likes</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ----------------------------------------------------
          MAIN LAYOUT
      ---------------------------------------------------- */}
      <section className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* CONTENT AREA (LEFT 70%) */}
        <article className="lg:col-span-8">
          
          <div className="text-xl md:text-2xl font-semibold text-slate-600 dark:text-slate-300 italic mb-12 leading-relaxed border-l-4 border-[#E85D04] pl-6 py-2">
            "{blog.excerpt}"
          </div>
          
          {/* Social Share Bar */}
          <div className="flex items-center justify-between py-6 border-y border-slate-200 dark:border-slate-800 mb-12">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Share:</span>
              <button onClick={() => handleShare('native')} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:bg-[#E85D04] hover:text-white transition-colors cursor-pointer"><FiShare2 size={18} /></button>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => saveMutation.mutate()}
                disabled={saveMutation.isPending}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors cursor-pointer text-sm font-bold disabled:opacity-50 ${isBookmarked ? 'border-[#E85D04] text-[#E85D04] bg-[#E85D04]/10' : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'}`}
              >
                <FiBookmark className={isBookmarked ? "fill-current" : ""} /> {saveMutation.isPending ? "Saving..." : (isBookmarked ? "Saved" : "Save")}
              </button>
            </div>
          </div>

          {/* Blog Content */}
          <div id="content" className="prose prose-lg dark:prose-invert max-w-none prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-headings:text-slate-900 dark:prose-headings:text-white prose-headings:font-bold prose-a:text-[#E85D04] hover:prose-a:text-[#D05203] prose-img:rounded-3xl prose-img:shadow-xl">
            <div dangerouslySetInnerHTML={{ __html: blog.content?.replace(/\n/g, '<br/>') }} />
          </div>

          {/* Gallery */}
          {blog.images?.gallery?.length > 0 && (
            <div id="gallery" className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><FiImage className="text-[#E85D04]" /> Photo Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {blog.images.gallery.map((img, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden cursor-pointer group" onClick={() => setSelectedImage(img)}>
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Travel Tips */}
          {blog.travelTips?.length > 0 && (
            <div id="travel-tips" className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><FiInfo className="text-[#E85D04]" /> Essential Travel Tips</h3>
              <ul className="space-y-4">
                {blog.travelTips.map((tip, idx) => (
                  <li key={idx} className="flex gap-4 p-5 bg-slate-100 dark:bg-slate-900 rounded-2xl border-l-4 border-[#E85D04]">
                    <FiMapPin className="text-[#E85D04] shrink-0 mt-1" />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs */}
          {blog.faqs?.length > 0 && (
            <div id="faqs" className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2"><FiHelpCircle className="text-[#E85D04]" /> Frequently Asked Questions</h3>
              <div className="space-y-4">
                {blog.faqs.map((faq, idx) => (
                  <div key={idx} className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <button 
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between p-5 bg-slate-50 dark:bg-[#0A121F] hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors text-left cursor-pointer"
                    >
                      <span className="font-bold text-slate-900 dark:text-white">{faq.question}</span>
                      <span className={`text-[#E85D04] font-bold text-xl transition-transform ${expandedFaq === idx ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    <AnimatePresence>
                      {expandedFaq === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-5 pb-5 bg-slate-50 dark:bg-[#0A121F] text-slate-600 dark:text-slate-400 leading-relaxed"
                        >
                          {faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Tags */}
          {blog.tags?.length > 0 && (
            <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map(tag => (
                  <Link key={tag} to={`/blogs?search=${tag}`} className="px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-semibold hover:bg-[#E85D04] hover:text-white transition-colors uppercase tracking-wider">
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Author Box */}
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

          {/* Comments Section */}
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
          
        </article>

        {/* SIDEBAR (RIGHT 30%) */}
        <aside className="lg:col-span-4 space-y-10">
          
          <div className="sticky top-28 space-y-10">
            
            {/* Table of Contents */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-black text-xl text-slate-900 dark:text-white mb-6">In this article</h3>
              <ul className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                {headings.map(h => (
                  <li key={h.id} className="relative pl-8">
                    <span className={`absolute left-0 top-1.5 w-4 h-4 rounded-full border-4 bg-white dark:bg-slate-900 ${activeHeading === h.id ? 'border-[#E85D04]' : 'border-slate-200 dark:border-slate-700'}`} />
                    <a 
                      href={`#${h.id}`} 
                      onClick={(e) => { 
                        e.preventDefault(); 
                        setActiveHeading(h.id); 
                        const element = document.getElementById(h.id);
                        if (element) {
                          const y = element.getBoundingClientRect().top + window.scrollY - 100;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                        }
                      }}
                      className={`text-sm font-semibold transition-colors block ${activeHeading === h.id ? 'text-[#E85D04]' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                      {h.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </aside>

      </section>

      {/* Lightbox for Gallery */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Gallery" className="max-w-full max-h-full rounded-lg shadow-2xl" />
        </div>
      )}

    </div>
  );
};

export default BlogDetails;
