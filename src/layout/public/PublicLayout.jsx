import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Suspense, memo } from "react";
import Footer from "../core/Footer";
import Navbar from "../core/Navbar";
import GlobalLoader from "../../components/ui/GlobalLoader";
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.5, ease: "easeOut" } },
  exit:    { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
};

const PublicLayout = memo(() => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background text-primary transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Suspense fallback={<GlobalLoader />}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
});

export default PublicLayout;
