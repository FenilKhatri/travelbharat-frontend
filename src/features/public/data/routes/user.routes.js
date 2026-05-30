import { FiUser, FiHeart, FiMap, FiSettings, FiBookmark, FiEdit3 } from "react-icons/fi";

export const userRoutes = [
    { to: "/user/profile", label: "My Profile", icon: FiUser },
    { to: "/user/trips", label: "My Trips", icon: FiMap },
    { to: "/user/wishlist", label: "Wishlist", icon: FiHeart },
    { to: "/user/saved-blogs", label: "Saved Blogs", icon: FiBookmark },
    { to: "/user/write-blog", label: "Write Blog", icon: FiEdit3 },
    { to: "/user/settings", label: "Settings", icon: FiSettings },
];
