import { useEffect, useState } from "react";
import "../App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "../layout/core/ScrollToTop";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import AppRoutes from "./routes/AppRoutes";
import { useTheme } from "../hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <ScrollToTop />
      <ScrollToTopButton />
      <ToastContainer autoClose={5000} position="top-right" newestOnTop />
      <AppRoutes theme={theme} toggleTheme={toggleTheme} />
    </>
  );
}

export default App;

