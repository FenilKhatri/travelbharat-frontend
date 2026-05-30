import { Route } from "react-router-dom";
import { ROLES } from "../../../utils/constants";
import ProtectedRoute from "../ProtectedRoute";
import RoleRoute from "../RoleRoutes";
import DashboardLayout from "../../../layout/dashboard/DashboardLayout";

import Dashboard from "../../../features/admin/pages/Dashboard";
import Profile from "../../../features/admin/pages/Profile";
import Places from "../../../features/admin/pages/Places";
import States from "../../../features/admin/pages/States";
import Users from "../../../features/admin/pages/Users";
import Reviews from "../../../features/admin/pages/Reviews";
import Settings from "../../../features/admin/pages/Settings";
import Trips from "../../../features/admin/pages/Trips";
import Notifications from "../../../features/admin/pages/Notifications";
import Festivals from "../../../features/admin/pages/Festivals";
import Blogs from "../../../features/admin/pages/Blogs";
import Cities from "../../../features/admin/pages/Cities";
import CityForm from "../../../features/admin/pages/CityForm";
import StateForm from "../../../features/admin/pages/StateForm";
import AdminPageNotFound from "../../../features/admin/pages/AdminPageNotFound";

const AdminRoutes = ({ theme, toggleTheme }) => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
      <Route
        element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}
      >
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/places" element={<Places />} />
        <Route path="/admin/states" element={<States />} />
        <Route path="/admin/states/create" element={<StateForm />} />
        <Route path="/admin/states/edit/:id" element={<StateForm />} />
        <Route path="/admin/cities" element={<Cities />} />
        <Route path="/admin/cities/create" element={<CityForm />} />
        <Route path="/admin/cities/edit/:id" element={<CityForm />} />
        <Route path="/admin/festivals" element={<Festivals />} />
        <Route path="/admin/blogs" element={<Blogs />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/reviews" element={<Reviews />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/trips" element={<Trips />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="*" element={<AdminPageNotFound />} />
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;

