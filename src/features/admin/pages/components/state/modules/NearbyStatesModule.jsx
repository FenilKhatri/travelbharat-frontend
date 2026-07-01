import React from 'react';
import { FiGlobe } from 'react-icons/fi';
import CollapsibleModule from '../shared/CollapsibleModule';

const NearbyStatesModule = ({ form, set, statesList }) => {
  return (
    <CollapsibleModule title="Nearby States" icon={FiGlobe} defaultOpen={false}>
      <div className="flex flex-wrap gap-2">
        {statesList.map(st => (
          <label 
            key={st._id} 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm cursor-pointer transition-colors ${
              form.nearbyStates.includes(st._id) 
                ? "bg-[#E85D04]/10 border-[#E85D04] text-[#E85D04] font-bold" 
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
            }`}
          >
            <input 
              type="checkbox" 
              className="hidden" 
              checked={form.nearbyStates.includes(st._id)}
              onChange={(e) => {
                const isChecked = e.target.checked;
                if (isChecked) set("nearbyStates", [...form.nearbyStates, st._id]);
                else set("nearbyStates", form.nearbyStates.filter(id => id !== st._id));
              }}
            />
            {st.name}
          </label>
        ))}
      </div>
      {statesList.length === 0 && (
        <p className="text-sm text-slate-400 text-center py-4">No other states available.</p>
      )}
    </CollapsibleModule>
  );
};

export default NearbyStatesModule;
