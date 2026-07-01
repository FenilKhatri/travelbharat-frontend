import React from "react";
import AdminDataExplorer from "../components/ui/AdminDataExplorer";
import { useUsersLogic } from "./hooks/useUsersLogic";
import UserRow from "./components/users/UserRow";
import UserGridCard from "./components/users/UserGridCard";
import UserDeleteModal from "./components/users/UserDeleteModal";

const Users = () => {
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

  const renderHeader = () => (
    <>
      <th className="py-4 px-6">User Details</th>
      <th className="py-4 px-6">Role Privilege</th>
      <th className="py-4 px-6">Provider</th>
      <th className="py-4 px-6">Status</th>
      <th className="py-4 px-6 text-right">Actions</th>
    </>
  );

  const renderRow = (user) => (
    <UserRow
      key={user._id}
      userItem={user}
      onToggleActive={handleToggleActive}
      onRoleChange={handleRoleChange}
      onDeleteClick={handleDeleteClick}
      onRowClick={handleRowClick}
    />
  );

  const renderGridCard = (user) => (
    <UserGridCard
      key={user._id}
      userItem={user}
      onToggleActive={handleToggleActive}
      onRoleChange={handleRoleChange}
      onDeleteClick={handleDeleteClick}
      onRowClick={handleRowClick}
    />
  );

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
