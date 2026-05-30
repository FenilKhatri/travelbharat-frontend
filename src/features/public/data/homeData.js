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
        description: "Verified Caregivers",
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
        Title: "Nursing Care",
        Description: "Professional medical assistance including wound care, vital monitoring, and medication management."
    },
    {
        icon: FaHandshake,
        Title: "Elderly Assistance",
        Description: "Cornpassionate daily living support, companionship, and mobility assistance for seniors."
    },
    {
        icon: FaMale,
        Title: "Physiotherapy",
        Description: "Expert in-home rehabilitation, pain management, and personalized exercise programs."
    },
    {
        icon: FaBed,
        Title: "Post-Hospital Care",
        Description: "mooth transition from hospital to home with dedicated recovery and monitoring plans."
    },
]

export const doctors = [
    {
        name: "Dr. Sarah Lee",
        role: "Cardiologist",
        position: "top-20 left-40",
        iconBg: "bg-emerald-500/20",
        iconText: "text-emerald-400",
    },
    {
        name: "Dr. John Smith",
        role: "General Physician",
        position: "top-56 left-16",
        iconBg: "bg-cyan-500/20",
        iconText: "text-cyan-400",
    },
    {
        name: "Dr. Emily Watson",
        role: "Neurologist",
        position: "top-[27rem] left-16",
        iconBg: "bg-violet-500/20",
        iconText: "text-violet-400",
    },
    {
        name: "Dr. Michael Ray",
        role: "Pediatrician",
        position: "top-[38rem] left-40",
        iconBg: "bg-blue-500/20",
        iconText: "text-blue-400",
    },
];

export const features = [
    {
        icon: MdSecurity,
        theme: "text-red-500 bg-red-100",
        title: "Verified & Trusted Caregivers",
        desc: "All caregivers are background-checked and professionally trained to ensure safe and reliable home care.",
    },
    {
        icon: FaHandshake,
        theme: "text-blue-500 bg-blue-100",
        title: "Compassionate Support",
        desc: "We prioritize emotional well-being along with physical care for your loved ones.",
    },
    {
        icon: FiClock,
        theme: "text-orange-500 bg-orange-100",
        title: "Flexible Care Plans",
        desc: "From hourly visits to full-time support, choose services that fit your family’s needs.",
    },
];
