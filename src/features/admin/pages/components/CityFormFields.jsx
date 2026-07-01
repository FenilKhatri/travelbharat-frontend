import React from 'react';
import {
  FormCard,
  FormField,
  FormInput,
  FormTextarea,
  FormImageUpload,
  ArrayEditor,
  FormToggle,
  FormSEO,
  FormGallery,
  FormBadges
} from '../../components/form';

const CityFormFields = ({ form, set, handleArrayString, handleImgUpload, uploadingImage, uploadMultipleImages, statesList, placesList, festivalsList, foodsList }) => {
  return (
    <div className="space-y-5">
        
        {/* 1. GENERAL DETAILS */}
        <FormCard title="General Details" icon={FiBook}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="City Name" required>
              <FormInput required value={form.name} onChange={v => set("name", v)} placeholder="e.g. Ahmedabad" />
            </FormField>
            
            <FormField label="State" required>
              <select
                required
                value={form.stateId}
                onChange={(e) => set("stateId", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm"
              >
                <option value="">Select State...</option>
                {statesList.map((state) => (
                  <option key={state._id} value={state._id}>{state.name}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Slug">
              <FormInput value={form.slug} onChange={v => set("slug", v)} placeholder="e.g. ahmedabad (auto if empty)" />
            </FormField>

            <FormField label="Tagline" span2>
              <FormInput value={form.tagline} onChange={v => set("tagline", v)} placeholder="e.g. The Manchester of India" showCount maxLength={100} />
            </FormField>
            
            <FormField label="Short Description" required span2>
              <FormTextarea required value={form.description} onChange={v => set("description", v)} placeholder="Brief introduction..." rows={3} />
            </FormField>

            <FormField label="Detailed Overview" span2>
              <FormTextarea value={form.overview} onChange={v => set("overview", v)} placeholder="Comprehensive guide..." rows={5} />
            </FormField>
          </div>
        </FormCard>

        {/* 2. MEDIA */}
        <FormCard title="Media" icon={FiImage} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <FormImageUpload
              src={form.images.hero}
              label="Hero Banner (Landscape)"
              onUpload={e => handleImgUpload(e.target.files[0], "images.hero")}
              uploading={uploadingImage === "images.hero"}
              onRemove={() => set("images.hero", "")}
            />
            <FormImageUpload
              src={form.images.thumbnail}
              label="Thumbnail (Square)"
              aspect="aspect-square max-w-[220px]"
              onUpload={e => handleImgUpload(e.target.files[0], "images.thumbnail")}
              uploading={uploadingImage === "images.thumbnail"}
              onRemove={() => set("images.thumbnail", "")}
            />
          </div>
        </FormCard>

        <FormGallery 
          images={form.gallery}
          onChange={(newGallery) => set("gallery", newGallery)}
          onUpload={async (e) => {
            const urls = await uploadMultipleImages(e.target.files, "gallery");
            set("gallery", [...form.gallery, ...urls.map(u => ({ url: u, category: "landscape", altText: "" }))]);
          }}
          uploading={uploadingImage === "gallery"}
        />

        {/* 3. ATTRACTIONS */}
        <FormCard title="Top Attractions" icon={FiMap} defaultOpen={false}>
          <ArrayEditor
            items={form.attractions}
            onAdd={() => set("attractions", [...form.attractions, { title: "", description: "", image: "" }])}
            onRemove={(idx) => set("attractions", form.attractions.filter((_, i) => i !== idx))}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Attraction Name" />
                  <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
                </div>
                <div>
                  <FormImageUpload
                    src={item.image}
                    label="Image (Optional)"
                    aspect="aspect-video"
                    onUpload={async (e) => {
                      const url = await uploadSingleImage(e.target.files[0], `attractions.${idx}`);
                      onChange("image", url);
                    }}
                    uploading={uploadingImage === `attractions.${idx}`}
                    onRemove={() => onChange("image", "")}
                  />
                </div>
              </div>
            )}
          />
        </FormCard>

        {/* 4. FOOD & RESTAURANTS */}
        <FormCard title="Food & Restaurants" icon={FaUtensils} defaultOpen={false}>
          <ArrayEditor
            items={form.restaurants}
            onAdd={() => set("restaurants", [...form.restaurants, { name: "", type: "", rating: "", description: "" }])}
            onRemove={(idx) => set("restaurants", form.restaurants.filter((_, i) => i !== idx))}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormInput value={item.name} onChange={v => onChange("name", v)} placeholder="Restaurant Name" />
                <FormInput value={item.type} onChange={v => onChange("type", v)} placeholder="Cuisine / Type" />
                <FormInput value={item.rating} onChange={v => onChange("rating", v)} placeholder="Rating (e.g. 4.5)" />
                <div className="col-span-full">
                  <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
                </div>
              </div>
            )}
          />
        </FormCard>

        {/* 5. HOTELS */}
        <FormCard title="Accommodation" icon={FaBed} defaultOpen={false}>
          <ArrayEditor
            items={form.hotels}
            onAdd={() => set("hotels", [...form.hotels, { name: "", type: "", rating: "", description: "" }])}
            onRemove={(idx) => set("hotels", form.hotels.filter((_, i) => i !== idx))}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormInput value={item.name} onChange={v => onChange("name", v)} placeholder="Hotel Name" />
                <FormInput value={item.type} onChange={v => onChange("type", v)} placeholder="Type (e.g. Luxury)" />
                <FormInput value={item.rating} onChange={v => onChange("rating", v)} placeholder="Rating (e.g. 5 Star)" />
                <div className="col-span-full">
                  <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
                </div>
              </div>
            )}
          />
        </FormCard>

        {/* 6. SHOPPING */}
        <FormCard title="Shopping & Markets" icon={FiShoppingBag} defaultOpen={false}>
          <ArrayEditor
            items={form.shopping}
            onAdd={() => set("shopping", [...form.shopping, { name: "", whatToBuy: "", description: "" }])}
            onRemove={(idx) => set("shopping", form.shopping.filter((_, i) => i !== idx))}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FormInput value={item.name} onChange={v => onChange("name", v)} placeholder="Market Name" />
                <FormInput value={item.whatToBuy} onChange={v => onChange("whatToBuy", v)} placeholder="What to buy (comma separated)" />
                <div className="col-span-full">
                  <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
                </div>
              </div>
            )}
          />
        </FormCard>

        {/* 7. TRANSPORT & INFO */}
        <FormCard title="Transport & Emergency Info" icon={FiNavigation} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Transportation</h4>
              <FormField label="Local Transport">
                <FormTextarea value={form.transport.local} onChange={v => set("transport.local", v)} rows={2} />
              </FormField>
              <FormField label="From Airport">
                <FormInput value={form.transport.fromAirport} onChange={v => set("transport.fromAirport", v)} />
              </FormField>
              <FormField label="From Station">
                <FormInput value={form.transport.fromStation} onChange={v => set("transport.fromStation", v)} />
              </FormField>
              <FormField label="Bus Station">
                <FormInput value={form.transport.busStation} onChange={v => set("transport.busStation", v)} />
              </FormField>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">Emergency Info</h4>
              <FormField label="Police">
                <FormInput value={form.emergencyInfo.police} onChange={v => set("emergencyInfo.police", v)} />
              </FormField>
              <FormField label="Ambulance">
                <FormInput value={form.emergencyInfo.ambulance} onChange={v => set("emergencyInfo.ambulance", v)} />
              </FormField>
              <FormField label="Fire Brigade">
                <FormInput value={form.emergencyInfo.fireBrigade} onChange={v => set("emergencyInfo.fireBrigade", v)} />
              </FormField>
              <FormField label="Nearest Hospital">
                <FormInput value={form.emergencyInfo.hospital} onChange={v => set("emergencyInfo.hospital", v)} />
              </FormField>
              <FormField label="Tourist Helpline">
                <FormInput value={form.emergencyInfo.touristHelpline} onChange={v => set("emergencyInfo.touristHelpline", v)} />
              </FormField>
            </div>
          </div>
        </FormCard>

        {/* LOCATION & SETTINGS */}
        <FormCard title="Location & Settings" icon={FiMapPin} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Map Latitude">
              <FormInput type="number" step="any" value={form.mapCoordinates.lat} onChange={v => set("mapCoordinates.lat", parseFloat(v) || 0)} />
            </FormField>
            <FormField label="Map Longitude">
              <FormInput type="number" step="any" value={form.mapCoordinates.lng} onChange={v => set("mapCoordinates.lng", parseFloat(v) || 0)} />
            </FormField>
            <FormField label="Best Time to Visit">
              <FormInput value={form.bestTimeToVisit} onChange={v => set("bestTimeToVisit", v)} placeholder="e.g. October to March" />
            </FormField>
            <FormField label="Display Priority">
              <FormInput type="number" min={0} value={form.priority} onChange={v => set("priority", parseInt(v) || 0)} />
            </FormField>
            <FormField label="Population">
              <FormInput value={form.population} onChange={v => set("population", v)} />
            </FormField>
            <FormField label="Pincode">
              <FormInput value={form.pincode} onChange={v => set("pincode", v)} />
            </FormField>
            <div className="md:col-span-2 flex gap-6 flex-wrap p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <FormToggle checked={form.featured} onChange={v => set("featured", v)} label="Featured City" />
              <FormToggle checked={form.isActive} onChange={v => set("isActive", v)} label="Publicly Active" accent="#22c55e" />
            </div>
          </div>
        </FormCard>

        <FormBadges 
          badges={form.badges}
          primaryBadge={form.primaryBadge}
          onBadgesChange={(b) => set("badges", b)}
          onPrimaryBadgeChange={(b) => set("primaryBadge", b)}
        />

        <FormSEO seo={form.seo} onChange={(seo) => set("seo", seo)} />
      </div>
  );
};

export default CityFormFields;