import React from 'react';
import { FiCalendar } from 'react-icons/fi';
import CollapsibleModule from '../shared/CollapsibleModule';
import RelationalRepeaterField from '../shared/RelationalRepeaterField';

const FeaturedFestivalsModule = ({ form, set, festivalsList }) => {
  return (
    <CollapsibleModule title="Featured Festivals" icon={FiCalendar} defaultOpen={false}>
      <RelationalRepeaterField
        items={form.featuredFestivals}
        onAdd={() => set("featuredFestivals", [...form.featuredFestivals, { festival: "", month: "", description: "" }])}
        onRemove={(idx) => set("featuredFestivals", form.featuredFestivals.filter((_, i) => i !== idx))}
        onReorder={(items) => set("featuredFestivals", items)}
        optionsList={festivalsList}
        relationKey="festival"
        placeholder="Select Festival..."
        extraFields={[
          { key: "month", placeholder: "Month Override" },
          { key: "description", placeholder: "Desc Override" }
        ]}
      />
    </CollapsibleModule>
  );
};

export default FeaturedFestivalsModule;
