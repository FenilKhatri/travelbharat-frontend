import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminList } from "../../hooks/useAdminList";
import { useAdminMutations } from "../../hooks/useAdminMutations";

export const useTripsLogic = () => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading, isError, error, searchParams, setSearchParams } = useAdminList({
    queryKey: "adminTrips",
    endpoint: "/trips/admin/all",
    extractParams: (params) => ({
      tripType: params.get("tripType") || ""
    })
  });

  const { deleteMutation } = useAdminMutations({
    queryKey: ["adminTrips"],
    updateEndpoint: (id) => `/trips/admin/${id}`,
    deleteEndpoint: (id) => `/trips/admin/${id}`,
    successDeleteMsg: "Trip itinerary deleted successfully!"
  });

  const responseData = data || {};
  const trips = responseData.trips || data?.data?.trips || [];
  const pagination = responseData.pagination || data?.data?.pagination || { total: 0, pages: 1 };

  const handleRowClick = (trip) => {
    navigate(`/admin/trips/${trip._id}`);
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const handlePreviewClick = (e, tripId) => {
    e.stopPropagation();
    window.open(`/user/trips/${tripId}`, "_blank");
  };

  return {
    trips,
    pagination,
    isLoading,
    isError,
    error,
    searchParams,
    setSearchParams,
    confirmDelete,
    setConfirmDelete,
    deleteMutation,
    handleRowClick,
    handleDeleteClick,
    handlePreviewClick
  };
};
