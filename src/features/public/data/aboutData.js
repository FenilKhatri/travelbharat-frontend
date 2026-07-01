import { FiCompass, FiMap, FiHeart, FiBookOpen, FiCamera, FiGlobe, FiTarget, FiEye, FiStar } from "react-icons/fi";
import { FaMountain, FaLandmark } from "react-icons/fa";

export const missionData = [
    {
        icon: FiTarget,
        Title: "Authentic Travel",
        Theme: "bg-[#E85D04]"
    },
    {
        icon: FiHeart,
        Title: "Local Experiences",
        Theme: "bg-emerald-500"
    },
    {
        icon: FiGlobe,
        Title: "Discover India",
        Theme: "bg-blue-500"
    }
];

export const cardData = [
    {
        name: "Hidden Gems",
        description:
            "Discover lesser-known destinations that most tourists miss — from secluded valleys to forgotten temples.",
        icon: FiCompass},
    {
        name: "Cultural Heritage",
        description:
            "Explore India's rich cultural tapestry — ancient traditions, art forms, and centuries-old customs.",
        icon: FaLandmark},
    {
        name: "State Guides",
        description:
            "Comprehensive state-by-state travel guides with local insights, itineraries, and practical tips.",
        icon: FiMap},
    {
        name: "Local Experiences",
        description:
            "Immerse yourself in authentic local experiences — from street food walks to village homestays.",
        icon: FiHeart},
    {
        name: "Authentic Information",
        description:
            "Every piece of content is researched and verified to ensure you get reliable, authentic travel information.",
        icon: FiBookOpen},
    {
        name: "Visual Stories",
        description:
            "Beautiful photography and immersive visual storytelling that brings every destination to life.",
        icon: FiCamera},
];

export const stats = [
    { value: "36+", label: "States & UTs" },
    { value: "500+", label: "Cities Covered" },
    { value: "1000+", label: "Destinations" },
    { value: "100%", label: "Authentic" },
];

export const visionItems = [
    {
        title: "Explore",
        icon: FiCompass,
        iconClass:
            "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"},
    {
        title: "Heritage",
        icon: FaLandmark,
        iconClass:
            "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"},
    {
        title: "Nature",
        icon: FaMountain,
        iconClass:
            "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"},
    {
        title: "Culture",
        icon: FiGlobe,
        iconClass:
            "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"},
];

export const processSteps = [
    {
        number: "01",
        title: "Explore States",
        description: "Browse through India's diverse states and union territories.",
        icon: FiMap},
    {
        number: "02",
        title: "Discover Cities",
        description: "Find amazing cities within each state to plan your journey.",
        icon: FiGlobe},
    {
        number: "03",
        title: "Find Destinations",
        description: "Explore curated destinations with detailed travel information.",
        icon: FiCompass},
    {
        number: "04",
        title: "Plan & Travel",
        description: "Use our guides and tips to plan the perfect trip.",
        icon: FiStar},
];
