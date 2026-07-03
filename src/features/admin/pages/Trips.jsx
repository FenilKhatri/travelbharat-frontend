import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";
import { useTripsLogic } from "./hooks/useTripsLogic";
import TripRow from "./components/trips/TripRow";
import TripGridCard from "./components/trips/TripGridCard";
import TripDeleteModal from "./components/trips/TripDeleteModal";
import Checkbox from "../../../components/ui/Checkbox";

const Trips = () => {
  const [selectedIds, setSelectedIds] = useState([]);
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

  const renderHeader = ({ isAllSelected, toggleSelectAll }) => (
    <>
      <th className="py-4 px-6 w-12">
        <Checkbox checked={isAllSelected || false} onChange={toggleSelectAll} />
      </th>
      <th className="py-4 px-6">Itinerary Name</th>
      <th className="py-4 px-6">Creator</th>
      <th className="py-4 px-6">Duration</th>
      <th className="py-4 px-6">Itinerary Details</th>
      <th className="py-4 px-6">Budget</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (trip, { isSelected, toggleSelection }) => (
    <TripRow
      key={trip._id}
      trip={trip}
      onRowClick={handleRowClick}
      onPreviewClick={handlePreviewClick}
      onDeleteClick={handleDeleteClick}
      isSelected={isSelected}
      toggleSelection={toggleSelection}
    />
  );

  const renderGridCard = (trip, { isSelected, toggleSelection }) => (
    <TripGridCard
      key={trip._id}
      trip={trip}
      onRowClick={handleRowClick}
      onPreviewClick={handlePreviewClick}
      onDeleteClick={handleDeleteClick}
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
            toast.error(`Failed to delete ${failed.length} trips`);
          });
        } else {
          import("react-toastify").then(({ toast }) => {
            toast.success(`Successfully deleted ${ids.length} trips`);
          });
        }
        clearSelection();
      }
    }
  ];

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
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={bulkActions}
        emptyStateMessage="No generated itineraries found."
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