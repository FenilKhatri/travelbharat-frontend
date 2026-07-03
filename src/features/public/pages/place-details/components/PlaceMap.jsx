import { FiMapPin } from "react-icons/fi";
import Reveal from "../../../../../components/ui/Reveal";
import SectionContainer from "../../../../../components/layout/SectionContainer";

const PlaceMap = ({ place, hasValidMap }) => {
  if (!hasValidMap) return null;

  return (
    <SectionContainer className="bg-[#0a0a0a] border-t border-white/5">
      <div className="max-w-[1600px] mx-auto px-4">
        <Reveal>
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-4">Location</h2>
              {place.location.address && (
                <p className="text-white/60 text-lg flex items-center gap-2">
                  <FiMapPin className="text-[#E85D04]" /> {place.location.address}
                </p>
              )}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="h-[60vh] rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative bg-[#050505]">
            <iframe
              title={`${place.name} Map`}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) grayscale(80%) contrast(120%)' }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=${place.location.coordinates.lat},${place.location.coordinates.lng}&hl=en&z=15&output=embed`}
            ></iframe>
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10 rounded-[32px]" />
          </div>
        </Reveal>
      </div>
    </SectionContainer>
  );
};

export default PlaceMap;
