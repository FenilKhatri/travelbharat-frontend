import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';
import IconPickerField from '../shared/IconPickerField';

const TravelTipsModule = ({ form, set }) => {
  return (
    <CollapsibleModule title="Travel Tips" icon={FiInfo} defaultOpen={false}>
      <RepeaterField
        items={form.travelTips}
        onAdd={() => set("travelTips", [...form.travelTips, { title: "Tip", description: "", icon: "FiCheckCircle" }])}
        onRemove={(idx) => set("travelTips", form.travelTips.filter((_, i) => i !== idx))}
        onReorder={(items) => set("travelTips", items)}
        renderItem={(item, idx, onChange) => (
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3">
            <div className="space-y-3">
              <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Title" />
              <IconPickerField value={item.icon} onChange={v => onChange("icon", v)} placeholder="Icon" />
            </div>
            <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Detailed tip description" />
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default TravelTipsModule;
