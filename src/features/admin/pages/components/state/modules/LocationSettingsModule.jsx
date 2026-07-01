import React from 'react';
import { FiMapPin } from 'react-icons/fi';
import { FormField, FormInput, FormToggle } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';

const LocationSettingsModule = ({ form, set }) => {
  return (
    <CollapsibleModule title="Location & Settings" icon={FiMapPin} defaultOpen={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Map Latitude">
          <FormInput type="number" step="any" value={form.mapCoordinates.lat} onChange={v => set("mapCoordinates.lat", parseFloat(v) || 0)} />
        </FormField>
        <FormField label="Map Longitude">
          <FormInput type="number" step="any" value={form.mapCoordinates.lng} onChange={v => set("mapCoordinates.lng", parseFloat(v) || 0)} />
        </FormField>
        <FormField label="Display Priority">
          <FormInput type="number" min={0} value={form.priority} onChange={v => set("priority", parseInt(v) || 0)} />
        </FormField>
        <div className="md:col-span-2 flex gap-6 flex-wrap p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
          <FormToggle checked={form.featured} onChange={v => set("featured", v)} label="Featured State" />
          <FormToggle checked={form.isActive} onChange={v => set("isActive", v)} label="Publicly Active" accent="#22c55e" />
        </div>
      </div>
    </CollapsibleModule>
  );
};

export default LocationSettingsModule;
