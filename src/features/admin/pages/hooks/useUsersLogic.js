import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminList } from "../../hooks/useAdminList";
import { useAdminMutations } from "../../hooks/useAdminMutations";

export const useUsersLogic = () => {
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);

  const { data, isLoading, isError, error, searchParams, setSearchParams } = useAdminList({
    queryKey: "adminUsers",
    endpoint: "/admin/users",
    extractParams: (params) => {
      const status = params.get("status") || "";
      return {
        role: params.get("role") || "",
        isActive: status ? (status === "active" ? "true" : "false") : undefined
      };
    }
  });

  const { updateMutation, deleteMutation } = useAdminMutations({
    queryKey: ["adminUsers"],
    updateEndpoint: (id) => `/admin/users/${id}`,
    deleteEndpoint: (id) => `/admin/users/${id}`,
    successUpdateMsg: "User status updated successfully!",
    successDeleteMsg: "User removed permanently!"
  });

  const responseData = data?.data || {};
  const users = responseData.users || [];
  const pagination = responseData.pagination || { total: 0, pages: 1 };

  const handleToggleActive = (e, userItem) => {
    e.stopPropagation();
    updateMutation.mutate({
      id: userItem._id,
      payload: { isActive: !userItem.isActive }
    });
  };

  const handleRoleChange = (e, userItem, newRole) => {
    e.stopPropagation();
    updateMutation.mutate({
      id: userItem._id,
      payload: { role: newRole }
    });
  };

  const handleDeleteClick = (e, id) => {
    e.stopPropagation();
    setConfirmDelete(id);
  };

  const handleRowClick = (userItem) => {
    navigate(`/admin/users/${userItem._id}`);
  };

  return {
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
  };
};
