import { useParams } from "react-router-dom";

// Hooks
import { useManualPlanner } from "./hooks/useManualPlanner";

// Components
import DestinationSelector from "./components/DestinationSelector";
import PlannerHero from "./components/PlannerHero";
import TripDetailsForm from "./components/TripDetailsForm";

const ManualPlanner = () => {
  const { slug } = useParams();

  const {
    tripData,
    updateTripData,
    isSaving,
    allPlaces,
    placesLoading,
    handleCreate
  } = useManualPlanner(slug);

  const today = new Date().toISOString().split('T')[0];

  if (!tripData.destination) {
    return (
      <DestinationSelector
        placesLoading={placesLoading}
        allPlaces={allPlaces}
        updateTripData={updateTripData}
      />
    );
  }

  return (
    <div className="bg-[#050505] min-h-screen font-sans text-white pb-32">
      <PlannerHero destination={tripData.destination} />

      <TripDetailsForm
        tripData={tripData}
        updateTripData={updateTripData}
        handleCreate={handleCreate}
        isSaving={isSaving}
        today={today}
      />
    </div>
  );
};

export default ManualPlanner;
