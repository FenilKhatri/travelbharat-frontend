import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { blogService } from "../../../../../services/blogService";

export const categories = [
  "Travel Guide", "Destinations", "Culture", "Festivals", "Food",
  "Adventure", "Wildlife", "Heritage", "Photography"
];

export const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export const useBlogsData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { data: blogsData, isLoading } = useQuery({
    queryKey: ["allBlogs", selectedCategory],
    queryFn: () => blogService.getAllBlogs({
      category: selectedCategory ? selectedCategory.toLowerCase().replace(/ /g, "-") : undefined,
    }),
  });

  const { data: popularBlogsData } = useQuery({
    queryKey: ["popularBlogs"],
    queryFn: () => blogService.getPopularBlogs(),
  });

  const { data: tagsData } = useQuery({
    queryKey: ["blogTags"],
    queryFn: () => blogService.getBlogTags(),
  });

  const blogs = blogsData?.data?.data?.blogs || blogsData?.data?.blogs || [];
  const popularBlogsList = popularBlogsData?.data?.data?.blogs || popularBlogsData?.data?.blogs || [];
  const popularTags = tagsData?.data?.data?.tags || tagsData?.data?.tags || [];

  const filteredBlogs = useMemo(
    () => blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (blog.excerpt && blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    ),
    [blogs, searchTerm]
  );

  const featuredBlog = filteredBlogs[0];
  const gridBlogs = filteredBlogs.slice(1);
  const recentBlogs = filteredBlogs.slice(0, 5);
  const hasFilters = searchTerm || selectedCategory;

  return {
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
  };
};
