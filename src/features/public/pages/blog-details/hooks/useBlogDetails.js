import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { blogService } from "../../../../../services/blogService";
import { useAuth } from "../../../../../context/AuthContext";

export const useBlogDetails = (slug) => {
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

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = blog?.title;

    if (navigator.share) {
      navigator.share({ title, url }).catch(console.error);
    }
  };

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
  }, [slug, blog?._id, headings]);

  return {
    blog,
    isLoading,
    isError,
    comments,
    isBookmarked,
    likeMutation,
    saveMutation,
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
  };
};
