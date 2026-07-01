import React from "react";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";
import { useTripsLogic } from "./hooks/useTripsLogic";
import TripRow from "./components/trips/TripRow";
import TripGridCard from "./components/trips/TripGridCard";
import TripDeleteModal from "./components/trips/TripDeleteModal";

const Trips = () => {
  const {
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
  } = useTripsLogic();

  const filters = [
    {
      key: "tripType",
      label: "Trip Type",
      options: [
        { value: "solo", label: "Solo Traveler" },
        { value: "family", label: "Family Trip" },
        { value: "couple", label: "Couple Trip" },
        { value: "friends", label: "Friends Group" },
        { value: "pilgrim", label: "Pilgrimage" }
      ]
    }
  ];

  const renderHeader = () => (
    <>
      <th className="py-4 px-6">Itinerary Name</th>
      <th className="py-4 px-6">Creator</th>
      <th className="py-4 px-6">Duration</th>
      <th className="py-4 px-6">Itinerary Details</th>
      <th className="py-4 px-6">Budget</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (trip) => (
    <TripRow
      key={trip._id}
      trip={trip}
      onRowClick={handleRowClick}
      onPreviewClick={handlePreviewClick}
      onDeleteClick={handleDeleteClick}
    />
  );

  const renderGridCard = (trip) => (
    <TripGridCard
      key={trip._id}
      trip={trip}
      onRowClick={handleRowClick}
      onPreviewClick={handlePreviewClick}
      onDeleteClick={handleDeleteClick}
    />
  );

  return (
    <>
      <AdminDataExplorer
        title="User Itineraries"
        subtitle="Monitor and moderate all customized travel itineraries and plans made by TravelBharat users."
        searchPlaceholder="Search trips by itinerary title..."
        filters={filters}
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={trips}
        pagination={pagination}
        renderHeader={renderHeader}
        renderRow={renderRow}
        renderGridCard={renderGridCard}
        emptyStateMessage="No custom trips found."
        emptyStateIcon="FiNavigation"
      />

      <TripDeleteModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        deleteMutation={deleteMutation}
      />
    </>
  );
};

export default Trips;