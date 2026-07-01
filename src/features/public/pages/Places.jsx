import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { stateService } from "../../../services/stateService";
import ListingPage from "../../../components/listing/ListingPage";
import { getPlacesConfig } from "../../../data/listingConfigs";

const Places = () => {
  const { data: statesData } = useQuery({
    queryKey: ['filterStates'],
    queryFn: () => stateService.getAllStates({ limit: 100 })
  });

  const stateOptions = statesData?.data?.states?.map(s => ({ value: s._id, label: s.name })) || [];

  const config = useMemo(() => getPlacesConfig(stateOptions), [stateOptions]);

  return <ListingPage config={config} />;
};

export default Places;
