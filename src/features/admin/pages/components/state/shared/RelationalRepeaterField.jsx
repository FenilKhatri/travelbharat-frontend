import React from 'react';
import { ArrayEditor, FormInput } from '../../../../components/form';

const RelationalRepeaterField = ({
  items = [],
  onAdd,
  onRemove,
  onReorder,
  optionsList = [],
  relationKey = "place",
  placeholder = "Select Item...",
  extraFields = []
}) => {
  return (
    <ArrayEditor
      items={items}
      onAdd={onAdd}
      onRemove={onRemove}
      onReorder={onReorder}
      renderItem={(item, idx, onChange) => (
        <div className={`grid grid-cols-1 sm:grid-cols-${1 + extraFields.length} gap-3`}>
          <select
            value={item[relationKey]?._id || item[relationKey] || ""}
            onChange={e => onChange(relationKey, e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 text-sm"
          >
            <option value="">{placeholder}</option>
            {optionsList.map(opt => (
              <option key={opt._id} value={opt._id}>{opt.name}</option>
            ))}
          </select>
          {extraFields.map(field => (
            <FormInput
              key={field.key}
              value={item[field.key] || ""}
              onChange={v => onChange(field.key, v)}
              placeholder={field.placeholder}
            />
          ))}
        </div>
      )}
    />
  );
};

export default RelationalRepeaterField;
