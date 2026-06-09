import { Navigate, Outlet, useLocation } from "react-router-dom";
import GlobalLoader from "../../components/ui/GlobalLoader";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <GlobalLoader />;

  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;

  return <Outlet />;
};

export default ProtectedRoute;

