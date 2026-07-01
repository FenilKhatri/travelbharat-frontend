import { useQuery } from "@tanstack/react-query";
import http from "../../../lib/axios";
import PageLoader from "../../../components/ui/PageLoader";
import { FormHeader } from "../components/form";
import { useFestivalFormLogic } from "./hooks/useFestivalFormLogic";
import FestivalFormFields from "./components/FestivalFormFields";

const FestivalForm = () => {
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
  } = useFestivalFormLogic();

  // Queries for FK relations
  const { data: statesRes } = useQuery({ queryKey: ["adminStatesAll"], queryFn: () => http.get("/states/admin/all?limit=500") });
  const { data: citiesRes } = useQuery({ queryKey: ["adminCitiesAll"], queryFn: () => http.get("/cities/admin/all?limit=500") });

  const statesList = statesRes?.data?.data?.states || [];
  const citiesList = citiesRes?.data?.data?.cities || [];

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
    const payload = {
      ...form,
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

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><PageLoader fullScreen={false} size="md" /></div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 pb-16 px-4 sm:px-0">
      <FormHeader
        title="Festival"
        subtitle="Manage cultural festivals and events"
        backPath="/admin/festivals"
        isEditing={isEditing}
        isSaving={isSaving}
        onSave={() => onSave(false)}
        onSaveDraft={() => onSave(true)}
      />

      <FestivalFormFields 
        form={form} 
        set={set} 
        handleArrayString={handleArrayString}
        handleImgUpload={handleImgUpload}
        uploadingImage={uploadingImage}
        uploadMultipleImages={uploadMultipleImages}
        statesList={statesList}
        citiesList={citiesList}
      />
    </div>
  );
};

export default FestivalForm;
