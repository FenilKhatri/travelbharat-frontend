import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { contactService } from "../../../../../services/contactService";
import { useThrottle } from "../../../../../hooks/useThrottle";

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

export const useContactForm = () => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const mutation = useMutation({
    mutationFn: (data) => contactService.submitContact(data),
    onSuccess: () => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setForm(INITIAL_FORM);
      setErrors({});
    },
    onError: (err) => {
      toast.error(err?.message || "Failed to send message. Please try again.");
    }});

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Enter a valid email";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const throttledSubmit = useThrottle(() => {
    if (validate()) {
      mutation.mutate(form);
    }
  }, 2000); // 2 second throttle

  const handleSubmit = (e) => {
    e.preventDefault();
    throttledSubmit();
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return {
    form,
    errors,
    mutation,
    handleSubmit,
    handleChange};
};
