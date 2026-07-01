import { createContext, useContext, useState } from "react";

const TripPlannerContext = createContext();

export const useTripPlanner = () => useContext(TripPlannerContext);

export const TripPlannerProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [tripData, setTripData] = useState({
    destinationId: null,
    destination: null, // For UI preview
    name: "",
    startDate: "",
    endDate: "",
    duration: 1,
    travelers: { adults: 2, children: 0, seniors: 0 },
    tripType: "family",
    budget: 20000,
    transportation: "",
    accommodations: [],
    attractions: [],
    itinerary: [],
    estimatedCost: 0});

  const updateTripData = (updates) => {
    setTripData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => Math.max(1, prev - 1));
  const goToStep = (step) => setCurrentStep(step);

  return (
    <TripPlannerContext.Provider
      value={{
        currentStep,
        tripData,
        updateTripData,
        nextStep,
        prevStep,
        goToStep}}
    >
      {children}
    </TripPlannerContext.Provider>
  );
};
