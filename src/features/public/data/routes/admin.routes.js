import { MdDashboard } from "react-icons/md";
import { FiUsers, FiMapPin, FiMap, FiStar, FiSettings, FiUser, FiNavigation, FiBell, FiBookOpen, FiShield } from "react-icons/fi";
import { FaCalendarCheck, FaBuilding } from "react-icons/fa";
import { FiHome } from "react-icons/fi";

export const adminRoutes = [
  {
    to: "/",
    label: "Home",
    icon: FiHome},
  {
    to: "/admin/dashboard",
    label: "Dashboard",
    icon: MdDashboard},
  {
    to: "/admin/states",
    label: "States",
    icon: FiMap},
  {
    to: "/admin/cities",
    label: "Cities",
    icon: FaBuilding},
  {
    to: "/admin/places",
    label: "Destinations",
    icon: FiMapPin},
  {
    to: "/admin/festivals",
    label: "Festivals",
    icon: FaCalendarCheck},
  {
    to: "/admin/blogs",
    label: "Blogs",
    icon: FiBookOpen},
  {
    to: "/admin/moderation",
    label: "Moderation",
    icon: FiShield},
  {
    to: "/admin/trips",
    label: "Trips",
    icon: FiNavigation},
  {
    to: "/admin/users",
    label: "Users",
    icon: FiUsers},
  {
    to: "/admin/reviews",
    label: "Reviews",
    icon: FiStar},
  {
    to: "/admin/settings",
    label: "Settings",
    icon: FiSettings},
  {
    to: "/admin/notifications",
    label: "Notifications",
    icon: FiBell},
];

