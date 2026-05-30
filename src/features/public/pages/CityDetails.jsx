import { useParams } from "react-router-dom";
const CityDetails = () => {
  const { stateSlug, citySlug } = useParams();
  return (
    <div className="pt-24 pb-12 min-h-screen">
      <div className="max-w-[1600px] w-full mx-auto px-4">
        <h1 className="text-4xl font-bold">City Details: {citySlug}, {stateSlug}</h1>
      </div>
    </div>
  );
};
export default CityDetails;

