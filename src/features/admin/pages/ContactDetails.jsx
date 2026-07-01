import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import http from "../../../lib/axios";
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiMessageSquare } from "react-icons/fi";

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ['contactInquiry', id],
    queryFn: () => http.get(`/contact/${id}`)
  });

  if (isLoading) return <div className="p-8 text-[#E85D04]">Loading inquiry details...</div>;

  const inquiry = data?.data?.contact || data?.data?.data || null;

  if (!inquiry) {
    return (
      <div className="p-8 text-slate-500 flex flex-col items-start gap-4">
        <div>Inquiry not found. It may have been deleted.</div>
        <button onClick={() => navigate(-1)} className="text-[#E85D04] font-bold flex items-center gap-2 hover:underline">
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-slate-800 dark:hover:text-white mb-6 transition"
      >
        <FiArrowLeft />
        <span className="font-semibold text-sm">Back to Dashboard</span>
      </button>

      <div className="max-w-3xl">
        <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-8">Inquiry Details</h1>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm"
        >
          <div className="flex justify-between items-start mb-8 pb-8 border-b border-slate-100 dark:border-slate-800/40">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">{inquiry.subject}</h2>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                inquiry.status === "new" ? "bg-red-500/10 text-red-500" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
              }`}>
                {inquiry.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                <FiUser size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Sender Name</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">{inquiry.name}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0">
                <FiMail size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Email Address</p>
                <a href={`mailto:${inquiry.email}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-orange-500 transition">{inquiry.email}</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0">
                <FiCalendar size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Date Submitted</p>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {new Date(inquiry.createdAt).toLocaleString("en-US", { 
                    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" 
                  })}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800/40">
            <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-widest mb-4">
              <FiMessageSquare /> Message Content
            </div>
            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
              {inquiry.message}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactDetails;