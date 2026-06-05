import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FiUsers, FiTrash2, FiXCircle, FiMail, FiGrid, FiList } from "react-icons/fi";
import { MdSecurity, MdVerified } from "react-icons/md";
import http from "../../../lib/axios";
import SearchAndFilter from "../../../components/ui/SearchAndFilter";
import CustomDropdown from "../../../components/ui/CustomDropdown";
import AdminPageLayout from "../components/ui/AdminPageLayout";
import AdminPagination from "../components/ui/AdminPagination";
import { toast } from "react-toastify";

const Users = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem("adminUsersViewMode") || "list");

  useEffect(() => {
    localStorage.setItem("adminUsersViewMode", viewMode);
  }, [viewMode]);

  const page = parseInt(searchParams.get("page") || "1");
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "";
  const status = searchParams.get("status") || "";

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
    <AdminPageLayout
      title="User Directory"
      subtitle="Manage user accounts, roles, access states, and credentials."
      actions={
        <div className="hidden sm:flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiList size={16} /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition cursor-pointer ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}><FiGrid size={16} /></button>
        </div>
      }
    >
      <SearchAndFilter
        searchPlaceholder="Search by name, email..."
        filters={filters}
      />

      <div className="bg-transparent">
        {viewMode === "list" && (
        <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden mb-6">
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
                  <tr 
                    key={userItem._id} 
                    onClick={() => handleRowClick(userItem)}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-850/5 transition cursor-pointer"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        {userItem.profileImage ? (
                          <img
                            src={userItem.profileImage}
                            alt={userItem.name}
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#E85D04]/10 text-[#E85D04] font-black flex items-center justify-center shrink-0">
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
                    <td className="py-4 px-6 w-36" onClick={(e) => e.stopPropagation()}>
                      <CustomDropdown
                        value={userItem.role}
                        onChange={(val) => handleRoleChange({stopPropagation:()=>{}}, userItem, val)}
                        options={[
                          { value: "user", label: "User" },
                          { value: "admin", label: "Admin" },
                        ]}
                      />
                    </td>
                    <td className="py-4 px-6 font-semibold capitalize text-xs text-slate-400">
                      {userItem.authProvider || "Local email"}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={(e) => handleToggleActive(e, userItem)}
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
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => handleDeleteClick(e, userItem._id)}
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
        </div>
        )}

        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
            {isLoading ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-4 animate-pulse h-64" />
              ))
            ) : isError ? (
              <div className="col-span-full text-center py-10 text-red-500 font-bold">Error loading users</div>
            ) : users.length === 0 ? (
              <div className="col-span-full text-center py-12 text-slate-400 font-semibold">No users matching search filters.</div>
            ) : (
              users.map((userItem) => (
                <div 
                  key={userItem._id} 
                  onClick={() => handleRowClick(userItem)}
                  className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition flex flex-col group cursor-pointer p-5 relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800 shrink-0">
                      {userItem.profileImage ? (
                        <img src={userItem.profileImage} alt={userItem.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-[#E85D04]/10 text-[#E85D04] font-black text-xl flex items-center justify-center">
                          {userItem.name ? userItem.name[0].toUpperCase() : "?"}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={(e) => handleToggleActive(e, userItem)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${userItem.isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 hover:bg-emerald-500/20"
                        : "bg-red-500/10 text-red-650 dark:text-red-400 hover:bg-red-500/20"
                        }`}
                    >
                      {userItem.isActive ? <><MdVerified size={10} />Active</> : <><FiXCircle size={10} />Suspended</>}
                    </button>
                  </div>

                  <h4 className="font-black text-base text-slate-900 dark:text-white mb-1 group-hover:text-[#E85D04] transition line-clamp-1">{userItem.name}</h4>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex items-center gap-1.5 truncate">
                    <FiMail size={12} className="shrink-0" />
                    <span className="truncate">{userItem.email}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50 flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Role</span>
                      <div className="w-28" onClick={(e) => e.stopPropagation()}>
                        <CustomDropdown
                          value={userItem.role}
                          onChange={(val) => handleRoleChange({stopPropagation:()=>{}}, userItem, val)}
                          options={[
                            { value: "user", label: "User" },
                            { value: "admin", label: "Admin" },
                          ]}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400 capitalize">{userItem.authProvider || "Local email"}</span>
                      <button onClick={(e) => handleDeleteClick(e, userItem._id)} className="p-1.5 text-slate-400 hover:text-red-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"><FiTrash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <AdminPagination isLoading={isLoading} isError={isError} pagination={pagination} />
      </div>

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
                onClick={() => deleteMutation.mutate(confirmDelete)}
                className="px-5 py-2 bg-red-500 hover:bg-red-650 text-white font-bold rounded-xl text-sm transition"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminPageLayout>
  );
};

export default Users;
