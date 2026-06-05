import { Routes, Route } from "react-router-dom";
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
import AdminModeration from "../../../features/admin/pages/AdminModeration";
import ContactDetails from "../../../features/admin/pages/ContactDetails";
import Festivals from "../../../features/admin/pages/Festivals";
import Blogs from "../../../features/admin/pages/Blogs";
import BlogForm from "../../../features/admin/pages/BlogForm";
import Cities from "../../../features/admin/pages/Cities";
import CityForm from "../../../features/admin/pages/CityForm";
import StateForm from "../../../features/admin/pages/StateForm";
import StateDetails from "../../../features/admin/pages/StateDetails";
import CityDetails from "../../../features/admin/pages/CityDetails";
import PlaceDetails from "../../../features/admin/pages/PlaceDetails";
import AdminPlaceForm from "../../../features/admin/pages/PlaceForm";
import FestivalForm from "../../../features/admin/pages/FestivalForm";
import UserDetails from "../../../features/admin/pages/UserDetails";
import ReviewDetails from "../../../features/admin/pages/ReviewDetails";
import TripDetails from "../../../features/admin/pages/TripDetails";
import BlogDetails from "../../../features/admin/pages/BlogDetails";
import AdminPageNotFound from "../../../features/admin/pages/AdminPageNotFound";

import FestivalDetails from "../../../features/admin/pages/FestivalDetails";
const AdminRoutes = ({ theme, toggleTheme }) => (
  <Route element={<ProtectedRoute />}>
    <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
      <Route
        element={<DashboardLayout theme={theme} toggleTheme={toggleTheme} />}
      >
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/places" element={<Places />} />
        <Route path="/admin/places/:id" element={<PlaceDetails />} />
        <Route path="/admin/places/create" element={<AdminPlaceForm />} />
        <Route path="/admin/places/edit/:id" element={<AdminPlaceForm />} />
        <Route path="/admin/states" element={<States />} />
        <Route path="/admin/states/:id" element={<StateDetails />} />
        <Route path="/admin/states/create" element={<StateForm />} />
        <Route path="/admin/states/edit/:id" element={<StateForm />} />
        <Route path="/admin/cities" element={<Cities />} />
        <Route path="/admin/cities/:id" element={<CityDetails />} />
        <Route path="/admin/cities/create" element={<CityForm />} />
        <Route path="/admin/cities/edit/:id" element={<CityForm />} />
        <Route path="/admin/festivals" element={<Festivals />} />
        <Route path="/admin/festivals/:id" element={<FestivalDetails />} />
        <Route path="/admin/festivals/create" element={<FestivalForm />} />
        <Route path="/admin/festivals/edit/:id" element={<FestivalForm />} />
        <Route path="/admin/blogs" element={<Blogs />} />
        <Route path="/admin/blogs/:id" element={<BlogDetails />} />
        <Route path="/admin/blogs/create" element={<BlogForm />} />
        <Route path="/admin/blogs/edit/:id" element={<BlogForm />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/users/:id" element={<UserDetails />} />
        <Route path="/admin/reviews" element={<Reviews />} />
        <Route path="/admin/reviews/:id" element={<ReviewDetails />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/trips" element={<Trips />} />
        <Route path="/admin/trips/:id" element={<TripDetails />} />
        <Route path="/admin/moderation" element={<AdminModeration />} />
        <Route path="/admin/contact/:id" element={<ContactDetails />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/admin/*" element={<AdminPageNotFound />} />
      </Route>
    </Route>
  </Route>
);

export default AdminRoutes;
