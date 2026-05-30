import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiCheck } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import { authService } from "../../../services/authService";
import logoDark from "../../../assets/logo_dark.png";
import logoLight from "../../../assets/logo_light.png";
import { toast } from "react-toastify";
import H2 from "../../../components/ui/H2";
import { fadeUp, stagger } from "../../../animations/motionVariants";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return toast.error("Passwords do not match");
    if (password.length < 6) return toast.error("Password must be at least 6 characters");

    setLoading(true);
    try {
      await authService.resetPassword(token, password);
      setSuccess(true);
      toast.success("Password reset successful!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to reset password");
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
            backgroundImage: "url('https://images.unsplash.com/photo-1544985226-f49cecb7d6e4?auto=format&fit=crop&q=80')" // Golden temple / spiritual vibe
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#050B14]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white max-w-xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
              A New Beginning
            </h1>
            <p className="text-lg text-slate-200 drop-shadow-md">
              Secure your account and get back to discovering the magnificent heritage and culture of India.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="w-full max-w-md relative z-10 bg-white/80 dark:bg-[#0A121F]/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 dark:border-white/5">
          {/* Logo */}
          <div className="flex justify-center mb-6 shrink-0">
            <Link to="/">
              <img src={logoDark} alt="Logo" className="h-10 w-auto object-contain dark:hidden" />
              <img src={logoLight} alt="Logo" className="h-10 w-auto object-contain hidden dark:block" />
            </Link>
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <FiCheck size={64} className="mx-auto text-green-500 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Password Reset!</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
                Your password has been successfully reset. You can now login with your new credentials.
              </p>
              <Button onClick={() => navigate("/auth")} className="w-full">
                Proceed to Login
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div variants={fadeUp} initial="hidden" animate="show" className="mb-8">
                <H2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Create New Password
                </H2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Please enter your new password below.
                </p>
              </motion.div>

              <motion.form onSubmit={handleSubmit} variants={stagger} initial="hidden" animate="show" className="space-y-5">
                <motion.div variants={fadeUp}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E85D04] focus:border-transparent outline-none transition-all"
                    required
                    minLength={6}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#E85D04] focus:border-transparent outline-none transition-all"
                    required
                    minLength={6}
                  />
                </motion.div>

                <motion.div variants={fadeUp}>
                  <Button type="submit" disabled={loading} className="w-full mt-4">
                    {loading ? "Resetting..." : "Reset Password"}
                  </Button>
                </motion.div>
              </motion.form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

