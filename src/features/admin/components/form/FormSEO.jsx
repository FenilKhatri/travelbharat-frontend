import { FiSearch } from "react-icons/fi";
import FormCard from "./FormCard";
import FormField from "./FormField";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";

const FormSEO = ({ seo = { metaTitle: "", metaDescription: "", keywords: [] }, onChange }) => {
  const setSEO = (key, value) => {
    onChange({ ...seo, [key]: value });
  };

  const handleKeywords = (rawStr) => {
    const arr = rawStr.split(",").map((s) => s.trim()).filter(Boolean);
    setSEO("keywords", arr);
  };

  return (
    <FormCard title="SEO Configuration" icon={FiSearch} defaultOpen={false}>
      <div className="space-y-5">
        <FormField label="Meta Title" helpText="Ideal length: 50-60 characters">
          <FormInput
            value={seo?.metaTitle || ""}
            onChange={(val) => setSEO("metaTitle", val)}
            placeholder="e.g. Visit Gujarat - Ultimate Travel Guide"
            maxLength={100}
            showCount
          />
        </FormField>

        <FormField label="Meta Description" helpText="Ideal length: 150-160 characters">
          <FormTextarea
            value={seo?.metaDescription || ""}
            onChange={(val) => setSEO("metaDescription", val)}
            placeholder="Brief summary of the page content for search engines..."
            maxLength={250}
            showCount
            rows={2}
          />
        </FormField>

        <FormField label="Keywords (comma separated)">
          <FormInput
            value={(seo?.keywords || []).join(", ")}
            onChange={handleKeywords}
            placeholder="e.g. Gujarat travel, Rann of Kutch, Statue of Unity"
          />
          {seo?.keywords && seo.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {seo.keywords.map((kw, i) => (
                <span key={i} className="text-xs px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700">
                  {kw}
                </span>
              ))}
            </div>
          )}
        </FormField>
      </div>
    </FormCard>
  );
};

export default FormSEO;
