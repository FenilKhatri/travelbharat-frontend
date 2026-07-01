import React from "react";
import TravelCard from "../components/cards/TravelCard";
import { regionCategories, placeCategories, festivalCategories } from "./categories";
import { BADGES_CONFIG, BADGE_OPTIONS } from "../config/badges.config";
import stateByStateImage from "../assets/images/state_by_state_image.jpg";

export const statesFeaturedCollections = [
  { title: "UNESCO Sites", subtitle: "World Heritage Wonders", image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=800&auto=format&fit=crop", badgeName: "UNESCO" },
  { title: "Royal Heritage", subtitle: "Palaces & Forts", image: "https://assets.architecturaldigest.in/photos/600838c57a5614cb87e4a051/16:9/w_2560%2Cc_limit/Umaid-Bhawan-1366x768.jpg", badgeName: "Royal Heritage" },
  { title: "Beach Paradise", subtitle: "Sun, Sand & Sea", image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop", badgeName: "Beach Paradise" },
  { title: "Mountain Escape", subtitle: "Himalayan Heights", image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop", badgeName: "Mountain Escape" },
  { title: "Hidden Gems", subtitle: "Off the Beaten Path", image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?q=80&w=800&auto=format&fit=crop", badgeName: "Hidden Gem" }
];

export const statesConfig = {
  endpoint: "/states",
  queryKeyPrefix: "publicStates",
  cardType: "state",
  CardComponent: TravelCard,
  heroImage: stateByStateImage,
  highlightText: "Incredible India",
  title: (
    <>
      Discover the Beauty of <br className="hidden md:block" /> India,{" "}
      <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E85D04] to-[#ff9b54]">
        State by State
      </span>
    </>
  ),
  subtitle: "From the mighty Himalayas in the north to the serene backwaters of the south, explore the incredible diversity of India.",
  searchPlaceholder: "Search states...",
  filters: [
    { key: "region", label: "Region", options: regionCategories },
    { key: "badge", label: "Category", options: BADGE_OPTIONS }
  ],
  sortOptions: [
    { value: "name", label: "Name (A - Z)" },
    { value: "-name", label: "Name (Z - A)" },
  ],
  emptyMessage: "No states found.",
  featuredCollections: statesFeaturedCollections,
  badgeConfig: BADGES_CONFIG
};

export const citiesFeaturedCollections = [
  { title: "Metro Cities", subtitle: "The Urban Pulse", image: "https://images.unsplash.com/photo-1570168007204-dfb528c6678f?q=80&w=800&auto=format&fit=crop", badgeName: "Most Popular" },
  { title: "Spiritual Hubs", subtitle: "Divine Destinations", image: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop", badgeName: "Spiritual Destination" },
  { title: "Heritage Cities", subtitle: "Living History", image: "https://images.unsplash.com/photo-1599661559882-628d05dd3621?q=80&w=800&auto=format&fit=crop", badgeName: "Royal Heritage" }
];

export const citiesConfig = {
  endpoint: "/cities",
  queryKeyPrefix: "publicCities",
  cardType: "city",
  CardComponent: TravelCard,
  heroImage: stateByStateImage,
  highlightText: "Urban India",
  title: (
    <>
      Discover the Heart of <br className="hidden md:block" /> India&#39;s{" "}
      <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E85D04] to-[#ff9b54]">
        Cities
      </span>
    </>
  ),
  subtitle: "From bustling metropolises to serene cultural hubs, find the next city for your adventure.",
  searchPlaceholder: "Search by city name...",
  filters: [
    { key: "badge", label: "Category", options: BADGE_OPTIONS }
  ],
  sortOptions: [
    { value: "name", label: "Name (A - Z)" },
    { value: "-name", label: "Name (Z - A)" },
  ],
  emptyMessage: "No cities found.",
  featuredCollections: citiesFeaturedCollections,
  badgeConfig: BADGES_CONFIG
};

export const placesFeaturedCollections = [
  { title: "Adventure Hubs", subtitle: "Thrill Seekers", image: "https://images.unsplash.com/photo-1522163182402-834f871fd851?q=80&w=800&auto=format&fit=crop", badgeName: "Adventure Hub" },
  { title: "Wildlife Havens", subtitle: "Into the Wild", image: "https://images.unsplash.com/photo-1574519961746-836f3eaae273?q=80&w=800&auto=format&fit=crop", badgeName: "Wildlife Haven" },
  { title: "Nature Retreats", subtitle: "Serene Landscapes", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format&fit=crop", badgeName: "Nature Retreat" }
];

export const getPlacesConfig = (stateOptions) => ({
  endpoint: "/places",
  queryKeyPrefix: "publicPlaces",
  cardType: "place",
  CardComponent: TravelCard,
  heroImage: stateByStateImage,
  highlightText: "Explore Destinations",
  title: (
    <>
      Discover the Perfect <br className="hidden md:block" /> Indian{" "}
      <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E85D04] to-[#ff9b54]">
        Destinations
      </span>
    </>
  ),
  subtitle: "Find the perfect spot for your next adventure. From majestic mountains to relaxing beaches.",
  searchPlaceholder: "Search destinations...",
  filters: [
    { key: "category", label: "Category", options: placeCategories },
    { key: "stateId", label: "State", options: stateOptions },
    { key: "badge", label: "Badge", options: BADGE_OPTIONS },
    {
      key: "budget", label: "Budget", options: [
        { value: "budget", label: "Budget" },
        { value: "moderate", label: "Moderate" },
        { value: "luxury", label: "Luxury" }
      ]
    }
  ],
  sortOptions: [
    { value: "-priority", label: "Featured First" },
    { value: "-createdAt", label: "Newest First" },
    { value: "-rating", label: "Highest Rated" },
    { value: "name", label: "Name (A - Z)" },
  ],
  emptyMessage: "No destinations found.",
  featuredCollections: placesFeaturedCollections,
  badgeConfig: BADGES_CONFIG
});

export const festivalsFeaturedCollections = [
  { title: "Cultural Treasures", subtitle: "Heritage & Traditions", image: "https://images.unsplash.com/photo-1533558701576-23c65e0272fb?q=80&w=800&auto=format&fit=crop", badgeName: "Cultural Treasure" },
  { title: "Festival Capitals", subtitle: "Grand Celebrations", image: "https://images.unsplash.com/photo-1603525166249-1e35a16bb5a3?q=80&w=800&auto=format&fit=crop", badgeName: "Festival Capital" },
  { title: "Spiritual Events", subtitle: "Divine Gatherings", image: "https://images.unsplash.com/photo-1542640244-7e672d6cb466?q=80&w=800&auto=format&fit=crop", badgeName: "Spiritual Destination" }
];

export const festivalsConfig = {
  endpoint: "/festivals",
  queryKeyPrefix: "publicFestivals",
  cardType: "festival",
  CardComponent: TravelCard,
  heroImage: stateByStateImage,
  highlightText: "Indian Celebrations",
  title: (
    <>
      Discover the Colors of <br className="hidden md:block" /> India&#39;s{" "}
      <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E85D04] to-[#ff9b54]">
        Festivals
      </span>
    </>
  ),
  subtitle: "From spectacular rituals to vibrant street fairs, experience the traditions that define India.",
  searchPlaceholder: "Search by festival name...",
  filters: [
    { key: "category", label: "Category", options: festivalCategories },
    { key: "badge", label: "Badge", options: BADGE_OPTIONS }
  ],
  sortOptions: [
    { value: "name", label: "Name (A - Z)" },
    { value: "-name", label: "Name (Z - A)" },
  ],
  emptyMessage: "No festivals found.",
  featuredCollections: festivalsFeaturedCollections,
  badgeConfig: BADGES_CONFIG
};
