import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiLock, FiEye, FiEyeOff, FiCheck } from "react-icons/fi";
import Button from "../../../components/ui/Button";
import { authService } from "../../../services/authService";
import logoDark from "../../../assets/logo_dark.png";
import logoLight from "../../../assets/logo_light.png";
import H2 from "../../../components/ui/H2";
import { fadeUp } from "../../../animations/motionVariants";
import { useAuthSubmit } from "../../../utils/auth/useAuthSubmit";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const { form, setForm, loading, handleChange, handleSubmit } = useAuthSubmit({
    apiCall: (data) => authService.resetPassword(token, data.password),
    initialForm: { password: "", confirmPassword: "" },
    successMessage: "Password reset successfully! You can now log in.",
    validate: (currentForm) => {
      if (!currentForm.password || !currentForm.confirmPassword) {
        return "Please fill in all fields";
      }
      if (currentForm.password !== currentForm.confirmPassword) {
        return "Passwords do not match";
      }
      if (currentForm.password.length < 6) {
        return "Password must be at least 6 characters";
      }
      return null;
    },
    onSuccessCallback: () => {
      setSuccess(true);
    }});

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#050B14]">
      {/* Left Side - Cinematic Tourism Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1544569300-36a53f068525?auto=format&fit=crop&q=80')" // Kerala Backwaters aesthetic
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#050B14]/80 to-transparent"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white max-w-xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
              Secure Your Journey
            </h1>
            <p className="text-lg text-slate-200 drop-shadow-md">
              A new password is like a new compass. Set it right, and continue your exploration of incredible destinations with peace of mind.
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
                <div className="w-12 h-12 bg-[#E85D04]/10 rounded-xl flex items-center justify-center mb-6">
                  <FiLock size={24} className="text-[#E85D04]" />
                </div>
                <H2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Create New Password
                </H2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Your new password must be different from previous used passwords.
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 focus:border-[#E85D04]/50 transition-all"
                      placeholder="At least 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-2">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/30 focus:border-[#E85D04]/50 transition-all"
                    placeholder="Confirm new password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 text-base font-bold ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                >
                  {loading ? "Resetting Password..." : "Reset Password"}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
