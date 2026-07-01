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
import { state_regions } from '../../data/adminData';

const StateFormFields = ({ form, set, handleArrayString, handleImgUpload, uploadingImage, uploadMultipleImages, statesList, placesList, festivalsList, foodsList }) => {
  return (
    <div className="space-y-5">
        {/* 1. GENERAL DETAILS */}
        <FormCard title="General Details" icon={FiBook}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="State Name" required>
              <FormInput required value={form.name} onChange={v => set("name", v)} placeholder="e.g. Gujarat" />
            </FormField>
            
            <FormField label="Slug">
              <FormInput value={form.slug} onChange={v => set("slug", v)} placeholder="e.g. gujarat (auto if empty)" />
            </FormField>

            <FormField label="Capital City" required>
              <FormInput required value={form.capital} onChange={v => set("capital", v)} placeholder="e.g. Gandhinagar" />
            </FormField>

            <FormField label="Region" required>
              <CustomDropdown
                value={form.region}
                onChange={v => set("region", v)}
                options={state_regions}
                placeholder="Select Region"
              />
            </FormField>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-5">
              <FormField label="State Code">
                <FormInput value={form.stateCode} onChange={v => set("stateCode", v)} placeholder="e.g. GJ" maxLength={2} />
              </FormField>
              
              <FormField label="Area (sq km)">
                <FormInput type="number" value={form.area} onChange={v => set("area", parseInt(v) || "")} placeholder="e.g. 196024" />
              </FormField>
              
              <FormField label="Population">
                <FormInput type="number" value={form.population} onChange={v => set("population", parseInt(v) || "")} placeholder="e.g. 60439692" />
              </FormField>

              <FormField label="Union Territory">
                <div className="pt-2">
                  <FormToggle checked={form.isUnionTerritory} onChange={v => set("isUnionTerritory", v)} label="Is UT?" />
                </div>
              </FormField>
            </div>

            <FormField label="Languages (comma separated)" span2>
              <FormInput value={form.languages.join(", ")} onChange={v => handleArrayString("languages", v)} placeholder="e.g. Gujarati, Hindi, English" />
            </FormField>
          </div>
        </FormCard>

        {/* 2. HERO & INTRO */}
        <FormCard title="Hero & Intro" icon={FiImage}>
          <div className="grid grid-cols-1 gap-5">
            <FormField label="Tagline">
              <FormInput value={form.tagline} onChange={v => set("tagline", v)} placeholder="e.g. The Heart of Incredible India" showCount maxLength={100} />
            </FormField>
            
            <FormField label="Hero Description" helpText="Short 2-3 line introduction replacing the old long description.">
              <FormTextarea value={form.heroDescription} onChange={v => set("heroDescription", v)} placeholder="Brief introduction..." showCount maxLength={300} />
            </FormField>

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
          </div>
        </FormCard>

        {/* 3. QUICK FACTS */}
        <FormCard title="Quick Facts" icon={FiInfo} defaultOpen={false}>
          <ArrayEditor
            items={form.quickFacts}
            onAdd={() => set("quickFacts", [...form.quickFacts, { title: "", value: "", icon: "FiInfo" }])}
            onRemove={(idx) => set("quickFacts", form.quickFacts.filter((_, i) => i !== idx))}
            onReorder={(items) => set("quickFacts", items)}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Title (e.g. Best Time)" />
                <FormInput value={item.value} onChange={v => onChange("value", v)} placeholder="Value (e.g. Oct-Mar)" />
                <FormInput value={item.icon} onChange={v => onChange("icon", v)} placeholder="React Icon (e.g. FiCalendar)" />
              </div>
            )}
          />
        </FormCard>

        {/* 4. WHY VISIT */}
        <FormCard title="Why Visit Highlights" icon={FiHeart} defaultOpen={false}>
          <ArrayEditor
            items={form.whyVisit}
            onAdd={() => set("whyVisit", [...form.whyVisit, { title: "", description: "", icon: "FiStar", image: { url: "" } }])}
            onRemove={(idx) => set("whyVisit", form.whyVisit.filter((_, i) => i !== idx))}
            onReorder={(items) => set("whyVisit", items)}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Title" />
                  <FormInput value={item.icon} onChange={v => onChange("icon", v)} placeholder="Icon (e.g. FiStar)" />
                  <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
                </div>
                <div>
                  <FormImageUpload
                    src={item.image?.url}
                    label="Image (Optional)"
                    aspect="aspect-video"
                    onUpload={async (e) => {
                      const url = await uploadSingleImage(e.target.files[0], `whyVisit.${idx}`);
                      onChange("image", { url });
                    }}
                    uploading={uploadingImage === `whyVisit.${idx}`}
                  />
                </div>
              </div>
            )}
          />
        </FormCard>

        {/* 5. DISCOVER SECTIONS */}
        <FormCard title="Discover (Content Blocks)" icon={FiBook} defaultOpen={false}>
          <p className="text-xs text-slate-500 mb-4">Replaces the old monolithic 'overview' and 'culture' fields.</p>
          <ArrayEditor
            items={form.discoverSections}
            onAdd={() => set("discoverSections", [...form.discoverSections, { title: "", subtitle: "", description: "", icon: "FiInfo", image: { url: "" }, order: form.discoverSections.length }])}
            onRemove={(idx) => set("discoverSections", form.discoverSections.filter((_, i) => i !== idx))}
            onReorder={(items) => set("discoverSections", items)}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Section Title (e.g. Geography)" />
                  <FormInput value={item.subtitle} onChange={v => onChange("subtitle", v)} placeholder="Subtitle (Optional)" />
                  <FormInput value={item.icon} onChange={v => onChange("icon", v)} placeholder="Icon (e.g. FiMap)" />
                  <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Detailed content..." rows={4} />
                </div>
                <div>
                  <FormImageUpload
                    src={item.image?.url}
                    label="Section Image (Optional)"
                    aspect="aspect-video"
                    onUpload={async (e) => {
                      const url = await uploadSingleImage(e.target.files[0], `discover.${idx}`);
                      onChange("image", { url });
                    }}
                    uploading={uploadingImage === `discover.${idx}`}
                  />
                </div>
              </div>
            )}
          />
        </FormCard>

        {/* 6. HISTORY TIMELINE */}
        <FormCard title="History Timeline" icon={FiClock} defaultOpen={false}>
          <ArrayEditor
            items={form.historyTimeline}
            onAdd={() => set("historyTimeline", [...form.historyTimeline, { year: "", title: "", description: "", image: { url: "" }, order: form.historyTimeline.length }])}
            onRemove={(idx) => set("historyTimeline", form.historyTimeline.filter((_, i) => i !== idx))}
            onReorder={(items) => set("historyTimeline", items)}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="col-span-full grid grid-cols-2 gap-3">
                  <FormInput value={item.year} onChange={v => onChange("year", v)} placeholder="Year / Era (e.g. 15th Century)" />
                  <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Title" />
                </div>
                <div className="col-span-full">
                  <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
                </div>
              </div>
            )}
          />
        </FormCard>

        {/* 7. FK REFERENCES (Attractions, Festivals, Cuisine, Nearby) */}
        <FormCard title="Featured Relations" icon={FiMapPin} defaultOpen={false}>
          <div className="space-y-8">
            
            {/* Attractions */}
            <div>
              <h4 className="font-bold text-sm mb-3">Featured Attractions</h4>
              <ArrayEditor
                items={form.featuredAttractions}
                onAdd={() => set("featuredAttractions", [...form.featuredAttractions, { place: "", category: "", shortDescription: "" }])}
                onRemove={(idx) => set("featuredAttractions", form.featuredAttractions.filter((_, i) => i !== idx))}
                onReorder={(items) => set("featuredAttractions", items)}
                renderItem={(item, idx, onChange) => (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={item.place}
                      onChange={e => onChange("place", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm"
                    >
                      <option value="">Select Place...</option>
                      {placesList.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                    </select>
                    <FormInput value={item.category} onChange={v => onChange("category", v)} placeholder="Category Override" />
                    <FormInput value={item.shortDescription} onChange={v => onChange("shortDescription", v)} placeholder="Short Desc Override" />
                  </div>
                )}
              />
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Festivals */}
            <div>
              <h4 className="font-bold text-sm mb-3">Featured Festivals</h4>
              <ArrayEditor
                items={form.featuredFestivals}
                onAdd={() => set("featuredFestivals", [...form.featuredFestivals, { festival: "", month: "", description: "" }])}
                onRemove={(idx) => set("featuredFestivals", form.featuredFestivals.filter((_, i) => i !== idx))}
                onReorder={(items) => set("featuredFestivals", items)}
                renderItem={(item, idx, onChange) => (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <select
                      value={item.festival}
                      onChange={e => onChange("festival", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm"
                    >
                      <option value="">Select Festival...</option>
                      {festivalsList.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                    </select>
                    <FormInput value={item.month} onChange={v => onChange("month", v)} placeholder="Month Override" />
                    <FormInput value={item.description} onChange={v => onChange("description", v)} placeholder="Desc Override" />
                  </div>
                )}
              />
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Cuisine */}
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2"><FaUtensils/> Featured Cuisine</h4>
              <ArrayEditor
                items={form.featuredCuisine}
                onAdd={() => set("featuredCuisine", [...form.featuredCuisine, { food: "", description: "" }])}
                onRemove={(idx) => set("featuredCuisine", form.featuredCuisine.filter((_, i) => i !== idx))}
                onReorder={(items) => set("featuredCuisine", items)}
                renderItem={(item, idx, onChange) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                      value={item.food}
                      onChange={e => onChange("food", e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm"
                    >
                      <option value="">Select Food...</option>
                      {foodsList.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                    </select>
                    <FormInput value={item.description} onChange={v => onChange("description", v)} placeholder="Desc Override" />
                  </div>
                )}
              />
            </div>

            <hr className="border-slate-100 dark:border-slate-800" />

            {/* Nearby States */}
            <div>
              <h4 className="font-bold text-sm mb-3">Nearby States</h4>
              <div className="flex flex-wrap gap-2">
                {statesList.map(st => (
                  <label key={st._id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${form.nearbyStates.includes(st._id) ? "bg-[#E85D04]/10 border-[#E85D04] text-[#E85D04] font-bold" : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"}`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={form.nearbyStates.includes(st._id)}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked) set("nearbyStates", [...form.nearbyStates, st._id]);
                        else set("nearbyStates", form.nearbyStates.filter(id => id !== st._id));
                      }}
                    />
                    {st.name}
                  </label>
                ))}
              </div>
            </div>

          </div>
        </FormCard>

        {/* 8. SEASONS */}
        <FormCard title="Seasons & Weather" icon={FiSun} defaultOpen={false}>
          <ArrayEditor
            items={form.seasons}
            onAdd={() => set("seasons", [...form.seasons, { season: "Summer", months: "", temperature: "", description: "", recommended: false }])}
            onRemove={(idx) => set("seasons", form.seasons.filter((_, i) => i !== idx))}
            onReorder={(items) => set("seasons", items)}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <FormInput value={item.season} onChange={v => onChange("season", v)} placeholder="Season (e.g. Summer)" />
                <FormInput value={item.months} onChange={v => onChange("months", v)} placeholder="Months (e.g. Apr-Jun)" />
                <FormInput value={item.temperature} onChange={v => onChange("temperature", v)} placeholder="Temp (e.g. 25-40°C)" />
                <div className="col-span-full grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-start">
                  <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
                  <div className="pt-2">
                    <FormToggle checked={item.recommended} onChange={v => onChange("recommended", v)} label="Recommended" />
                  </div>
                </div>
              </div>
            )}
          />
        </FormCard>

        {/* 9. TRAVEL INFO */}
        <FormCard title="Travel Information" icon={FiNavigation} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="By Air">
              <FormTextarea value={form.travelInfo.byAir} onChange={v => set("travelInfo.byAir", v)} rows={2} />
            </FormField>
            <FormField label="By Train">
              <FormTextarea value={form.travelInfo.byTrain} onChange={v => set("travelInfo.byTrain", v)} rows={2} />
            </FormField>
            <FormField label="By Road">
              <FormTextarea value={form.travelInfo.byRoad} onChange={v => set("travelInfo.byRoad", v)} rows={2} />
            </FormField>
            <FormField label="Local Transport">
              <FormTextarea value={form.travelInfo.localTransport} onChange={v => set("travelInfo.localTransport", v)} rows={2} />
            </FormField>
            <FormField label="Major Airport">
              <FormInput value={form.travelInfo.airport} onChange={v => set("travelInfo.airport", v)} placeholder="e.g. IGI Airport, Delhi" />
            </FormField>
            <FormField label="Nearest Major City">
              <FormInput value={form.travelInfo.nearestMajorCity} onChange={v => set("travelInfo.nearestMajorCity", v)} placeholder="e.g. Mumbai" />
            </FormField>
          </div>
        </FormCard>

        {/* 10. TRAVEL TIPS */}
        <FormCard title="Travel Tips" icon={FiInfo} defaultOpen={false}>
          <ArrayEditor
            items={form.travelTips}
            onAdd={() => set("travelTips", [...form.travelTips, { title: "Tip", description: "", icon: "FiCheckCircle" }])}
            onRemove={(idx) => set("travelTips", form.travelTips.filter((_, i) => i !== idx))}
            onReorder={(items) => set("travelTips", items)}
            renderItem={(item, idx, onChange) => (
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
                <div className="space-y-3">
                  <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Title" />
                  <FormInput value={item.icon} onChange={v => onChange("icon", v)} placeholder="Icon" />
                </div>
                <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Detailed tip description" />
              </div>
            )}
          />
        </FormCard>

        <FormGallery 
          images={form.gallery}
          onChange={(newGallery) => set("gallery", newGallery)}
          onUpload={async (e) => {
            const urls = await uploadMultipleImages(e.target.files, "gallery");
            const newImages = urls.map(url => ({ url, category: "landscape", priority: 0 }));
            set("gallery", [...form.gallery, ...newImages]);
          }}
          uploading={uploadingImage === "gallery"}
        />

        {/* LOCATION & SETTINGS */}
        <FormCard title="Location & Settings" icon={FiMapPin} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Map Latitude">
              <FormInput type="number" step="any" value={form.mapCoordinates.lat} onChange={v => set("mapCoordinates.lat", parseFloat(v) || 0)} />
            </FormField>
            <FormField label="Map Longitude">
              <FormInput type="number" step="any" value={form.mapCoordinates.lng} onChange={v => set("mapCoordinates.lng", parseFloat(v) || 0)} />
            </FormField>
            <FormField label="Display Priority">
              <FormInput type="number" min={0} value={form.priority} onChange={v => set("priority", parseInt(v) || 0)} />
            </FormField>
            <div className="md:col-span-2 flex gap-6 flex-wrap p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
              <FormToggle checked={form.featured} onChange={v => set("featured", v)} label="Featured State" />
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

export default StateFormFields;
