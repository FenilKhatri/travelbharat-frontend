import { Link } from "react-router-dom";
import { FiShare2, FiImage, FiInfo, FiMapPin, FiHelpCircle } from "react-icons/fi";
import { AnimatePresence } from "framer-motion";
import LikeButton from "../../../../../components/ui/LikeButton";
const BlogContent = ({ blog, handleShare, setSelectedImage, expandedFaq, setExpandedFaq }) => {
  return (
    <>
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
          <LikeButton entityId={blog._id} entityType="blog" initialCount={blog.likeCount || blog.likes} />
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
    </>
  );
};
export default BlogContent;