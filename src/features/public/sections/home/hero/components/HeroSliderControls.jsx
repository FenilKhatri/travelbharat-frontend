import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const HeroSliderControls = ({ sliderData, currentSlide, setCurrentSlide }) => {
  if (!sliderData || sliderData.length <= 1) return null;

  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-white/60 dark:bg-black/40 backdrop-blur-xl px-5 py-2.5 rounded-full border border-white/40 dark:border-white/10 shadow-lg">
      <button
        onClick={() => setCurrentSlide((prev) => (prev - 1 + sliderData.length) % sliderData.length)}
        className="p-1.5 text-slate-700 dark:text-white hover:text-[#E85D04] transition cursor-pointer"
      >
        <FiChevronLeft size={20} />
      </button>

      <div className="flex gap-2">
        {sliderData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentSlide === idx ? "w-6 bg-[#E85D04]" : "w-2 bg-slate-400/50"
            }`}
          />
        ))}
      </div>

      <button
        onClick={() => setCurrentSlide((prev) => (prev + 1) % sliderData.length)}
        className="p-1.5 text-slate-700 dark:text-white hover:text-[#E85D04] transition cursor-pointer"
      >
        <FiChevronRight size={20} />
      </button>
    </div>
  );
};

export default HeroSliderControls;
