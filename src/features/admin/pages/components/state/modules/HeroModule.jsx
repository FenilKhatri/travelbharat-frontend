import React from 'react';
import { FiImage } from 'react-icons/fi';
import { FormField, FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import ImageUploadField from '../shared/ImageUploadField';

const HeroModule = ({ form, set, handleImgUpload, uploadingImage }) => {
  return (
    <CollapsibleModule title="Hero & Intro" icon={FiImage}>
      <div className="grid grid-cols-1 gap-5">
        <FormField label="Tagline">
          <FormInput value={form.tagline} onChange={v => set("tagline", v)} placeholder="e.g. The Heart of Incredible India" showCount maxLength={100} />
        </FormField>
        
        <FormField label="Hero Description" helpText="Short 2-3 line introduction replacing the old long description.">
          <FormTextarea value={form.heroDescription} onChange={v => set("heroDescription", v)} placeholder="Brief introduction..." showCount maxLength={300} />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <ImageUploadField
            src={form.images.hero}
            label="Hero Banner (Landscape)"
            onUpload={e => handleImgUpload(e.target.files[0], "images.hero")}
            uploading={uploadingImage === "images.hero"}
            onRemove={() => set("images.hero", "")}
          />
          <ImageUploadField
            src={form.images.thumbnail}
            label="Thumbnail (Square)"
            aspect="aspect-square max-w-[220px]"
            onUpload={e => handleImgUpload(e.target.files[0], "images.thumbnail")}
            uploading={uploadingImage === "images.thumbnail"}
            onRemove={() => set("images.thumbnail", "")}
          />
        </div>
      </div>
    </CollapsibleModule>
  );
};

export default HeroModule;
