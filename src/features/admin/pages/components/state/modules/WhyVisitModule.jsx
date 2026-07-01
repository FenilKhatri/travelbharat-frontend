import React from 'react';
import { FiHeart } from 'react-icons/fi';
import { FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';
import IconPickerField from '../shared/IconPickerField';
import ImageUploadField from '../shared/ImageUploadField';

const WhyVisitModule = ({ form, set, handleImgUpload, uploadingImage }) => {
  return (
    <CollapsibleModule title="Why Visit Highlights" icon={FiHeart} defaultOpen={false}>
      <RepeaterField
        items={form.whyVisit}
        onAdd={() => set("whyVisit", [...form.whyVisit, { title: "", description: "", icon: "FiStar", image: { url: "" } }])}
        onRemove={(idx) => set("whyVisit", form.whyVisit.filter((_, i) => i !== idx))}
        onReorder={(items) => set("whyVisit", items)}
        renderItem={(item, idx, onChange) => (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Highlight Title" />
              <IconPickerField value={item.icon} onChange={v => onChange("icon", v)} placeholder="Icon (e.g. FiStar)" />
            </div>
            <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Highlight description..." />
            <div className="mt-2">
              <ImageUploadField
                src={item.image?.url}
                label="Highlight Image (Optional)"
                onUpload={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const uniquePath = `whyVisit.${idx}.image`;
                    handleImgUpload(file, uniquePath);
                  }
                }}
                uploading={uploadingImage === `whyVisit.${idx}.image`}
                onRemove={() => onChange("image", { url: "", publicId: "" })}
              />
            </div>
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default WhyVisitModule;
