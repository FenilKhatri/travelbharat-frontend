import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "../core/Footer";
import Navbar from "../core/Navbar";

import { useEffect } from "react";

const PublicLayout = () => {
  const location = useLocation();

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="dark flex flex-col min-h-screen bg-slate-950 text-white transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;
