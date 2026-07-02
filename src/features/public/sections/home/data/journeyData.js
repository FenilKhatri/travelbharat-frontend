import { FiBookOpen, FiCalendar, FiCamera, FiCompass, FiMap, FiMapPin } from "react-icons/fi";

export const milestones = [
  {
    id: 1, title: "Discover States",
    desc: "Explore India's diverse states, cultures, and landscapes.",
    icon: FiCompass, cardIcon: FiCompass, align: "left", link: "/states"},
  {
    id: 2, title: "Explore Cities",
    desc: "Find iconic cities, hidden gems, and local experiences.",
    icon: FiMapPin, cardIcon: FiMapPin, align: "right", link: "/cities"},
  {
    id: 3, title: "Visit Destinations",
    desc: "Discover monuments, nature escapes, and must-visit attractions.",
    icon: FiMap, cardIcon: FiMap, align: "left", link: "/places"},
  {
    id: 4, title: "Experience Festivals",
    desc: "Immerse yourself in India's vibrant celebrations and traditions.",
    icon: FiCalendar, cardIcon: FiCalendar, align: "right", link: "/festivals"},
  {
    id: 5, title: "Plan Your Trip",
    desc: "Create personalized travel itineraries and save favorites.",
    icon: FiBookOpen, cardIcon: FiBookOpen, align: "left", link: "/user/trips"},
  {
    id: 6, title: "Create Memories",
    desc: "Capture unforgettable experiences and share your journey.",
    icon: FiCamera, cardIcon: FiCamera, align: "right", link: "/user/write-blog"},
];

/* Desktop: serpentine S-curve through center (x=50) */
export const CURVE_PATH_DESKTOP = [
  "M 50,0",
  "C 50,2  50,5  50,8.33",
  "C 20,14 20,19 50,25",
  "C 80,31 80,36 50,41.66",
  "C 20,47 20,53 50,58.33",
  "C 80,64 80,69 50,75",
  "C 20,81 20,86 50,91.66",
  "C 50,95 50,98 50,100",
].join(" ");

/* Mobile: gentle S-curve along the left edge (x≈10) */
export const CURVE_PATH_MOBILE = [
  "M 10,0",
  "C 10,2  10,4  10,8.33",
  "C 25,12 25,21 10,25",
  "C -5,29 -5,38 10,41.66",
  "C 25,46 25,54 10,58.33",
  "C -5,62 -5,71 10,75",
  "C 25,79 25,88 10,91.66",
  "C 10,95 10,98 10,100",
].join(" ");