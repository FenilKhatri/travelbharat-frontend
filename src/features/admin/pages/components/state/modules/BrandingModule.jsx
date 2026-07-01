import React from 'react';
import { FiLayout } from 'react-icons/fi';
import { FormField, FormInput } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import ImageUploadField from '../shared/ImageUploadField';

const BrandingModule = ({ form, set, handleImgUpload, uploadingImage }) => {
  return (
    <CollapsibleModule title="State Branding" icon={FiLayout} defaultOpen={false}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FormField label="Left Gradient Color">
            <FormInput value={form.stateBranding.leftBackground} onChange={v => set("stateBranding.leftBackground", v)} placeholder="e.g. #FFD700" />
          </FormField>
          <FormField label="Right Gradient Color">
            <FormInput value={form.stateBranding.rightBackground} onChange={v => set("stateBranding.rightBackground", v)} placeholder="e.g. #FFA500" />
          </FormField>
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <ImageUploadField
            src={form.stateBranding.patternImage}
            label="Background Pattern (Tileable)"
            onUpload={e => handleImgUpload(e.target.files[0], "stateBranding.patternImage")}
            uploading={uploadingImage === "stateBranding.patternImage"}
            onRemove={() => set("stateBranding.patternImage", "")}
          />
          <ImageUploadField
            src={form.stateBranding.overlayImage}
            label="Overlay Illustration (PNG)"
            onUpload={e => handleImgUpload(e.target.files[0], "stateBranding.overlayImage")}
            uploading={uploadingImage === "stateBranding.overlayImage"}
            onRemove={() => set("stateBranding.overlayImage", "")}
          />
        </div>

        <hr className="border-slate-100 dark:border-slate-800" />

        <FormField label="CTA Button Label">
          <FormInput value={form.ctaLabel} onChange={v => set("ctaLabel", v)} placeholder="e.g. Explore Gujarat" />
        </FormField>
      </div>
    </CollapsibleModule>
  );
};

export default BrandingModule;
