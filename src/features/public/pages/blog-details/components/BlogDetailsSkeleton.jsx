import React from 'react';
import PageContainer from "../../../../../components/layout/PageContainer";

const BlogDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pb-24 font-sans animate-pulse">
      {/* Hero Skeleton */}
      <div className="relative w-full h-[50vh] md:h-[65vh] lg:h-[80vh] bg-slate-200 dark:bg-slate-800">
        <div className="absolute inset-0 bg-linear-to-t from-slate-50 dark:from-[#050B14] via-transparent to-transparent" />
        <PageContainer className="absolute bottom-0 left-0 w-full p-6 lg:p-16 flex flex-col gap-6">
          {/* Metadata Bar */}
          <div className="flex gap-4 items-center">
            <div className="h-6 w-24 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            <div className="h-6 w-20 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
          </div>
          {/* Title */}
          <div className="space-y-4 w-full md:w-3/4">
            <div className="h-10 md:h-16 w-full bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
            <div className="h-10 md:h-16 w-4/5 bg-slate-300 dark:bg-slate-700 rounded-lg"></div>
          </div>
          {/* Author & Stats */}
          <div className="flex flex-wrap gap-6 items-center mt-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-300 dark:bg-slate-700"></div>
              <div className="space-y-2">
                <div className="h-4 w-24 bg-slate-300 dark:bg-slate-700 rounded"></div>
                <div className="h-3 w-32 bg-slate-300 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300 dark:bg-slate-700 mx-2 hidden sm:block"></div>
            <div className="flex gap-4">
              <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
              <div className="h-8 w-24 bg-slate-300 dark:bg-slate-700 rounded-full"></div>
            </div>
          </div>
        </PageContainer>
      </div>

      <PageContainer className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-16 relative">
        {/* Sticky Action Bar Skeleton */}
        <div className="hidden lg:flex flex-col gap-4 absolute left-0 top-0 -ml-16">
           <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
           <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
           <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-8">
          <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-800 rounded mb-12"></div>
          
          {/* Paragraphs */}
          <div className="space-y-6 mb-12">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-11/12 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>

          {/* Inline Image Skeleton */}
          <div className="w-full h-[400px] bg-slate-200 dark:bg-slate-800 rounded-3xl my-12"></div>

          <div className="space-y-6 mb-16">
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-10/12 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>

          {/* Author Box Skeleton */}
          <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-3xl my-16"></div>

          {/* Comments Skeleton */}
          <div className="mt-16">
             <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded mb-8"></div>
             <div className="w-full h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl mb-8"></div>
             <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                <div className="w-full h-24 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
             </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-24">
            <div className="h-6 w-40 bg-slate-200 dark:bg-slate-800 rounded mb-6"></div>
            <div className="space-y-4 border-l-2 border-slate-200 dark:border-slate-800 pl-4">
              <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default BlogDetailsSkeleton;
