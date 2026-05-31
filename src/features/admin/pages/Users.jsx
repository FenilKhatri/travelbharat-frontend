import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { FiUsers, FiTrash2, FiXCircle, FiChevronLeft, FiChevronRight, FiMail } from "react-icons/fi";
import { MdSecurity, MdVerified } from "react-icons/md";
import http from "../../../lib/axios";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import { toast } from "react-toastify";

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Extract query filters
  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const status = searchParams.get("status") || "";

  // Query to fetch all users
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["adminUsers", page, search, role, status],
    queryFn: async () => {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (role) params.role = role;
      if (status) {
        params.isActive = status === "active" ? "true" : "false";
      }
      const response = await http.get("/admin/users", { params });
      return response.data;
    },
    keepPreviousData: true
  });

  const responseData = data || {};
  const users = responseData.users || [];
  const pagination = responseData.pagination || { total: 0, pages: 1 };

  // Mutations
  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const response = await http.put(`/admin/users/${id}`, payload);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "User status updated successfully!");
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update user");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const response = await http.delete(`/admin/users/${id}`);
      return response.data;
    },
    onSuccess: (res) => {
      toast.success(res?.message || "User removed permanently!");
      setConfirmDelete(null);
      queryClient.invalidateQueries(["adminUsers"]);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete user");
    }
  });

  const handleToggleActive = (userItem) => {
    updateMutation.mutate({
      id: userItem._id,
      payload: { isActive: !userItem.isActive }
    });
  };

  const handleRoleChange = (userItem, newRole) => {
    updateMutation.mutate({
      id: userItem._id,
      payload: { role: newRole }
    });
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const handlePageChange = (newPage) => {
    setSearchParams((prev) => {
      prev.set("page", newPage.toString());
      return prev;
    });
  };

  // Filters setup
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

  return (
    <div className="space-y-6 pb-12">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">User Directory</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage user accounts, roles, access states, and credentials.</p>
        </div>
      </div>

      {/* Global Filter Toolbar */}
      <SearchAndFilter
        searchPlaceholder="Search by name, email..."
        filters={filters}
      />

      {/* Table Card */}
      <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden">

        {/* Table Head / Loading Spinner */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 bg-slate-55/40 dark:bg-slate-900/10 text-slate-400 text-xs font-extrabold uppercase tracking-wider">
                <th className="py-4 px-6">User Details</th>
                <th className="py-4 px-6">Role Privilege</th>
                <th className="py-4 px-6">Provider</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/30 text-sm text-slate-650 dark:text-slate-350">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800" />
                        <div className="space-y-2">
                          <div className="w-28 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
                          <div className="w-40 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6"><div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="py-4 px-6"><div className="w-20 h-4 bg-slate-200 dark:bg-slate-800 rounded" /></td>
                    <td className="py-4 px-6"><div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-full" /></td>
                    <td className="py-4 px-6 text-right"><div className="w-12 h-6 bg-slate-200 dark:bg-slate-800 rounded ml-auto" /></td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-red-500 font-bold">
                    Error loading directories: {error?.message}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-12 text-slate-400 font-semibold">
                    <FiUsers size={36} className="mx-auto mb-3 text-slate-300" />
                    No users matching search filters.
                  </td>
                </tr>
              ) : (
                users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/5 transition">
                    {/* User Details */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        {userItem.profileImage ? (
                          <img
                            src={userItem.profileImage}
                            alt={userItem.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 text-[#E85D04] font-black flex items-center justify-center">
                            {userItem.name ? userItem.name[0].toUpperCase() : "?"}
                          </div>
                        )}
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200">{userItem.name}</h4>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <FiMail size={12} />
                            {userItem.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Role Privilege */}
                    <td className="py-4 px-6 w-36">
                      <CustomDropdown
                        value={userItem.role}
                        onChange={(val) => handleRoleChange(userItem, val)}
                        options={[
                          { value: "user", label: "User" },
                          { value: "admin", label: "Admin" },
                        ]}
                      />
                    </td>

                    {/* Provider */}
                    <td className="py-4 px-6 font-semibold capitalize text-xs text-slate-400">
                      {userItem.authProvider || "Local email"}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(userItem)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition cursor-pointer ${userItem.isActive
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
                          }`}
                      >
                        {userItem.isActive ? (
                          <>
                            <MdVerified size={12} />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <FiXCircle size={12} />
                            <span>Suspended</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Action Panel */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setConfirmDelete(userItem._id)}
                          title="Remove user permanently"
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition cursor-pointer"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {!isLoading && !isError && pagination.pages > 1 && (
          <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 dark:border-slate-800/40">
            <span className="text-xs font-semibold text-slate-400">
              Showing page {page} of {pagination.pages} ({pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => handlePageChange(page - 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >
                <FiChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <button
                disabled={page >= pagination.pages}
                onClick={() => handlePageChange(page + 1)}
                className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-800/80 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 disabled:pointer-events-none hover:bg-slate-50 dark:hover:bg-slate-900 transition"
              >
                <span>Next</span>
                <FiChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Overlay Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white dark:bg-[#0A121F] border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center gap-3.5 text-red-500 mb-4">
              <MdSecurity size={36} />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete Account?</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Are you absolutely sure? This action will permanently remove this user account, and all associated tourist reviews and custom saved itineraries.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-300 font-semibold rounded-xl text-sm hover:bg-slate-50 dark:hover:bg-slate-850 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-5 py-2 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl text-sm transition"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
