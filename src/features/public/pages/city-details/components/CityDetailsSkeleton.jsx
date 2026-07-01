import DestinationSkeleton from "../../../../../components/ui/DestinationSkeleton";

const CityDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#07090f] pt-24">
    <div className="animate-pulse bg-[#1a2338] h-[70vh] w-full" />
    <div className="max-w-[1600px] w-full mx-auto px-4 py-16">
      <DestinationSkeleton count={6} />
    </div>
  </div>
);

export default CityDetailsSkeleton;
