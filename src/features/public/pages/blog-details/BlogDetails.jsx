import { useParams, Link } from "react-router-dom";
import { useBlogDetails } from "./hooks/useBlogDetails";
import { useLogHistory } from "../../../../../utils/auth/useLogHistory";

import BlogDetailsHero from "./components/BlogDetailsHero";
import BlogContent from "./components/BlogContent";
import BlogAuthorBox from "./components/BlogAuthorBox";
import BlogComments from "./components/BlogComments";
import BlogTOC from "./components/BlogTOC";
import PageLoader from "../../../../components/ui/PageLoader";

const BlogDetails = () => {
  const { slug } = useParams();

  const {
    blog,
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
    setSelectedImage
  } = useBlogDetails(slug);

  useLogHistory({
    actionType: "VIEW_BLOG",
    entityId: blog?._id,
    entityModel: "Blog",
    entityTitle: blog?.title,
    entitySlug: slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pt-24">
        <PageLoader fullScreen={false} message="Loading story..." size="md" />
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
      <BlogDetailsHero blog={blog} likeMutation={likeMutation} />

      {/* Main Layout */}
      <section className="max-w-[1600px] w-full mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-16">

        {/* CONTENT AREA (LEFT 70%) */}
        <article className="lg:col-span-8">
          <BlogContent
            blog={blog}
            handleShare={handleShare}
            setSelectedImage={setSelectedImage}
            expandedFaq={expandedFaq}
            setExpandedFaq={setExpandedFaq}
          />

          <BlogAuthorBox blog={blog} />

          <BlogComments
            blog={blog}
            comments={comments}
            commentText={commentText}
            setCommentText={setCommentText}
            handlePostComment={handlePostComment}
            commentMutation={commentMutation}
          />
        </article>

        {/* SIDEBAR (RIGHT 30%) */}
        <BlogTOC
          headings={headings}
          activeHeading={activeHeading}
          setActiveHeading={setActiveHeading}
        />

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
