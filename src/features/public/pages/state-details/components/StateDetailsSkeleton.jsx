import CardSkeleton from "../../../../../components/ui/CardSkeleton";
import PageContainer from "../../../../../components/layout/PageContainer";

const StateDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#07090f]">
    <div className="animate-pulse bg-[#1a2338] h-[60vh] w-full rounded-none" />
    <PageContainer className="py-16">
      <CardSkeleton count={4} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
    </PageContainer>
  </div>
);

export default StateDetailsSkeleton;
