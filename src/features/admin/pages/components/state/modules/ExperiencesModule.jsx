import React from 'react';
import { FiCompass } from 'react-icons/fi';
import { FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';
import IconPickerField from '../shared/IconPickerField';
import ImageUploadField from '../shared/ImageUploadField';

const ExperiencesModule = ({ form, set, handleImgUpload, uploadingImage, uploadSingleImage }) => {
  return (
    <CollapsibleModule title="Experiences" icon={FiCompass} defaultOpen={false}>
      <RepeaterField
        items={form.experiences}
        onAdd={() => set("experiences", [...form.experiences, { title: "", description: "", icon: "FiCompass", image: { url: "" }, category: "" }])}
        onRemove={(idx) => set("experiences", form.experiences.filter((_, i) => i !== idx))}
        onReorder={(items) => set("experiences", items)}
        renderItem={(item, idx, onChange) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Experience Title" />
              <FormInput value={item.category} onChange={v => onChange("category", v)} placeholder="Category (e.g. Adventure, Culture)" />
              <IconPickerField value={item.icon} onChange={v => onChange("icon", v)} />
              <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description..." rows={3} />
            </div>
            <div>
              <ImageUploadField
                src={item.image?.url}
                label="Experience Image (Optional)"
                aspect="aspect-video"
                onUpload={async (e) => {
                  const url = await uploadSingleImage(e.target.files[0], `experiences.${idx}`);
                  onChange("image", { url });
                }}
                uploading={uploadingImage === `experiences.${idx}`}
              />
            </div>
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default ExperiencesModule;
