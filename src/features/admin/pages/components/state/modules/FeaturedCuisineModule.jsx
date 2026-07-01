import React from 'react';
import { FiCoffee } from 'react-icons/fi';
import CollapsibleModule from '../shared/CollapsibleModule';
import RelationalRepeaterField from '../shared/RelationalRepeaterField';

const FeaturedCuisineModule = ({ form, set, foodsList }) => {
  return (
    <CollapsibleModule title="Featured Cuisine" icon={FiCoffee} defaultOpen={false}>
      <RelationalRepeaterField
        items={form.featuredCuisine}
        onAdd={() => set("featuredCuisine", [...form.featuredCuisine, { food: "", description: "" }])}
        onRemove={(idx) => set("featuredCuisine", form.featuredCuisine.filter((_, i) => i !== idx))}
        onReorder={(items) => set("featuredCuisine", items)}
        optionsList={foodsList}
        relationKey="food"
        placeholder="Select Food..."
        extraFields={[
          { key: "description", placeholder: "Desc Override" }
        ]}
      />
    </CollapsibleModule>
  );
};

export default FeaturedCuisineModule;
