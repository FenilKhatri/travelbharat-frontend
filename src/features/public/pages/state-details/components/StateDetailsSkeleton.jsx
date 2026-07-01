import CardSkeleton from "../../../../../components/ui/CardSkeleton";

const StateDetailsSkeleton = () => (
  <div className="min-h-screen bg-[#07090f]">
    <div className="animate-pulse bg-[#1a2338] h-[60vh] w-full rounded-none" />
    <div className="max-w-[1600px] w-full mx-auto px-4 py-16">
      <CardSkeleton count={4} columns="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
    </div>
  </div>
);

export default StateDetailsSkeleton;
