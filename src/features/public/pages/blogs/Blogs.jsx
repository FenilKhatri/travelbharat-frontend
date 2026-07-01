import { useBlogsData } from "./hooks/useBlogsData";

import BlogHero from "./components/BlogHero";
import BlogFilters from "./components/BlogFilters";
import FeaturedBlog from "./components/FeaturedBlog";
import BlogGrid from "./components/BlogGrid";
import BlogSidebar from "./components/BlogSidebar";

const Blogs = () => {
  const {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    filteredBlogs,
    featuredBlog,
    gridBlogs,
    recentBlogs,
    popularBlogsList,
    popularTags,
    hasFilters
  } = useBlogsData();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pb-24 pt-24 font-sans text-slate-800 dark:text-slate-200">
      <BlogHero searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <BlogFilters selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />

      <FeaturedBlog featuredBlog={featuredBlog} isLoading={isLoading} hasFilters={hasFilters} />

      {/* Main Layout */}
      <section className="max-w-[1600px] w-full mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <BlogGrid
          isLoading={isLoading}
          filteredBlogs={filteredBlogs}
          gridBlogs={gridBlogs}
          hasFilters={hasFilters}
          setSearchTerm={setSearchTerm}
          setSelectedCategory={setSelectedCategory}
        />

        <BlogSidebar
          popularBlogsList={popularBlogsList}
          recentBlogs={recentBlogs}
          popularTags={popularTags}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
      </section>
    </div>
  );
};

export default Blogs;
