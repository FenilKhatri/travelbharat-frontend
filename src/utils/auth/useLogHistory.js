import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { historyService } from "../../services/historyService";

export const useLogHistory = (data) => {
  const { user } = useAuth();

  useEffect(() => {
    // Only log if user is logged in and we have the necessary data
    if (user && data && data.entityId && data.entityTitle) {
      historyService.addHistory(data).catch(err => {
        // Silently fail if history logging fails, we don't want to disrupt the user experience
        console.error("Failed to log history", err);
      });
    }
  }, [user, data?.entityId]); 
};
