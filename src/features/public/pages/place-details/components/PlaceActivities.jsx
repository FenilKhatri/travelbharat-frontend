import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import Reveal from "../../../../../components/ui/Reveal";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const PlaceActivities = ({ place, heroImage }) => {
  if (!place.activities?.length) return null;

  return (
    <SectionContainer className="bg-[#0a0a0a]">
      <div className="max-w-[1600px] mx-auto px-4">
        <Reveal>
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl md:text-5xl font-black">Top Activities</h2>
            <div className="flex gap-2">
              <button className="act-prev w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><FiChevronLeft size={24} /></button>
              <button className="act-next w-12 h-12 rounded-full border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors"><FiChevronRight size={24} /></button>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="-mx-4 px-4 sm:mx-0 sm:px-0">
            <Swiper
              modules={[Autoplay, Navigation]}
              spaceBetween={24}
              slidesPerView={1.2}
              breakpoints={{
                640: { slidesPerView: 2.2 },
                1024: { slidesPerView: 3.5 }
              }}
              navigation={{ prevEl: '.act-prev', nextEl: '.act-next' }}
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              loop={true}
              className="pb-12"
            >
              {place.activities.map((act, idx) => (
                <SwiperSlide key={idx}>
                  <div className="group bg-[#050505] rounded-[2rem] overflow-hidden border border-white/10 hover:border-white/30 transition-colors cursor-grab active:cursor-grabbing">
                    <div className="h-64 overflow-hidden relative">
                      <img
                        src={act.images?.thumbnail || act.image || heroImage}
                        className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        alt={act.name}
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#050505] to-transparent" />
                    </div>
                    <div className="p-8 relative -mt-10 z-10">
                      <h3 className="text-2xl font-black mb-2">{act.name}</h3>
                      {act.description && <p className="text-white/60 text-sm line-clamp-3">{act.description}</p>}
                    </div>
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

export default PlaceActivities;
