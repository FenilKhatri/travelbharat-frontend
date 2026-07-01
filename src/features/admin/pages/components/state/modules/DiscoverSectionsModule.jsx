import React from 'react';
import { FiBook } from 'react-icons/fi';
import { FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';
import IconPickerField from '../shared/IconPickerField';
import ImageUploadField from '../shared/ImageUploadField';

const DiscoverSectionsModule = ({ form, set, handleImgUpload, uploadingImage, uploadSingleImage }) => {
  return (
    <CollapsibleModule title="Discover (Content Blocks)" icon={FiBook} defaultOpen={false}>
      <p className="text-xs text-slate-500 mb-4">Replaces the old monolithic 'overview' and 'culture' fields.</p>
      <RepeaterField
        items={form.discoverSections}
        onAdd={() => set("discoverSections", [...form.discoverSections, { title: "", subtitle: "", description: "", icon: "FiInfo", image: { url: "" }, order: form.discoverSections.length }])}
        onRemove={(idx) => set("discoverSections", form.discoverSections.filter((_, i) => i !== idx))}
        onReorder={(items) => set("discoverSections", items)}
        renderItem={(item, idx, onChange) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Section Title (e.g. Geography)" />
              <FormInput value={item.subtitle} onChange={v => onChange("subtitle", v)} placeholder="Subtitle (Optional)" />
              <IconPickerField value={item.icon} onChange={v => onChange("icon", v)} placeholder="Icon (e.g. FiMap)" />
              <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Detailed content..." rows={4} />
            </div>
            <div>
              <ImageUploadField
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
    </CollapsibleModule>
  );
};

export default DiscoverSectionsModule;
