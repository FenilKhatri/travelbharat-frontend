import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App.jsx';
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from './context/AuthContext.jsx';
import { LoaderProvider } from "./context/LoaderContext.jsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/react-query.js';

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <LoaderProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </LoaderProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

