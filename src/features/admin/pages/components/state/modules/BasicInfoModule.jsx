import React from 'react';
import { FiBook } from 'react-icons/fi';
import { FormField, FormInput, FormToggle } from '../../../../components/form';
import CustomDropdown from '../../../../../../components/ui/CustomDropdown';
import CollapsibleModule from '../shared/CollapsibleModule';
import { state_regions } from '../../../../data/adminData';

const BasicInfoModule = ({ form, set, handleArrayString }) => {
  return (
    <CollapsibleModule title="General Details" icon={FiBook}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="State Name" required>
          <FormInput required value={form.name} onChange={v => set("name", v)} placeholder="e.g. Gujarat" />
        </FormField>
        
        <FormField label="Slug">
          <FormInput value={form.slug} onChange={v => set("slug", v)} placeholder="e.g. gujarat (auto if empty)" />
        </FormField>

        <FormField label="Capital City" required>
          <FormInput required value={form.capital} onChange={v => set("capital", v)} placeholder="e.g. Gandhinagar" />
        </FormField>

        <FormField label="Region" required>
          <CustomDropdown
            value={form.region}
            onChange={v => set("region", v)}
            options={state_regions}
            placeholder="Select Region"
          />
        </FormField>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-4 gap-5">
          <FormField label="State Code">
            <FormInput value={form.stateCode} onChange={v => set("stateCode", v)} placeholder="e.g. GJ" maxLength={2} />
          </FormField>
          
          <FormField label="Area (sq km)">
            <FormInput type="number" value={form.area} onChange={v => set("area", parseInt(v) || "")} placeholder="e.g. 196024" />
          </FormField>
          
          <FormField label="Population">
            <FormInput type="number" value={form.population} onChange={v => set("population", parseInt(v) || "")} placeholder="e.g. 60439692" />
          </FormField>

          <FormField label="Union Territory">
            <div className="pt-2">
              <FormToggle checked={form.isUnionTerritory} onChange={v => set("isUnionTerritory", v)} label="Is UT?" />
            </div>
          </FormField>
        </div>

        <FormField label="Languages (comma separated)" span2>
          <FormInput value={form.languages.join(", ")} onChange={v => handleArrayString("languages", v)} placeholder="e.g. Gujarati, Hindi, English" />
        </FormField>
      </div>
    </CollapsibleModule>
  );
};

export default BasicInfoModule;
