import { FiChevronLeft, FiChevronRight, FiMapPin } from "react-icons/fi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Reveal from "../../../../../components/ui/Reveal";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const PlaceNearby = ({ place }) => {
  if (!place.nearbyAttractions?.length) return null;

  return (
    <SectionContainer className="bg-[#050505] overflow-hidden">
      <div className="max-w-[1600px] mx-auto px-4">
        <Reveal>
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl md:text-5xl font-black">Nearby Attractions</h2>
            <div className="flex gap-2">
              <button className="near-prev w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><FiChevronLeft size={24} /></button>
              <button className="near-next w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><FiChevronRight size={24} /></button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1.5}
              breakpoints={{
                640: { slidesPerView: 2.5 },
                1024: { slidesPerView: 4.5 }
              }}
              navigation={{ prevEl: '.near-prev', nextEl: '.near-next' }}
              autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              loop={true}
              className="pb-12"
            >
              {place.nearbyAttractions.map((attraction, idx) => (
                <SwiperSlide key={idx}>
                  <div className="group cursor-pointer">
                    <div className="w-full aspect-square rounded-[2rem] overflow-hidden mb-4 border border-white/10 group-hover:border-[#E85D04]/50 transition-colors relative shadow-xl">
                      {attraction.placeId?.images?.thumbnail ? (
                        <img src={attraction.placeId.images.thumbnail} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" loading="lazy" />
                      ) : (
                        <div className="w-full h-full bg-[#0a0a0a] flex items-center justify-center">
                          <FiMapPin className="text-white/20" size={40} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-1 group-hover:text-[#E85D04] transition-colors line-clamp-1">{attraction.placeId?.name || attraction.name}</h4>
                    {attraction.distance && <p className="text-white/50 text-sm font-medium">{attraction.distance}</p>}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
};

export default PlaceNearby;
