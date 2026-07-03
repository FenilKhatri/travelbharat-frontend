import { useParams, Link } from "react-router-dom";
import { useBlogDetails } from "./hooks/useBlogDetails";
import { useLogHistory } from "../../../../utils/auth/useLogHistory";

import BlogDetailsHero from "./components/BlogDetailsHero";
import BlogContent from "./components/BlogContent";
import BlogAuthorBox from "./components/BlogAuthorBox";
import BlogComments from "./components/BlogComments";
import BlogTOC from "./components/BlogTOC";
import BlogDetailsSkeleton from "./components/BlogDetailsSkeleton";
import StickyProgressBar from "./components/StickyProgressBar";
import StickyActionBar from "./components/StickyActionBar";
import RelatedArticles from "./components/RelatedArticles";
import PageContainer from "../../../../components/layout/PageContainer";

const BlogDetails = () => {
  const { slug } = useParams();

  const {
    blog,
    relatedBlogs,
    isLoading,
    isError,
    comments,
    likeMutation,
    commentMutation,
    commentText,
    setCommentText,
    handlePostComment,
    handleShare,
    headings,
    activeHeading,
    setActiveHeading,
    expandedFaq,
    setExpandedFaq,
    selectedImage,
    setSelectedImage,
  } = useBlogDetails(slug);

  useLogHistory({
    actionType: "VIEW_BLOG",
    entityId: blog?._id,
    entityModel: "Blog",
    entityTitle: blog?.title,
    entitySlug: slug,
  });

  if (isLoading) {
    return <BlogDetailsSkeleton />;
  }

  if (isError || !blog) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#050B14] pt-24 flex items-center justify-center flex-col">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
          Blog Post Not Found
        </h2>
        <Link
          to="/blogs"
          className="px-6 py-3 bg-[#E85D04] text-white rounded-xl font-bold hover:bg-[#D05203] transition"
        >
          Return to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#050B14] font-sans text-slate-900 dark:text-white">
      <StickyProgressBar />

      <BlogDetailsHero blog={blog} />

      {/* Main Content Layout */}
      <PageContainer as="section" className="mt-10 lg:mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 relative">
        <StickyActionBar blog={blog} handleShare={handleShare} />

        {/* CONTENT AREA (LEFT 8 COLS) */}
        <article className="lg:col-span-8 min-w-0" id="blog-content-article">
          <BlogContent
            blog={blog}
            handleShare={handleShare}
            setSelectedImage={setSelectedImage}
            expandedFaq={expandedFaq}
            setExpandedFaq={setExpandedFaq}
          />

          <BlogAuthorBox blog={blog} />

          <RelatedArticles relatedBlogs={relatedBlogs} />

          <BlogComments
            blog={blog}
            comments={comments}
            commentText={commentText}
            setCommentText={setCommentText}
            handlePostComment={handlePostComment}
            commentMutation={commentMutation}
          />
        </article>

        {/* SIDEBAR (RIGHT 4 COLS) */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24">
            <BlogTOC
              headings={headings}
              activeHeading={activeHeading}
              setActiveHeading={setActiveHeading}
            />
          </div>
        </aside>
      </PageContainer>

      {/* Lightbox for Gallery */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={selectedImage}
            alt="Gallery"
            className="max-w-full max-h-full rounded-lg shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default BlogDetails;
