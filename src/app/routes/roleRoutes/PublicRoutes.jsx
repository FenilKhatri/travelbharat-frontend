import { lazy } from "react";
import { Route } from "react-router-dom";
import AuthPage from "../../../features/auth/forms/AuthPage";
import { ROLES } from "../../../utils/constants";

// Lazy load all public pages
const Home = lazy(() => import("../../../features/public/pages/Home"));
const States = lazy(() => import("../../../features/public/pages/States"));
const Cities = lazy(() => import("../../../features/public/pages/Cities"));
const StateDetails = lazy(() => import("../../../features/public/pages/StateDetails"));
const Places = lazy(() => import("../../../features/public/pages/Places"));
const PlaceDetails = lazy(() => import("../../../features/public/pages/PlaceDetails"));
const CityDetails = lazy(() => import("../../../features/public/pages/CityDetails"));
const Festivals = lazy(() => import("../../../features/public/pages/Festivals"));
const Blogs = lazy(() => import("../../../features/public/pages/Blogs"));
const BlogDetails = lazy(() => import("../../../features/public/pages/BlogDetails"));
const About = lazy(() => import("../../../features/public/pages/About"));
const ContactUs = lazy(() => import("../../../features/public/pages/ContactUs"));
const Privacypolicy = lazy(() => import("../../../features/public/pages/Privacypolicy"));
const TermsOfService = lazy(() => import("../../../features/public/pages/TermsOfService"));
const ForgotPassword = lazy(() => import("../../../features/auth/forms/ForgotPassword"));
const ResetPassword = lazy(() => import("../../../features/auth/forms/ResetPassword"));

const PublicRoutes = () => (
  <>
    <Route path="/" element={<Home />} />
    
    <Route path="/states" element={<States />} />
    <Route path="/cities" element={<Cities />} />
    <Route path="/states/:slug" element={<StateDetails />} />
    <Route path="/states/:stateSlug/cities/:citySlug" element={<CityDetails />} />
    
    <Route path="/places" element={<Places />} />
    <Route path="/places/:slug" element={<PlaceDetails />} />
    
    <Route path="/festivals" element={<Festivals />} />
    
    <Route path="/blogs" element={<Blogs />} />
    <Route path="/blogs/:slug" element={<BlogDetails />} />
    
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/privacy-policy" element={<Privacypolicy />} />
    <Route path="/terms-of-service" element={<TermsOfService />} />

    {/* AUTH */}
    <Route path="/auth" element={<AuthPage role={ROLES.USER} />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:token" element={<ResetPassword />} />
  </>
);

export default PublicRoutes;

