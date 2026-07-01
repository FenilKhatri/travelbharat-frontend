import { FiMessageCircle, FiSend, FiCheck } from "react-icons/fi";
const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }};
const inputCls =
  "w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 focus:border-[#E85D04]/60 transition";
const ContactForm = ({ form, errors, mutation, handleSubmit, handleChange }) => {
  return (
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
  );
};
export default ContactForm;