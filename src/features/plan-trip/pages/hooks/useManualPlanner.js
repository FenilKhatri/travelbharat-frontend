import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { placeService } from "../../../../services/placeService";
import http from "../../../../lib/axios";

export const useManualPlanner = (slug) => {
  const navigate = useNavigate();

  const [tripData, setTripData] = useState({
    destinationId: null,
    destination: null,
    name: "",
    startDate: "",
    endDate: "",
    duration: 1,
    travelers: { adults: 2, children: 0, seniors: 0 },
    tripType: "family",
    budget: 20000,
  });

  const [isSaving, setIsSaving] = useState(false);

  // Fetch all places if no slug
  const { data: placesData, isLoading: placesLoading } = useQuery({
    queryKey: ['allPlacesForPlanner'],
    queryFn: () => placeService.getAllPlaces({ limit: 100 }),
    enabled: !slug && !tripData.destinationId
  });

  const allPlaces = placesData?.data?.places || placesData?.places || [];

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDest = async () => {
      try {
        const res = await placeService.getPlaceBySlug(slug);
        const place = res?.data?.place || res?.place;
        if (place) {
          setTripData(prev => ({ ...prev, destinationId: place._id, destination: place, name: `Trip to ${place.name}` }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (slug) fetchDest();
  }, [slug]);

  // Calc duration
  useEffect(() => {
    if (tripData.startDate && tripData.endDate) {
      const start = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setTripData(prev => ({ ...prev, duration: diffDays > 0 ? diffDays : 1 }));
    }
  }, [tripData.startDate, tripData.endDate]);

  const updateTripData = (updates) => {
    setTripData(prev => ({ ...prev, ...updates }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!tripData.destinationId || !tripData.startDate || !tripData.endDate || !tripData.name) {
      return toast.error("Please fill all required fields.");
    }

    setIsSaving(true);
    try {
      const payload = {
        name: tripData.name,
        destinationId: tripData.destinationId,
        city: tripData.destination?.cityId?.name,
        state: tripData.destination?.stateId?.name,
        startDate: tripData.startDate,
        endDate: tripData.endDate,
        duration: tripData.duration,
        travelers: tripData.travelers,
        tripType: tripData.tripType,
        budget: tripData.budget,
        status: "upcoming"
      };

      const res = await http.post("/trips", payload);
      const newTripId = res?.data?.trip?._id || res?.trip?._id;
      toast.success("Trip created successfully!");
      navigate(`/user/trips/${newTripId}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create trip.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    tripData,
    updateTripData,
    isSaving,
    allPlaces,
    placesLoading,
    handleCreate
  };
};
