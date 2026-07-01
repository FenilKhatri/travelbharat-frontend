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
import { festival_categories } from '../../data/adminData';

const FestivalFormFields = ({ form, set, handleArrayString, handleImgUpload, uploadingImage, uploadMultipleImages, statesList, citiesList }) => {
  return (
    <div className="space-y-5">
        
        {/* CARD 1: GENERAL */}
        <FormCard title="General Details" icon={FaCalendarCheck}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Festival Name" required>
              <FormInput required value={form.name} onChange={v => set("name", v)} placeholder="e.g. Diwali" />
            </FormField>

            <FormField label="Select State" required>
              <CustomDropdown
                value={form.stateId}
                onChange={v => set("stateId", v)}
                options={statesList.map(s => ({ value: s._id, label: s.name }))}
                placeholder="Select a state..."
                searchable
              />
            </FormField>

            <FormField label="Category">
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm capitalize">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </FormField>

            <FormField label="Month">
              <select value={form.month} onChange={(e) => set("month", e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm capitalize">
                <option value="">Select Month</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </FormField>

            <FormField label="Duration">
              <FormInput value={form.duration} onChange={v => set("duration", v)} placeholder="e.g. 5 days" />
            </FormField>

            <FormField label="Slug">
              <FormInput value={form.slug} onChange={v => set("slug", v)} placeholder="e.g. diwali (auto if empty)" />
            </FormField>

            <FormField label="Description" required span2>
              <FormTextarea required value={form.description} onChange={v => set("description", v)} placeholder="A compelling introduction to the festival…" rows={3} />
            </FormField>

            <FormField label="Extended Overview" span2>
              <FormTextarea value={form.overview} onChange={v => set("overview", v)} placeholder="Detailed overview…" rows={5} />
            </FormField>

            <div className="md:col-span-2">
              <div className="flex gap-6 flex-wrap p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <FormToggle checked={form.featured} onChange={v => set("featured", v)} label="Featured Festival" />
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

        {/* CARD 2: MEDIA */}
        <FormCard title="Imagery" icon={FiImage} defaultOpen={false}>
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
            set("gallery", [...form.gallery, ...urls.map(u => ({ url: u, category: "festivals", altText: "" }))]);
          }}
          uploading={uploadingImage === "gallery"}
        />

        {/* CARD 3: DETAILS */}
        <FormCard title="Cultural Details" icon={FaCalendarCheck} defaultOpen={false}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField label="Significance" span2>
              <FormTextarea value={form.significance} onChange={v => set("significance", v)} placeholder="Cultural or religious significance…" rows={3} />
            </FormField>

            <FormField label="Celebrations" span2>
              <FormTextarea value={form.celebrations} onChange={v => set("celebrations", v)} placeholder="How is it celebrated? Rituals, food, events…" rows={3} />
            </FormField>

            <FormField label="Highlights (comma separated)">
              <FormInput value={form.highlights.join(", ")} onChange={v => handleArrayString("highlights", v)} placeholder="e.g. Diya lighting, Rangoli, Fireworks" />
            </FormField>

            <FormField label="Travel Tips (comma separated)">
              <FormInput value={form.travelTips.join(", ")} onChange={v => handleArrayString("travelTips", v)} placeholder="e.g. Book tickets early, Beware of crowds" />
            </FormField>
          </div>
        </FormCard>

        {/* CARD 4: BEST PLACES */}
        <FormCard title="Best Places To Celebrate" icon={FiMap} defaultOpen={false}>
          <ArrayEditor
            items={form.bestPlacesToCelebrate}
            onAdd={() => set("bestPlacesToCelebrate", [...form.bestPlacesToCelebrate, { name: "", description: "" }])}
            onRemove={(idx) => set("bestPlacesToCelebrate", form.bestPlacesToCelebrate.filter((_, i) => i !== idx))}
            renderItem={(item, idx, onChange) => (
              <div className="space-y-3">
                <FormInput value={item.name} onChange={v => onChange("name", v)} placeholder="Place Name e.g. Ayodhya" />
                <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
              </div>
            )}
          />
        </FormCard>

        <FormSEO seo={form.seo} onChange={(seo) => set("seo", seo)} />
      </div>
  );
};

export default FestivalFormFields;