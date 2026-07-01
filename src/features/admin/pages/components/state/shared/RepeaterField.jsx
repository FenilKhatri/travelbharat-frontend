import React from 'react';
import { ArrayEditor } from '../../../../components/form';

const RepeaterField = ({ 
  items = [], 
  onAdd, 
  onRemove, 
  onReorder, 
  addLabel = "Add Item", 
  emptyText = "No items added yet.",
  renderItem,
  maxItems = null 
}) => {
  return (
    <ArrayEditor 
      items={items}
      onAdd={onAdd}
      onRemove={onRemove}
      onReorder={onReorder}
      addLabel={addLabel}
      emptyText={emptyText}
      renderItem={renderItem}
      maxItems={maxItems}
    />
  );
};

export default RepeaterField;
