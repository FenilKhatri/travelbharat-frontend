import React from "react";
import ListingPage from "../../../components/listing/ListingPage";
import { citiesConfig } from "../../../data/listingConfigs";

const Cities = () => {
  return <ListingPage config={citiesConfig} />;
};

export default Cities;
