import { FiShield, FiActivity, FiCpu, FiUserCheck } from "react-icons/fi";
import { MdVerified, MdAccessibility, MdSecurity } from "react-icons/md";
import { FaStopwatch, FaFileMedical, FaHandshake, FaHeartbeat, FaStethoscope, FaHandHoldingHeart, FaDumbbell, FaClipboardCheck, FaBrain } from "react-icons/fa";

export const missionData = [
    {
        icon: MdSecurity,
        Title: "Safety",
        Theme: "bg-blue-500"
    },
    {
        icon: FaHandshake,
        Title: "Compassion",
        Theme: "bg-red-500"
    }, 
    {
        icon: FaStethoscope,
        Title: "Professional Care",
        Theme: "bg-emerald-500"
    }
]

export const cardData = [
    {
        name: "Verified Caregivers",
        description:
            "Every caregiver on our platform goes through a rigorous identity and qualification verification process.",
        icon: FiShield,
    },
    {
        name: "Medical Training",
        description:
            "Our network includes certified nurses, trained attendants, and licensed physiotherapists.",
        icon: FiActivity,
    },
    {
        name: "Background Checks",
        description:
            "Comprehensive criminal and reference checks are mandatory for all care professionals.",
        icon: MdVerified,
    },
    {
        name: "24/7 Supports",
        description:
            "Our dedicated care coordination team is available round the clock for any emergencies or assistance.",
        icon: FaStopwatch,
    },
    {
        name: "Personalized Plans",
        description:
            "Care Plans tailored specifically to the unique medical and personal needs of your elderly family members.",
        icon: FaFileMedical,
    },
    {
        name: "Trusted by Families",
        description:
            "Thousands of families rely on us daily for consistent, high-quality home healthcare.",
        icon: FaHandshake,
    },
];

export const stats = [
    { value: "10k+", label: "Families Served" },
    { value: "2k+", label: "Verified Caregivers" },
    { value: "50+", label: "Cities Covered" },
    { value: "98%", label: "Satisfaction Rate" },
];

export const visionItems = [
    {
        title: "Accessibility",
        icon: MdAccessibility,
        iconClass:
            "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
    },
    {
        title: "Trust",
        icon: FaHandshake,
        iconClass:
            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    },
    {
        title: "Technology",
        icon: FiCpu,
        iconClass:
            "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    },
    {
        title: "Care",
        icon: FaHeartbeat,
        iconClass:
            "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    },
];

export const processSteps = [
    {
        number: "01",
        title: "Register",
        description: "Create an account and set up a patient profile in minutes.",
        icon: MdVerified,
    },
    {
        number: "02",
        title: "Choose Service",
        description: "Select the healthcare service that best fits your needs.",
        icon: FaStethoscope,
    },
    {
        number: "03",
        title: "Select Caregiver",
        description: "Browse verified professionals and choose with confidence.",
        icon: FiUserCheck,
    },
    {
        number: "04",
        title: "Receive Care",
        description: "Get compassionate care delivered safely at home.",
        icon: FaHandshake,
    },
];

export const serviceItems = [
    {
        name: "Home Nursing Care",
        icon: FaStethoscope
    },
    {
        name: "Elderly Daily Assistance",
        icon: FaHandHoldingHeart
    }, 
    {
        name: "Physiotherapy at Home",
        icon: FaDumbbell
    },
    {
        name: "Post-Hospitalization Care",
        icon: FaClipboardCheck
    },
    {
        name: "Medical Attendants",
        icon: FiUserCheck
    },
    {
        name: "Dementia & Memory Support",
        icon: FaBrain
    }
];

export const testimonials = [
    {
        name: "Ritika Shah",
        role: "Daughter of a patient",
        review:
            "The caregiver was patient, skilled, and incredibly kind. We finally felt at peace knowing my mother was in safe hands.",
    },
    {
        name: "Amit Verma",
        role: "Family caregiver",
        review:
            "The process was simple, transparent, and fast. We found the right professional much quicker than expected.",
    },
    {
        name: "Neha Mehta",
        role: "Working professional",
        review:
            "Reliable support, professional communication, and genuine care. It felt like a modern healthcare service we could trust.",
    },
];
