import { lazy } from "react";
import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";

// Ensure these files exist or create placeholders for them
// const UserProfile = lazy(() => import("../../../features/user/pages/Profile"));
// const MyTrips = lazy(() => import("../../../features/user/pages/MyTrips"));
// const Wishlist = lazy(() => import("../../../features/user/pages/Wishlist"));
// const Settings = lazy(() => import("../../../features/user/pages/Settings"));

const SavedBlogs = lazy(() => import("../../../features/user/pages/SavedBlogs"));
const WriteBlog = lazy(() => import("../../../features/user/pages/WriteBlog"));
const Placeholder = () => <div className="pt-24 text-center min-h-screen">User Dashboard Placeholder</div>;

const UserRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.USER]} />}>
      <Route path="/user/profile" element={<Placeholder />} />
      <Route path="/user/trips" element={<Placeholder />} />
      <Route path="/user/wishlist" element={<Placeholder />} />
      <Route path="/user/settings" element={<Placeholder />} />
      <Route path="/user/saved-blogs" element={<SavedBlogs />} />
      <Route path="/user/write-blog" element={<WriteBlog />} />
    </Route>
  </Route>
);

export default UserRoutes;

