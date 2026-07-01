import React from "react";
import ListingPage from "../../../components/listing/ListingPage";
import { statesConfig } from "../../../data/listingConfigs";

const States = () => {
  return <ListingPage config={statesConfig} />;
};

export default States;
