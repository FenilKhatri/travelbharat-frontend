import DestinationSkeleton from "../../../../../components/ui/DestinationSkeleton";
import PageContainer from "../../../../../components/layout/PageContainer";

const CityDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#07090f] pt-24">
    <div className="animate-pulse bg-[#1a2338] h-[70vh] w-full" />
    <PageContainer className="py-16">
      <DestinationSkeleton count={6} />
    </PageContainer>
  </div>
);

export default CityDetailsSkeleton;
