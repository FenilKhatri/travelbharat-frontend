import { Link } from "react-router-dom";
import { FiImage, FiInfo, FiMapPin, FiHelpCircle, FiShare2 } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import SaveButton from "../../../../../components/ui/SaveButton";
import Button from "../../../../../components/ui/Button";

const BlogContent = ({ blog, handleShare, setSelectedImage, expandedFaq, setExpandedFaq }) => {
  return (
    <div className="font-serif lg:pl-12">
      {/* Share and Save Bar */}
      <div className="flex items-center justify-between py-6 border-b border-slate-200 dark:border-slate-800 mb-12 font-sans">
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Share:</span>
          <Button variant="ghost" className="w-10 h-10 p-0! rounded-full bg-slate-100 dark:bg-slate-900 hover:bg-[#E85D04] hover:text-white text-slate-600 dark:text-slate-400" onClick={() => handleShare('native')}>
            <FiShare2 size={18} />
          </Button>
        </div>
        <div className="flex gap-3">
          <SaveButton entityId={blog._id} entityType="blog" initialIsSaved={blog.isSaved} />
        </div>
      </div>
      {/* Article Body */}
      <div 
        id="content" 
        className="
          prose prose-lg md:prose-xl max-w-none 
          prose-p:text-slate-700 prose-p:leading-[1.8] dark:prose-p:text-slate-300 
          prose-headings:font-sans prose-headings:font-black prose-headings:text-slate-900 dark:prose-headings:text-white 
          prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:border-b prose-h2:border-slate-200 dark:prose-h2:border-slate-800 prose-h2:pb-4
          prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-4
          prose-a:text-[#E85D04] prose-a:font-semibold prose-a:no-underline hover:prose-a:underline hover:prose-a:text-[#D05203] transition-colors
          prose-img:rounded-2xl prose-img:shadow-2xl prose-img:w-full prose-img:object-cover prose-img:my-12
          prose-blockquote:border-l-[#E85D04] prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:not-italic prose-blockquote:text-slate-800 dark:prose-blockquote:text-slate-200
          prose-li:text-slate-700 dark:prose-li:text-slate-300 prose-li:marker:text-[#E85D04]
        "
      >
        <div dangerouslySetInnerHTML={{ __html: blog.content?.replace(/\n/g, '<br/>') }} />
      </div>

      {/* Destinations Mentioned */}
      {blog.relatedDestinations?.length > 0 && (
        <div className="mt-20">
          <h3 className="text-2xl font-black font-sans text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">Destinations Mentioned</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {blog.relatedDestinations.map((dest) => (
              <Link to={`/places/${dest.slug}`} key={dest._id} className="group block bg-white dark:bg-[#0A121F] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl hover:border-[#E85D04]/30 transition-all duration-300 hover:-translate-y-1">
                <div className="h-48 overflow-hidden relative">
                   <img src={dest.images?.thumbnail || "https://images.unsplash.com/photo-1524492412937-b28074a5d7da"} alt={dest.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
                   <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h4 className="font-bold text-lg font-sans">{dest.name}</h4>
                   </div>
                </div>
                <div className="p-4 font-sans text-sm text-slate-600 dark:text-slate-400">
                   <p className="line-clamp-2">{dest.shortDescription || dest.description || "Discover more about this beautiful destination."}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Travel Tips Callout */}
      {blog.travelTips?.length > 0 && (
        <div id="travel-tips" className="mt-16 bg-[#E85D04]/5 border border-[#E85D04]/20 rounded-3xl p-6 md:p-8 font-sans">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#E85D04]/10 text-[#E85D04] flex items-center justify-center"><FiInfo size={20} /></div> Essential Travel Tips</h3>
          <ul className="space-y-4">
            {blog.travelTips.map((tip, idx) => (
              <li key={idx} className="flex gap-4 p-4 bg-white dark:bg-slate-900/50 rounded-2xl shadow-xs">
                <FiMapPin className="text-[#E85D04] shrink-0 mt-1" size={18} />
                <span className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{typeof tip === "string" ? tip : tip?.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Gallery */}
      {blog.images?.gallery?.length > 0 && (
        <div id="gallery" className="mt-20">
          <h3 className="text-2xl font-black font-sans text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center gap-2"><FiImage className="text-[#E85D04]" /> Photo Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {blog.images.gallery.map((img, idx) => (
              <div key={idx} className="aspect-4/3 rounded-2xl overflow-hidden cursor-pointer group relative" onClick={() => setSelectedImage(img)}>
                <img src={img} alt={`Gallery ${idx}`} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                  <FiImage className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQs */}
      {blog.faqs?.length > 0 && (
        <div id="faqs" className="mt-20 font-sans">
          <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-8 border-b border-slate-200 dark:border-slate-800 pb-4 flex items-center gap-2"><FiHelpCircle className="text-[#E85D04]" /> Frequently Asked Questions</h3>
          <div className="space-y-4">
            {blog.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:border-[#E85D04]/30 transition-colors shadow-xs">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left cursor-pointer"
                >
                  <span className="font-bold text-slate-900 dark:text-white text-lg">{faq.question}</span>
                  <span className={`text-[#E85D04] font-medium text-2xl transition-transform duration-300 ${expandedFaq === idx ? 'rotate-45' : ''}`}>+</span>
                </button>
                <AnimatePresence>
                  {expandedFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6 text-slate-600 dark:text-slate-400 leading-relaxed text-lg"
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
        <div className="mt-16 pt-8 font-sans">
          <div className="flex flex-wrap gap-2">
            {blog.tags.map(tag => (
              <Link key={tag} to={`/blogs?search=${tag}`} className="px-4 py-2 bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-full text-sm font-semibold hover:bg-[#E85D04] hover:text-white transition-colors">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default BlogContent;