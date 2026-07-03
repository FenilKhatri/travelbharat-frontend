import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";
import { useUsersLogic } from "./hooks/useUsersLogic";
import UserRow from "./components/users/UserRow";
import UserGridCard from "./components/users/UserGridCard";
import UserDeleteModal from "./components/users/UserDeleteModal";
import Checkbox from "../../../components/ui/Checkbox";

const Users = () => {
  const [selectedIds, setSelectedIds] = useState([]);
  const {
    users,
    pagination,
    isLoading,
    isError,
    error,
    searchParams,
    setSearchParams,
    confirmDelete,
    setConfirmDelete,
    deleteMutation,
    handleToggleActive,
    handleRoleChange,
    handleDeleteClick,
    handleRowClick
  } = useUsersLogic();

  const filters = [
    {
      key: "role",
      label: "Role",
      options: [
        { value: "user", label: "User" },
        { value: "admin", label: "Admin" }
      ]
    },
    {
      key: "status",
      label: "Status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Suspended" }
      ]
    }
  ];

  const renderHeader = ({ isAllSelected, toggleSelectAll }) => (
    <>
      <th className="py-4 px-6 w-12">
        <Checkbox checked={isAllSelected || false} onChange={toggleSelectAll} />
      </th>
      <th className="py-4 px-6">User Details</th>
      <th className="py-4 px-6">Role Privilege</th>
      <th className="py-4 px-6">Provider</th>
      <th className="py-4 px-6">Status</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (user, { isSelected, toggleSelection }) => (
    <UserRow
      key={user._id}
      userItem={user}
      onToggleActive={handleToggleActive}
      onRoleChange={handleRoleChange}
      onDeleteClick={handleDeleteClick}
      onRowClick={handleRowClick}
      isSelected={isSelected}
      toggleSelection={toggleSelection}
    />
  );

  const renderGridCard = (user, { isSelected, toggleSelection }) => (
    <UserGridCard
      key={user._id}
      userItem={user}
      onToggleActive={handleToggleActive}
      onRoleChange={handleRoleChange}
      onDeleteClick={handleDeleteClick}
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
            toast.error(`Failed to delete ${failed.length} users`);
          });
        } else {
          import("react-toastify").then(({ toast }) => {
            toast.success(`Successfully deleted ${ids.length} users`);
          });
        }
        clearSelection();
      }
    }
  ];

  return (
    <>
      <AdminDataExplorer
        title="User Directory"
        subtitle="Manage user accounts, roles, access states, and credentials."
        searchPlaceholder="Search by name, email..."
        filters={filters}
        isLoading={isLoading}
        isError={isError}
        error={error}
        items={users}
        pagination={pagination}
        renderHeader={renderHeader}
        renderRow={renderRow}
        renderGridCard={renderGridCard}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        bulkActions={bulkActions}
        emptyStateMessage="No users matching search filters."
      />
      <UserDeleteModal
        confirmDelete={confirmDelete}
        setConfirmDelete={setConfirmDelete}
        deleteMutation={deleteMutation}
      />
    </>
  );
};

export default Users;
