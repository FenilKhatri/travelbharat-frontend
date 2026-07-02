import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import http from "../../../lib/axios";

export const useAdminMutations = ({ 
  queryKey, 
  updateEndpoint,
  deleteEndpoint,
  successDeleteMsg = "Deleted permanently!",
  successUpdateMsg = "Status updated successfully!"
}) => {
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }) => {
      const endpoint = updateEndpoint(id);
      const res = await http.put(endpoint, payload);
      return res;
    },
    onSuccess: (res) => {
      toast.success(res?.message || successUpdateMsg);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to update");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const endpoint = deleteEndpoint(id);
      const res = await http.delete(endpoint);
      return res;
    },
    onSuccess: (res) => {
      toast.success(res?.message || successDeleteMsg);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to delete");
    }
  });

  const toggleStatus = (id, currentStatus) => {
    updateMutation.mutate({ id, payload: { isActive: !currentStatus } });
  };

  return {
    updateMutation,
    deleteMutation,
    toggleStatus
  };
};
