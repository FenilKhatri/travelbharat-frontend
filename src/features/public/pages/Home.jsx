import HeroSection from "../sections/home/HeroSection";
import FeaturedStates from "../sections/home/FeaturedStates";
import TrendingPlaces from "../sections/home/TrendingPlaces";
import TravelCategories from "../sections/home/TravelCategories";
import Newsletter from "../sections/home/Newsletter";
import FestivalsSection from "../sections/home/FestivalsSection";
import BlogsSection from "../sections/home/BlogsSection";

const Home = () => {
  return (
    <div className="bg-slate-50 dark:bg-[#0A1628]">
      <HeroSection />
      <FeaturedStates />
      <TrendingPlaces />
      <TravelCategories />
      <FestivalsSection />
      <BlogsSection />
      <Newsletter />
    </div>
  );
};

export default Home;

