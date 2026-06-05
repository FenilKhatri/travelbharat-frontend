import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheck, FiMessageCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { contactService } from "../../../services/contactService";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 focus:border-[#E85D04]/60 transition";

const contactInfo = [
  {
    icon: FiMail,
    title: "Email Us",
    value: "fenilkhatri931@gmail.com",
    href: "mailto:fenilkhatri931@gmail.com",
    description: "Send us your questions anytime.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: FiPhone,
    title: "Call Us",
    value: "+91 93134 07400",
    href: "tel:+919313407400",
    description: "Available Mon–Sat, 9 AM – 7 PM.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    icon: FiMapPin,
    title: "Visit Us",
    value: "Surat, Gujarat, India",
    href: null,
    description: "Our base of operations.",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
];

const INITIAL_FORM = { name: "", email: "", subject: "", message: "" };

const ContactUs = () => {
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
    },
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      mutation.mutate(form);
    }
  };

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A1628]">
      {/*  Hero  */}
      <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1628] via-[#0E1E36] to-[#162544]" />
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 right-20 w-72 h-72 bg-[#E85D04]/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <motion.div {...fadeUp}>
            <span className="text-[#E85D04] font-bold tracking-widest uppercase text-xs mb-4 block">
              — Get In Touch —
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
              Contact{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E85D04] to-[#FFA647]">
                Us
              </span>
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl mx-auto">
              Have a question, suggestion, or feedback? We'd love to hear from you.
              Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/*  Contact Info Cards  */}
      <section className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {contactInfo.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-[#0D1526] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                <item.icon size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                {item.description}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="text-[#E85D04] font-semibold text-sm hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <span className="text-[#E85D04] font-semibold text-sm">{item.value}</span>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/*  Contact Form  */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div {...fadeUp}>
            <div className="bg-white dark:bg-[#0D1526] rounded-3xl border border-slate-100 dark:border-slate-800/50 shadow-xl p-8 md:p-12">
              <div className="text-center mb-10">
                <div className="w-14 h-14 rounded-xl bg-[#E85D04]/10 flex items-center justify-center mx-auto mb-4">
                  <FiMessageCircle size={28} className="text-[#E85D04]" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                  Send Us a Message
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Name <span className="text-[#E85D04]">*</span>
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      placeholder="Your full name"
                      className={`${inputCls} ${errors.name ? "border-red-400 focus:ring-red-300/40" : ""}`}
                    />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                      Email <span className="text-[#E85D04]">*</span>
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="you@example.com"
                      className={`${inputCls} ${errors.email ? "border-red-400 focus:ring-red-300/40" : ""}`}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Subject <span className="text-[#E85D04]">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    placeholder="What's this about?"
                    className={`${inputCls} ${errors.subject ? "border-red-400 focus:ring-red-300/40" : ""}`}
                  />
                  {errors.subject && <p className="text-xs text-red-500 mt-1">{errors.subject}</p>}
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">
                    Message <span className="text-[#E85D04]">*</span>
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    placeholder="Your message..."
                    className={`${inputCls} resize-none ${errors.message ? "border-red-400 focus:ring-red-300/40" : ""}`}
                  />
                  {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full py-4 bg-[#E85D04] hover:bg-[#D05203] disabled:opacity-60 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#E85D04]/20"
                >
                  {mutation.isPending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : mutation.isSuccess ? (
                    <>
                      <FiCheck size={20} /> Message Sent!
                    </>
                  ) : (
                    <>
                      <FiSend size={18} /> Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
