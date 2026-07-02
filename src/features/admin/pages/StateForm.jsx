import { useQuery } from "@tanstack/react-query";
import http from "../../../lib/axios";
import PageLoader from "../../../components/ui/PageLoader";
import { FormHeader, FormBadges, FormSEO } from "../components/form";
import { useStateFormLogic } from "./hooks/useStateFormLogic";

// State Form Modules
import BasicInfoModule from "./components/state/modules/BasicInfoModule";
import HeroModule from "./components/state/modules/HeroModule";
import BrandingModule from "./components/state/modules/BrandingModule";
import QuickFactsModule from "./components/state/modules/QuickFactsModule";
import WhyVisitModule from "./components/state/modules/WhyVisitModule";
import DiscoverSectionsModule from "./components/state/modules/DiscoverSectionsModule";
import HistoryTimelineModule from "./components/state/modules/HistoryTimelineModule";
import ExperiencesModule from "./components/state/modules/ExperiencesModule";
import FeaturedAttractionsModule from "./components/state/modules/FeaturedAttractionsModule";
import FeaturedFestivalsModule from "./components/state/modules/FeaturedFestivalsModule";
import FeaturedCuisineModule from "./components/state/modules/FeaturedCuisineModule";
import WildlifeModule from "./components/state/modules/WildlifeModule";
import SeasonsModule from "./components/state/modules/SeasonsModule";
import TravelInfoModule from "./components/state/modules/TravelInfoModule";
import TravelTipsModule from "./components/state/modules/TravelTipsModule";
import FunFactsModule from "./components/state/modules/FunFactsModule";
import GalleryModule from "./components/state/modules/GalleryModule";
import FAQModule from "./components/state/modules/FAQModule";
import NearbyStatesModule from "./components/state/modules/NearbyStatesModule";
import LocationSettingsModule from "./components/state/modules/LocationSettingsModule";

const StateForm = () => {
  const {
    id,
    isEditing,
    form,
    setForm,
    isLoading,
    isSaving,
    handleSave,
    uploadingImage,
    uploadSingleImage,
    uploadMultipleImages
  } = useStateFormLogic();

  // Queries for FK relations
  const { data: placesRes } = useQuery({ queryKey: ["adminPlacesAll"], queryFn: () => http.get("/places/admin/all?limit=500") });
  const { data: festivalsRes } = useQuery({ queryKey: ["adminFestivalsAll"], queryFn: () => http.get("/festivals/admin/all?limit=500") });
  const { data: foodsRes } = useQuery({ queryKey: ["adminFoodsAll"], queryFn: () => http.get("/foods/admin/all?limit=500") });
  const { data: statesRes } = useQuery({ queryKey: ["adminStatesAll"], queryFn: () => http.get("/states/admin/all?limit=500") });

  const placesList = placesRes?.data?.data?.places || [];
  const festivalsList = festivalsRes?.data?.data?.festivals || [];
  const foodsList = foodsRes?.data?.data?.foods || [];
  const statesList = statesRes?.data?.data?.states?.filter(st => st._id !== id) || [];

  const set = (key, value) => {
    setForm(prev => {
      const keys = key.split(".");
      if (keys.length === 1) return { ...prev, [key]: value };
      const [parent, child] = keys;
      return { ...prev, [parent]: { ...prev[parent], [child]: value } };
    });
  };

  const handleArrayString = (key, value) => {
    const arr = value.split(",").map(s => s.trim()).filter(Boolean);
    set(key, arr);
  };

  const onSave = (asDraft) => {
    // Convert quickFacts array back to object for Mongoose
    const quickFactsObj = {};
    if (Array.isArray(form.quickFacts)) {
      form.quickFacts.forEach(fact => {
        if (fact.title && fact.value) {
          quickFactsObj[fact.title] = fact.value;
        }
      });
    } else if (form.quickFacts && typeof form.quickFacts === "object") {
        Object.assign(quickFactsObj, form.quickFacts);
    }

    const payload = {
      ...form,
      quickFacts: quickFactsObj,
      isActive: !asDraft,
      mapCoordinates: {
        type: "Point",
        coordinates: [form.mapCoordinates.lng, form.mapCoordinates.lat]
      }
    };
    handleSave(payload);
  };

  const handleImgUpload = async (file, path) => {
    const url = await uploadSingleImage(file, path);
    set(path, url);
  };

  // Shared props passed to image-supporting modules
  const imageProps = { handleImgUpload, uploadingImage, uploadSingleImage };

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><PageLoader fullScreen={false} size="md" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16 px-4 sm:px-0">
      <FormHeader
        title="State"
        subtitle="Complete redesign of the state content structure"
        backPath="/admin/states"
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={() => onSave(false)}
        onSaveDraft={() => onSave(true)}
      />

      {/* 1. General Details */}
      <BasicInfoModule form={form} set={set} handleArrayString={handleArrayString} />

      {/* 2. Hero & Intro */}
      <HeroModule form={form} set={set} {...imageProps} />

      {/* 3. Quick Facts */}
      <QuickFactsModule form={form} set={set} />

      {/* 4. Why Visit Highlights */}
      <WhyVisitModule form={form} set={set} {...imageProps} />

      {/* 5. Discover Sections */}
      <DiscoverSectionsModule form={form} set={set} {...imageProps} />

      {/* 6. History Timeline */}
      <HistoryTimelineModule form={form} set={set} />

      {/* 7. Experiences */}
      <ExperiencesModule form={form} set={set} {...imageProps} />

      {/* 8. Featured Attractions */}
      <FeaturedAttractionsModule form={form} set={set} placesList={placesList} />

      {/* 9. Featured Festivals */}
      <FeaturedFestivalsModule form={form} set={set} festivalsList={festivalsList} />

      {/* 10. Featured Cuisine */}
      <FeaturedCuisineModule form={form} set={set} foodsList={foodsList} />

      {/* 11. Wildlife */}
      <WildlifeModule form={form} set={set} {...imageProps} />

      {/* 12. Seasons & Weather */}
      <SeasonsModule form={form} set={set} />

      {/* 13. Travel Info */}
      <TravelInfoModule form={form} set={set} />

      {/* 14. Travel Tips */}
      <TravelTipsModule form={form} set={set} />

      {/* 15. Fun Facts */}
      <FunFactsModule form={form} set={set} />

      {/* 16. Gallery */}
      <GalleryModule form={form} set={set} uploadMultipleImages={uploadMultipleImages} uploadingImage={uploadingImage} />

      {/* 17. FAQ */}
      <FAQModule form={form} set={set} />

      {/* 18. Nearby States */}
      <NearbyStatesModule form={form} set={set} statesList={statesList} />

      {/* 19. State Branding */}
      <BrandingModule form={form} set={set} {...imageProps} />

      {/* 20. Location & Settings */}
      <LocationSettingsModule form={form} set={set} />

      {/* Badges */}
      <FormBadges 
        badges={form.badges}
        primaryBadge={form.primaryBadge}
        onBadgesChange={(b) => set("badges", b)}
        onPrimaryBadgeChange={(b) => set("primaryBadge", b)}
      />

      {/* SEO */}
      <FormSEO seo={form.seo} onChange={(seo) => set("seo", seo)} />
    </div>
  );
};

export default StateForm;