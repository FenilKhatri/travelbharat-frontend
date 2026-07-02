import React from 'react';
import { FiMapPin, FiSettings, FiGrid, FiImage } from 'react-icons/fi';
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

const PlaceFormFields = ({ form, set, handleArrayString, handleImgUpload, uploadingImage, uploadMultipleImages, statesList, placesList, festivalsList, foodsList, citiesList }) => {
  return (
    <div className="space-y-5">
        
        {/* CARD 1: GENERAL */}
        <FormCard title="General Details" icon={FiMapPin}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Destination Name" required>
              <FormInput required value={form.name} onChange={v => set("name", v)} placeholder="e.g. Somnath Temple" />
            </FormField>

            <FormField label="Category" required>
              <CustomDropdown
                value={form.category}
                onChange={v => set("category", v)}
                options={places_category}
                placeholder="Select Category"
              />
            </FormField>

            <FormField label="State" required>
              <CustomDropdown
                value={form.stateId}
                onChange={(val) => setForm({ ...form, stateId: val, cityId: "" })}
                options={[
                  { value: "", label: "Select State" },
                  ...statesList.map(st => ({ value: st._id, label: st.name })),
                ]}
                placeholder="Select State"
                searchable
              />
            </FormField>

            <FormField label="City" required>
              <CustomDropdown
                value={form.cityId}
                onChange={v => set("cityId", v)}
                options={[
                  { value: "", label: "Select City" },
                  ...citiesList.map(ct => ({ value: ct._id, label: ct.name })),
                ]}
                placeholder="Select City"
                disabled={!form.stateId}
                searchable
              />
            </FormField>

            <FormField label="Overview Description" required span2>
              <FormTextarea required value={form.description} onChange={v => set("description", v)} placeholder="Detailed tour highlights and intro text..." rows={4} />
            </FormField>
          </div>
        </FormCard>

        {/* CARD 2: DETAILS & SETTINGS */}
        <FormCard title="Visitor Details & Settings" icon={FiSettings}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Budget Class">
              <CustomDropdown
                value={form.budget}
                onChange={v => set("budget", v)}
                options={[
                  { value: "budget", label: "Budget Friendly" },
                  { value: "moderate", label: "Moderate" },
                  { value: "luxury", label: "Luxury" },
                ]}
                placeholder="Select Budget"
              />
            </FormField>
            
            <FormField label="Timings">
              <FormInput value={form.timings} onChange={v => set("timings", v)} placeholder="e.g. 6 AM to 9 PM" />
            </FormField>
            
            <div className="md:col-span-1 flex flex-col justify-center pt-3">
              <div className="flex gap-6 flex-wrap p-3.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <FormToggle checked={form.featured} onChange={v => set("featured", v)} label="Featured" />
                <FormToggle checked={form.trending} onChange={v => set("trending", v)} label="Trending" accent="#3b82f6" />
                <FormToggle checked={form.isActive} onChange={v => set("isActive", v)} label="Publicly Active" accent="#22c55e" />
              </div>
            </div>
          </div>
        </FormCard>

        <FormBadges 
          badges={form.badges}
          primaryBadge={form.primaryBadge}
          onBadgesChange={(b) => set("badges", b)}
          onPrimaryBadgeChange={(b) => set("primaryBadge", b)}
        />

        {/* CARD 3: ENTRY FEES */}
        <FormCard title="Entry Fees" icon={FiGrid} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormField label="Indian Visitors">
              <FormInput value={form.entryFee.indian} onChange={v => set("entryFee.indian", v)} placeholder="e.g. Free or 50" />
            </FormField>
            <FormField label="Foreign Tourists">
              <FormInput value={form.entryFee.foreigner} onChange={v => set("entryFee.foreigner", v)} placeholder="e.g. 500" />
            </FormField>
            <FormField label="Camera / Video">
              <FormInput value={form.entryFee.camera} onChange={v => set("entryFee.camera", v)} placeholder="e.g. 100" />
            </FormField>
          </div>
        </FormCard>

        {/* CARD 4: MEDIA */}
        <FormCard title="Destination Imagery" icon={FiImage} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <FormSEO seo={form.seo} onChange={(seo) => set("seo", seo)} />
      </div>
  );
};

export default PlaceFormFields;