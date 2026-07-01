import { FiClock } from 'react-icons/fi';
import { FormInput, FormTextarea } from '../../../../components/form';
import CollapsibleModule from '../shared/CollapsibleModule';
import RepeaterField from '../shared/RepeaterField';

const HistoryTimelineModule = ({ form, set }) => {
  return (
    <CollapsibleModule title="History Timeline" icon={FiClock} defaultOpen={false}>
      <RepeaterField
        items={form.historyTimeline}
        onAdd={() => set("historyTimeline", [...form.historyTimeline, { year: "", title: "", description: "", image: { url: "" }, order: form.historyTimeline.length }])}
        onRemove={(idx) => set("historyTimeline", form.historyTimeline.filter((_, i) => i !== idx))}
        onReorder={(items) => set("historyTimeline", items)}
        renderItem={(item, idx, onChange) => (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="col-span-full grid grid-cols-2 gap-3">
              <FormInput value={item.year} onChange={v => onChange("year", v)} placeholder="Year / Era (e.g. 15th Century)" />
              <FormInput value={item.title} onChange={v => onChange("title", v)} placeholder="Title" />
            </div>
            <div className="col-span-full">
              <FormTextarea value={item.description} onChange={v => onChange("description", v)} placeholder="Description" rows={2} />
            </div>
          </div>
        )}
      />
    </CollapsibleModule>
  );
};

export default HistoryTimelineModule;
