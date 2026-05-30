import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMail } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import { authService } from "../../../services/authService";
import logoDark from "../../../assets/logo_dark.png";
import logoLight from "../../../assets/logo_light.png";
import { toast } from "react-toastify";
import H2 from "../../../components/ui/H2";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
      toast.success("Password reset link sent to your email!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#050B14]">
      {/* Left Side - Cinematic Tourism Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1593693397690-362cb9666c6b?auto=format&fit=crop&q=80')" // Udaipur aesthetic
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14]/80 to-transparent"></div>
        </div>

        {/* Cultural Overlay Image */}
        <motion.img
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1.5 }}
          src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Mandala_svg.svg"
          alt="Mandala"
          className="absolute left-[-20%] top-[-10%] w-[600px] object-contain z-0 pointer-events-none mix-blend-overlay dark:mix-blend-screen"
        />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white max-w-xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
              Lost Your Way?
            </h1>
            <p className="text-lg text-slate-200 drop-shadow-md">
              Don't worry, every great traveler takes a wrong turn sometimes. Let's get you back on track to explore the wonders of Bharat.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[10%] right-[-10%] w-96 h-96 bg-[#D4A72C]/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none z-0"></div>

        <div className="w-full max-w-md relative z-10 bg-white/80 dark:bg-[#0A121F]/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 dark:border-white/5">
          <div className="flex justify-between items-center mb-8">
            <Link to="/auth" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#E85D04] transition-colors">
              <FiArrowLeft size={16} className="mr-1" /> Back to Login
            </Link>
            <Link to="/">
              <img src={logoDark} alt="Logo" className="h-10 w-auto object-contain dark:hidden" />
              <img src={logoLight} alt="Logo" className="h-10 w-auto object-contain hidden dark:block" />
            </Link>
          </div>

          <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
            <H2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Forgot Password
            </H2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter the email associated with your account and we'll send you a link to reset your password.
            </p>
          </motion.div>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
              <FiMail size={48} className="mx-auto text-green-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Check your email</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm px-4">
                We've sent a password reset link to <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-6">
                Try another email
              </Button>
            </motion.div>
          ) : (
            <motion.form onSubmit={handleSubmit} variants={stagger} initial="hidden" animate="show" className="space-y-5">
              <motion.div variants={fadeUp}>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E85D04] focus:border-transparent outline-none transition-all"
                  required
                />
              </motion.div>

              <motion.div variants={fadeUp}>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending link..." : "Send Reset Link"}
                </Button>
              </motion.div>
            </motion.form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

