import React from 'react';
import { FiZap } from 'react-icons/fi';
import { FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';
import IconPickerField from '../shared/IconPickerField';

const FunFactsModule = ({ form, set }) => {
  return (
    <CollapsibleModule title="Fun Facts" icon={FiZap} defaultOpen={false}>
      <RepeaterField
        items={form.funFacts}
        onAdd={() => set("funFacts", [...form.funFacts, { title: "", description: "", icon: "FiZap", source: "" }])}
        onRemove={(idx) => set("funFacts", form.funFacts.filter((_, i) => i !== idx))}
        onReorder={(items) => set("funFacts", items)}
        renderItem={(item, idx, onChange) => (
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Fact Title" />
              <IconPickerField value={item.icon} onChange={v => onChange("icon", v)} />
              <FormInput value={item.source} onChange={v => onChange("source", v)} placeholder="Source (Optional)" />
            </div>
            <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Fun fact description..." rows={2} />
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default FunFactsModule;
