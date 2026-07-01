import React from 'react';
import { FiInfo } from 'react-icons/fi';
import { FormInput } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';
import IconPickerField from '../shared/IconPickerField';

const QuickFactsModule = ({ form, set }) => {
  return (
    <CollapsibleModule title="Quick Facts" icon={FiInfo} defaultOpen={false}>
      <RepeaterField
        items={form.quickFacts}
        onAdd={() => set("quickFacts", [...form.quickFacts, { title: "", value: "", icon: "FiInfo" }])}
        onRemove={(idx) => set("quickFacts", form.quickFacts.filter((_, i) => i !== idx))}
        onReorder={(items) => set("quickFacts", items)}
        renderItem={(item, idx, onChange) => (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Fact Title (e.g. Best Time)" />
            <FormInput value={item.value} onChange={v => onChange("value", v)} placeholder="Fact Value (e.g. Oct to Mar)" />
            <IconPickerField value={item.icon} onChange={v => onChange("icon", v)} placeholder="Icon (e.g. FiCalendar)" />
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default QuickFactsModule;
