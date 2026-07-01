import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { FormInput } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RelationalRepeaterField from '../shared/RelationalRepeaterField';

const FeaturedAttractionsModule = ({ form, set, placesList }) => {
  return (
    <CollapsibleModule title="Featured Attractions" icon={FiMapPin} defaultOpen={false}>
      <RelationalRepeaterField
        items={form.featuredAttractions}
        onAdd={() => set("featuredAttractions", [...form.featuredAttractions, { place: "", category: "", shortDescription: "" }])}
        onRemove={(idx) => set("featuredAttractions", form.featuredAttractions.filter((_, i) => i !== idx))}
        onReorder={(items) => set("featuredAttractions", items)}
        optionsList={placesList}
        relationKey="place"
        placeholder="Select Place..."
        extraFields={[
          { key: "category", placeholder: "Category Override" },
          { key: "shortDescription", placeholder: "Short Desc Override" }
        ]}
      />
    </CollapsibleModule>
  );
};

export default FeaturedAttractionsModule;
