import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import http from "../../../../lib/axios";
import { useAdminList } from "../../hooks/useAdminList";
import { useAdminMutations } from "../../hooks/useAdminMutations";

export const useReviewsLogic = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [responseModal, setResponseModal] = useState(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading, isError, error, searchParams, setSearchParams } = useAdminList({
    queryKey: "adminReviews",
    endpoint: "/reviews/admin/all",
    extractParams: (params) => ({
      status: params.get("status") || ""
    })
  });

  const { deleteMutation } = useAdminMutations({
    queryKey: ["adminReviews"],
    updateEndpoint: (id) => `/reviews/admin/${id}`,
    deleteEndpoint: (id) => `/reviews/admin/${id}`,
    successDeleteMsg: "Review deleted permanently!"
  });

  const responseData = data?.data || {};
  const reviews = responseData.reviews || [];
  const pagination = responseData.pagination || { total: 0, pages: 1 };

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.put(`/reviews/admin/approve/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review approved successfully!");
      queryClient.invalidateQueries(["adminReviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Approval failed");
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.put(`/reviews/admin/reject/${id}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Review rejected & hidden.");
      queryClient.invalidateQueries(["adminReviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Rejection failed");
    }
  });

  const respondMutation = useMutation({
    mutationFn: async ({ id, text }) => {
      const response = await http.put(`/reviews/admin/respond/${id}`, { adminResponse: text });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Response posted successfully!");
      setResponseModal(null);
      setAdminReplyText("");
      queryClient.invalidateQueries(["adminReviews"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to post reply");
    }
  });

  const handleRespondClick = (e, review) => {
    e.stopPropagation();
    setResponseModal(review);
    setAdminReplyText(review.adminResponse || "");
  };

  const handleRespondSubmit = (e) => {
    e.preventDefault();
    if (!adminReplyText.trim()) return;
    respondMutation.mutate({ id: responseModal._id, text: adminReplyText.trim() });
  };

  const handleRowClick = (review) => {
    navigate(`/admin/reviews/${review._id}`);
  };

  return {
    reviews,
    pagination,
    isLoading,
    isError,
    error,
    searchParams,
    setSearchParams,
    responseModal,
    setResponseModal,
    adminReplyText,
    setAdminReplyText,
    confirmDelete,
    setConfirmDelete,
    approveMutation,
    rejectMutation,
    respondMutation,
    deleteMutation,
    handleRespondClick,
    handleRespondSubmit,
    handleRowClick
  };
};
