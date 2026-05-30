import { FiUser, FiHeart, FiMap, FiSettings } from "react-icons/fi";

export const userRoutes = [
    { to: "/user/profile", label: "My Profile", icon: FiUser },
    { to: "/user/trips", label: "My Trips", icon: FiMap },
    { to: "/user/wishlist", label: "Wishlist", icon: FiHeart },
    { to: "/user/settings", label: "Settings", icon: FiSettings },
];
