export const CATEGORIES = [
  "religious",
  "cultural",
  "harvest",
  "national",
  "seasonal",
  "other",
];

export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

export const state_regions = [
  { value: "north", label: "North India" },
  { value: "south", label: "South India" },
  { value: "east", label: "East India" },
  { value: "west", label: "West India" },
  { value: "central", label: "Central India" },
  { value: "northeast", label: "Northeast India" },
];

export const state_filters = [
  {
    key: "region",
    label: "Region",
    options: state_regions},
  {
    key: "featured",
    label: "Featured",
    options: [
      { value: "true", label: "Featured" },
      { value: "false", label: "Non-Featured" },
    ]},
];

export const fest_categories = [
  { value: "religious", label: "Religious" },
  { value: "cultural", label: "Cultural" },
  { value: "harvest", label: "Harvest" },
  { value: "seasonal", label: "Seasonal" },
  { value: "national", label: "National" },
];

export const fest_filters = [
  {
    key: "category",
    label: "Category",
    options: fest_categories},
];

export const places_category = [
  { value: "heritage", label: "Heritage & History" },
  { value: "nature", label: "Nature & Landscapes" },
  { value: "temple", label: "Temples & Spiritual" },
  { value: "beach", label: "Beaches & Coastal" },
  { value: "hill-station", label: "Hill Stations" },
  { value: "wildlife", label: "Wildlife & Safaris" },
  { value: "adventure", label: "Adventure Sports" },
  { value: "museum", label: "Museums & Arts" },
  { value: "fort", label: "Forts & Palaces" },
  { value: "garden", label: "Parks & Gardens" },
  { value: "lake", label: "Lakes & Rivers" },
  { value: "waterfall", label: "Waterfalls" },
  { value: "market", label: "Markets & Shopping" },
  { value: "religious", label: "Religious Sites" },
  { value: "modern", label: "Modern Attractions" },
  { value: "other", label: "Other" },
];

export const places_filters = [
  {
    key: "category",
    label: "Category",
    options: places_category},
  {
    key: "budget",
    label: "Budget",
    options: [
      { value: "budget", label: "Budget Friendly" },
      { value: "moderate", label: "Moderate" },
      { value: "luxury", label: "Luxury" },
    ]},
];
