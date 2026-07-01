import React from 'react';
import { FormCard } from '../../../../components/form';

const CollapsibleModule = ({ title, icon, defaultOpen = true, children }) => {
  return (
    <FormCard title={title} icon={icon} defaultOpen={defaultOpen}>
      {children}
    </FormCard>
  );
};

export default CollapsibleModule;
