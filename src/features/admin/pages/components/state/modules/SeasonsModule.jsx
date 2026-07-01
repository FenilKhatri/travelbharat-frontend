import React from 'react';
import { FiSun } from 'react-icons/fi';
import { FormInput, FormTextarea, FormToggle } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';

const SeasonsModule = ({ form, set }) => {
  return (
    <CollapsibleModule title="Seasons & Weather" icon={FiSun} defaultOpen={false}>
      <RepeaterField
        items={form.seasons}
        onAdd={() => set("seasons", [...form.seasons, { season: "Summer", months: "", temperature: "", description: "", recommended: false }])}
        onRemove={(idx) => set("seasons", form.seasons.filter((_, i) => i !== idx))}
        onReorder={(items) => set("seasons", items)}
        renderItem={(item, idx, onChange) => (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <FormInput value={item.season} onChange={v => onChange("season", v)} placeholder="Season (e.g. Summer)" />
            <FormInput value={item.months} onChange={v => onChange("months", v)} placeholder="Months (e.g. Apr-Jun)" />
            <FormInput value={item.temperature} onChange={v => onChange("temperature", v)} placeholder="Temp (e.g. 25-40°C)" />
            <div className="col-span-full grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-start">
              <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
              <div className="pt-2">
                <FormToggle checked={item.recommended} onChange={v => onChange("recommended", v)} label="Recommended" />
              </div>
            </div>
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default SeasonsModule;
