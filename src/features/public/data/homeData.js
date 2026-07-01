import { FaBed, FaProjectDiagram, FaHeadset, FaHandshake, FaMale, FaStethoscope } from "react-icons/fa";
import { FiClock, FiStar, FiUser } from "react-icons/fi";
import { MdSecurity } from "react-icons/md";

export const counts = [
    {
        icon: FiUser,
        number: "1,000+",
        description: "Familied Serverd",
        theme: "text-blue-500"
    },
    {
        icon: MdSecurity,
        number: "500+",
        description: "Verified Guides",
        theme: "text-emerald-500"
    },
    {
        icon: FiStar,
        number: "4.9/5.0",
        description: "Average Rating",
        theme: "text-yellow-500"
    },
    {
        icon: FaHeadset,
        number: "24/7",
        description: "Active Support",
        theme: "text-purple-500"
    },
];

export const services = [
    {
        icon: FaStethoscope,
        Title: "Travel Planning",
        Description: "Professional travel assistance including itinerary planning, booking, and management."
    },
    {
        icon: FaHandshake,
        Title: "Local Guides",
        Description: "Compassionate local support, companionship, and cultural assistance for travelers."
    },
    {
        icon: FaMale,
        Title: "Adventure Sports",
        Description: "Expert guided adventure sports, safety management, and personalized experiences."
    },
    {
        icon: FaBed,
        Title: "Hotel Booking",
        Description: "Smooth transition from destination to destination with dedicated stay arrangements."
    },
]

export const doctors = [
    {
        name: "Dr. Sarah Lee",
        role: "Cardiologist",
        position: "top-20 left-40",
        iconBg: "bg-emerald-500/20",
        iconText: "text-emerald-400"},
    {
        name: "Dr. John Smith",
        role: "General Physician",
        position: "top-56 left-16",
        iconBg: "bg-cyan-500/20",
        iconText: "text-cyan-400"},
    {
        name: "Dr. Emily Watson",
        role: "Neurologist",
        position: "top-[27rem] left-16",
        iconBg: "bg-violet-500/20",
        iconText: "text-violet-400"},
    {
        name: "Dr. Michael Ray",
        role: "Pediatrician",
        position: "top-[38rem] left-40",
        iconBg: "bg-blue-500/20",
        iconText: "text-blue-400"},
];

export const features = [
    {
        icon: MdSecurity,
        theme: "text-red-500 bg-red-100",
        title: "Verified & Trusted Guides",
        desc: "All local guides are background-checked and professionally trained to ensure safe and reliable travel experiences."},
    {
        icon: FaHandshake,
        theme: "text-blue-500 bg-blue-100",
        title: "24/7 Support",
        desc: "We prioritize your safety and well-being along with unforgettable experiences."},
    {
        icon: FiClock,
        theme: "text-orange-500 bg-orange-100",
        title: "Flexible Travel Plans",
        desc: "From weekend getaways to month-long expeditions, choose plans that fit your needs."},
];
