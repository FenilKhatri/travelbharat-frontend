import { useEffect, useState } from "react";
import "../App.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ScrollToTop from "../layout/core/ScrollToTop";
import ScrollToTopButton from "../components/ui/ScrollToTopButton";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

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

