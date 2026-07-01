import { useHeroData } from "./hero/hooks/useHeroData";
import HeroBackground from "./hero/components/HeroBackground";
import HeroContent from "./hero/components/HeroContent";
import HeroImageCard from "./hero/components/HeroImageCard";
import HeroSliderControls from "./hero/components/HeroSliderControls";

const HeroSection = () => {
  const {
    statsData,
    sliderData,
    currentBanner,
    currentSlide,
    setCurrentSlide,
    setIsHovered} = useHeroData();

  return (
    <section className="relative min-h-screen overflow-hidden flex items-center bg-background">
      <HeroBackground currentBanner={currentBanner} />

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-[1700px] mx-auto px-6 lg:px-12 pt-28 pb-16">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <HeroContent
            currentBanner={currentBanner}
            currentSlide={currentSlide}
            statsData={statsData}
          />
          <HeroImageCard
            currentBanner={currentBanner}
            currentSlide={currentSlide}
            setIsHovered={setIsHovered}
          />
        </div>
      </div>

      <HeroSliderControls
        sliderData={sliderData}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
      />
    </section>
  );
};

export default HeroSection;