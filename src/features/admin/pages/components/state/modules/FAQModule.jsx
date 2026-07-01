import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';
import { FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';

const FAQModule = ({ form, set }) => {
  return (
    <CollapsibleModule title="FAQ" icon={FiHelpCircle} defaultOpen={false}>
      <RepeaterField
        items={form.faq}
        onAdd={() => set("faq", [...form.faq, { question: "", answer: "" }])}
        onRemove={(idx) => set("faq", form.faq.filter((_, i) => i !== idx))}
        onReorder={(items) => set("faq", items)}
        renderItem={(item, idx, onChange) => (
          <div className="flex flex-col gap-3">
            <FormInput value={item.question} onChange={v => onChange("question", v)} placeholder="Question" />
            <FormTextarea value={item.answer} onChange={v => onChange("answer", v)} placeholder="Answer" />
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default FAQModule;
