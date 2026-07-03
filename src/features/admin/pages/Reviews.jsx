import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";
import { useReviewsLogic } from "./hooks/useReviewsLogic";
import ReviewRow from "./components/reviews/ReviewRow";
import ReviewGridCard from "./components/reviews/ReviewGridCard";
import { ReviewResponseModal, ReviewDeleteModal } from "./components/reviews/ReviewModals";
import Checkbox from "../../../components/ui/Checkbox";

const Reviews = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const {
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
  } = useReviewsLogic();

  const filters = [
    {
      key: "status",
      label: "Moderation State",
      options: [
        { value: "pending", label: "Awaiting Approval" },
        { value: "approved", label: "Approved" }
      ]
    }
  ];

  const renderHeader = ({ isAllSelected, toggleSelectAll }) => (
    <>
      <th className="py-4 px-6 w-12">
        <Checkbox checked={isAllSelected || false} onChange={toggleSelectAll} />
      </th>
      <th className="py-4 px-6">Traveler / Date</th>
      <th className="py-4 px-6">Destination</th>
      <th className="py-4 px-6">Feedback / Comments</th>
      <th className="py-4 px-6">Rating</th>
      <th className="py-4 px-6">Status</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (review, { isSelected, toggleSelection }) => (
    <ReviewRow
      key={review._id}
      review={review}
      onApprove={(id) => approveMutation.mutate(id)}
      onReject={(id) => rejectMutation.mutate(id)}
      onRespondClick={handleRespondClick}
      onDeleteClick={(id) => setConfirmDelete(id)}
      onRowClick={handleRowClick}
      isSelected={isSelected}
      toggleSelection={toggleSelection}
    />
  );

  const renderGridCard = (review, { isSelected, toggleSelection }) => (
    <ReviewGridCard
      key={review._id}
      review={review}
      onApprove={(id) => approveMutation.mutate(id)}
      onReject={(id) => rejectMutation.mutate(id)}
      onRespondClick={handleRespondClick}
      onDeleteClick={(id) => setConfirmDelete(id)}
      onRowClick={handleRowClick}
      isSelected={isSelected}
      toggleSelection={toggleSelection}
    />
  );

  const bulkActions = [
    {
      label: "Delete",
      icon: <FiTrash2 />,
      variant: "danger",
      onClick: async (ids, clearSelection) => {
        const results = await Promise.allSettled(
          ids.map(id => deleteMutation.mutateAsync(id))
        );
        const failed = results.filter(r => r.status === 'rejected');
        if (failed.length > 0) {
          import("react-toastify").then(({ toast }) => {
            toast.error(`Failed to delete ${failed.length} reviews`);
          });
        } else {
          import("react-toastify").then(({ toast }) => {
            toast.success(`Successfully deleted ${ids.length} reviews`);
          });
        }
        clearSelection();
      }
    }
  ];

  return (
    <>
      <AdminDataExplorer
        title="Review Management"
        subtitle="Approve, reject, respond to user feedback, and moderate rating metrics for destinations."
        searchPlaceholder="Filter items..."
        filters={filters}
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={reviews}
        pagination={pagination}
        renderHeader={renderHeader}
        renderRow={renderRow}
        renderGridCard={renderGridCard}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={bulkActions}
        emptyStateMessage="No traveler reviews found under selected criteria."
      />

      <ReviewResponseModal
        responseModal={responseModal}
        setResponseModal={setResponseModal}
        adminReplyText={adminReplyText}
        setAdminReplyText={setAdminReplyText}
        handleRespondSubmit={handleRespondSubmit}
        respondMutation={respondMutation}
      />

      <ReviewDeleteModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        deleteMutation={deleteMutation}
      />
    </>
  );
};

export default Reviews;