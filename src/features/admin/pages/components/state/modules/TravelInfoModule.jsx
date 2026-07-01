import React from 'react';
import { FiNavigation } from 'react-icons/fi';
import { FormField, FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';

const TravelInfoModule = ({ form, set }) => {
  return (
    <CollapsibleModule title="Travel Information" icon={FiNavigation} defaultOpen={false}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="By Air">
          <FormTextarea value={form.travelInfo.byAir} onChange={v => set("travelInfo.byAir", v)} rows={2} />
        </FormField>
        <FormField label="By Train">
          <FormTextarea value={form.travelInfo.byTrain} onChange={v => set("travelInfo.byTrain", v)} rows={2} />
        </FormField>
        <FormField label="By Road">
          <FormTextarea value={form.travelInfo.byRoad} onChange={v => set("travelInfo.byRoad", v)} rows={2} />
        </FormField>
        <FormField label="Local Transport">
          <FormTextarea value={form.travelInfo.localTransport} onChange={v => set("travelInfo.localTransport", v)} rows={2} />
        </FormField>
        <FormField label="Major Airport">
          <FormInput value={form.travelInfo.airport} onChange={v => set("travelInfo.airport", v)} placeholder="e.g. IGI Airport, Delhi" />
        </FormField>
        <FormField label="Nearest Major City">
          <FormInput value={form.travelInfo.nearestMajorCity} onChange={v => set("travelInfo.nearestMajorCity", v)} placeholder="e.g. Mumbai" />
        </FormField>
      </div>
    </CollapsibleModule>
  );
};

export default TravelInfoModule;
