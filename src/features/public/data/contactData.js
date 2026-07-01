import { FiMail, FiMessageCircle, FiPhone, FiMapPin } from "react-icons/fi";

export const subjectOptions = [
    { value: "general", label: "General Inquiry" },
    { value: "feedback", label: "Feedback" },
    { value: "suggestion", label: "Destination Suggestion" },
    { value: "partnership", label: "Partnership Inquiry" },
    { value: "bug-report", label: "Bug Report" },
    { value: "content", label: "Content Correction" },
    { value: "other", label: "Other" },
];

export const contactItems = [
    {
        icon: FiPhone,
        name: "Contact",
        title: "Call Us",
        description: "Available Mon–Sat, 9 AM – 7 PM.",
        value: "+91 93134 07400",
        href: "tel:+919313407400",
        style: "bg-blue-100 text-blue-700"},
    {
        icon: FiMessageCircle,
        title: "WhatsApp",
        name: "Whatsapp",
        description: "Chat with us instantly.",
        value: "+91 93134 07400",
        href: "https://wa.me/919313407400",
        style: "bg-emerald-100 text-emerald-700"},
    {
        icon: FiMail,
        title: "Email",
        name: "Email",
        description: "Send us your questions anytime.",
        value: "fenilkhatri931@gmail.com",
        href: "mailto:fenilkhatri931@gmail.com",
        style: "bg-red-100 text-red-700"},
    {
        icon: FiMapPin,
        title: "Location",
        name: "Location",
        description: "Our base of operations.",
        value: "Surat, Gujarat, India",
        href: null,
        style: "bg-orange-100 text-orange-700"},
];
