import React from 'react';
import { FormSEO } from '../../../../components/form';

const SeoModule = ({ form, set }) => {
  return (
    <FormSEO seo={form.seo} onChange={(seo) => set("seo", seo)} />
  );
};

export default SeoModule;
