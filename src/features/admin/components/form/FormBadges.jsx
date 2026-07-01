import FormCard from "./FormCard";
import BadgeSelector from "../../components/BadgeSelector";

const FormBadges = ({ 
  badges = [], 
  primaryBadge = "", 
  onBadgesChange, 
  onPrimaryBadgeChange 
}) => {
  return (
    <FormCard title="Badges & Labels" defaultOpen={false}>
      <div className="space-y-4">
        <p className="text-xs text-slate-500">
          Select badges to highlight key characteristics of this destination.
        </p>
        <BadgeSelector
          selectedBadges={badges}
          primaryBadge={primaryBadge}
          onChange={(b, pb) => {
            onBadgesChange(b);
            if (pb !== undefined) onPrimaryBadgeChange(pb);
          }}
        />
      </div>
    </FormCard>
  );
};

export default FormBadges;
