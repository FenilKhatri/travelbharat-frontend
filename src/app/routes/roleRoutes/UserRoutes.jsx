import { lazy } from "react";
import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";

const UserProfile = lazy(() => import("../../../features/user/pages/Profile"));
const Trips = lazy(() => import("../../../features/user/pages/Trips"));
const Likes = lazy(() => import("../../../features/user/pages/Likes"));
const Settings = lazy(() => import("../../../features/user/pages/Settings"));
const SavedBlogs = lazy(() => import("../../../features/user/pages/SavedBlogs"));
const WriteBlog = lazy(() => import("../../../features/user/pages/WriteBlog"));
const TripDetails = lazy(() => import("../../../features/user/pages/TripDetails"));
const Notifications = lazy(() => import("../../../features/user/pages/Notifications"));
const UserRoutes = () => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.USER]} />}>
      <Route path="/user/profile" element={<UserProfile />} />
      <Route path="/user/trips" element={<Trips />} />
      <Route path="/user/likes" element={<Likes />} />
      <Route path="/user/settings" element={<Settings />} />
      <Route path="/user/saved-blogs" element={<SavedBlogs />} />
      <Route path="/user/write-blog" element={<WriteBlog />} />
      <Route path="/user/trips/:tripId" element={<TripDetails />} />
      <Route path="/user/notifications" element={<Notifications />} />
    </Route>
  </Route>
);

export default UserRoutes;

