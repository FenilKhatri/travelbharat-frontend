import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getRedirectByRole } from "./roleRedirect";
import { handleChange as genericHandleChange } from "./handleChange";
import { useThrottle } from "../../hooks/useThrottle";

export const useAuthSubmit = ({
  apiCall,
  initialForm = {},
  validate,
  successMessage = "Success",
  fetchUserOnSuccess = false,
  navigateOnSuccess = false,
  onSuccessCallback}) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleChange = (e) => {
    genericHandleChange(e, setForm);
  };

  const executeSubmit = async () => {
    if (validate) {
      const errorMessage = validate(form);
      if (errorMessage) {
        toast.error(errorMessage);
        return;
      }
    }

    setLoading(true);

    try {
      const res = await apiCall(form);
      
      const responseData = res?.data || res;
      const message = responseData?.message;
      const user = responseData?.data?.user || responseData?.user;

      if (fetchUserOnSuccess && fetchUser) {
        await fetchUser();
      }

      if (navigateOnSuccess) {
        navigate(getRedirectByRole(user?.role));
      }

      toast.success(message || successMessage);

      if (onSuccessCallback) {
        onSuccessCallback(responseData);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const throttledSubmit = useThrottle(executeSubmit, 2000);

  const handleSubmit = (e) => {
    e?.preventDefault();
    throttledSubmit();
  };

  return {
    form,
    setForm,
    loading,
    handleChange,
    handleSubmit};
};
