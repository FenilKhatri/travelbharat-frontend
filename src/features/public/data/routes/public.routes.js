export const publicRoutes = [
    { to: "/", label: "Home" },
    { to: "/states", label: "States" },
    { to: "/cities", label: "Cities" },
    { to: "/states/:slug", label: "State Details" },
    { to: "/states/:stateSlug/cities/:citySlug", label: "City Details" },
    { to: "/places", label: "Destinations" },
    { to: "/places/:slug", label: "Place Details" },
    { to: "/festivals", label: "Festivals" },

    { to: "/blogs", label: "Blogs" },
    { to: "/blog/:slug", label: "Blog Details" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/privacy-policy", label: "Privacy Policy" },
    { to: "/terms-of-service", label: "Terms of Service" },
];

export const authRoutes = [
    { to: "/auth", label: "Login" }
];

export const navLinks = [
    { path: "/", name: "Home" },

    { path: "/states", name: "States" },
    { path: "/cities", name: "Cities" },
    { path: "/places", name: "Destinations" },
    { path: "/festivals", name: "Festivals" },
    { path: "/blogs", name: "Culture & Blogs" },
];