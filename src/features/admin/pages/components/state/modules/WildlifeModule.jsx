import React from 'react';
import { FiFeather } from 'react-icons/fi';
import { FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';
import ImageUploadField from '../shared/ImageUploadField';

const WildlifeModule = ({ form, set, handleImgUpload, uploadingImage, uploadSingleImage }) => {
  return (
    <CollapsibleModule title="Wildlife Highlights" icon={FiFeather} defaultOpen={false}>
      <RepeaterField
        items={form.wildlifeHighlights}
        onAdd={() => set("wildlifeHighlights", [...form.wildlifeHighlights, { name: "", species: "", description: "", image: { url: "" }, conservationStatus: "" }])}
        onRemove={(idx) => set("wildlifeHighlights", form.wildlifeHighlights.filter((_, i) => i !== idx))}
        onReorder={(items) => set("wildlifeHighlights", items)}
        renderItem={(item, idx, onChange) => (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <FormInput value={item.name} onChange={v => onChange("name", v)} placeholder="Animal / Park Name" />
              <FormInput value={item.species} onChange={v => onChange("species", v)} placeholder="Species (e.g. Bengal Tiger)" />
              <FormInput value={item.conservationStatus} onChange={v => onChange("conservationStatus", v)} placeholder="Conservation Status (Optional)" />
              <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description..." rows={3} />
            </div>
            <div>
              <ImageUploadField
                src={item.image?.url}
                label="Wildlife Image (Optional)"
                aspect="aspect-video"
                onUpload={async (e) => {
                  const url = await uploadSingleImage(e.target.files[0], `wildlife.${idx}`);
                  onChange("image", { url });
                }}
                uploading={uploadingImage === `wildlife.${idx}`}
              />
            </div>
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default WildlifeModule;
