import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Login from "../../auth/forms/Login";
import Register from "../../auth/forms/Register";
import { fadeUp } from "../../../animations/motionVariants.js"
import H2 from "../../../components/ui/H2"
import logoDark from "../../../assets/logo_dark.png";
import logoLight from "../../../assets/logo_light.png";

const AuthPage = ({ role = "user" }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#050B14]">
      {/* Left Side - Cinematic Tourism Visual */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&auto=format&fit=crop&w=2071&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-linear-to-r from-[#050B14]/80 to-transparent"></div>
        </div>

        {/* Cultural Overlay Image */}
        <motion.img
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1.5 }}
          src="https://upload.wikimedia.org/wikipedia/commons/4/41/Kathakali_Face_Art.png"
          alt="Kathakali"
          className="absolute left-[-10%] top-[20%] w-96 object-contain z-0 pointer-events-none mix-blend-overlay dark:mix-blend-screen"
        />

        <div className="relative z-10 flex flex-col justify-center p-12 text-white max-w-xl">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-4 tracking-widest uppercase border border-white/30">
              TravelBharat Exclusive
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight drop-shadow-lg">
              Unlock the Hidden <span className="text-[#E85D04]">Gems of India</span>
            </h1>
            <p className="text-lg text-slate-200 drop-shadow-md">
              Join thousands of travelers exploring the vibrant culture, rich heritage, and majestic landscapes of Bharat. Plan, book, and experience India like never before.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-10 md:py-15 lg:py-30 relative overflow-hidden">
        {/* Decorative elements for right side */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#E85D04]/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none z-0"></div>

        <div className="w-full max-w-md relative z-10 bg-white/80 dark:bg-[#0A121F]/80 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white/20 dark:border-white/5">
          {/* Logo */}
          <div className="flex justify-center mb-6 shrink-0">
            <Link to="/">
              <img src={logoDark} alt="Logo" className="h-20 w-auto object-contain dark:hidden" />
              <img src={logoLight} alt="Logo" className="h-20 w-auto object-contain hidden dark:block" />
            </Link>
          </div>

          {/* Heading */}
          <motion.div
            key={isLogin ? "login-title" : "register-title"}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-8 text-center"
          >
            <H2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {isLogin
                ? "Welcome back Explorer"
                : "Begin Your Journey"}
            </H2>

            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {isLogin
                ? "Log in to access your saved trips and exclusive deals."
                : "Create an account to unlock premium tourism experiences."}
            </p>
          </motion.div>

          {/* Toggle */}
          <div className="flex mb-8 bg-slate-100 dark:bg-[#1E293B] rounded-xl p-1 shadow-inner">
            <button
              onClick={() => setIsLogin(true)}
              className={`w-1/2 py-2.5 rounded-lg text-sm font-semibold transition-all ${isLogin
                ? "bg-white dark:bg-[#050B14] text-[#E85D04] shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              Login
            </button>

            <button
              onClick={() => setIsLogin(false)}
              className={`w-1/2 py-2.5 rounded-lg text-sm font-semibold transition-all ${!isLogin
                ? "bg-white dark:bg-[#050B14] text-[#E85D04] shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
            >
              Signup
            </button>
          </div>

          {/* Forms */}
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div key="login" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.2 }}>
                <Login role={role} />
              </motion.div>
            ) : (
              <motion.div key="register" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <Register role={role} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
