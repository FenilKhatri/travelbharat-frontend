import { FiInfo } from "react-icons/fi";
import Reveal from "../../../../../components/ui/Reveal";
import SectionContainer from "../../../../../components/layout/SectionContainer";
import PageContainer from "../../../../../components/layout/PageContainer";

const StateQuickFacts = ({ quickFacts }) => {
  const quickFactsEntries = quickFacts ? Object.entries(quickFacts).filter(([key]) => key !== "_id" && key !== "id") : [];
  if (quickFactsEntries.length <= 4) return null;

  const remainingFacts = quickFactsEntries.slice(4);

  return (
    <SectionContainer className="bg-white dark:bg-transparent border-b border-slate-200 dark:border-white/5 relative z-10 -mt-10 lg:mt-0 rounded-t-[3rem] lg:rounded-none py-12!">
      <PageContainer>
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {remainingFacts.map(([key, value], index) => {
              const title = key.replace(/([A-Z])/g, " $1").trim();
              return (
                <div key={index} className="bg-slate-50 dark:bg-[#0c1018]/50 p-5 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-[#E85D04]/30 backdrop-blur-sm transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E85D04]/10 border border-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                      <FiInfo size={14} />
                    </div>
                    <p className="text-xs text-slate-500 dark:text-[#4b607a] font-bold uppercase tracking-widest">
                      {title}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 dark:text-[#edf2ff] leading-relaxed">
                    {value}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>
      </PageContainer>
    </SectionContainer>
  );
};

export default StateQuickFacts;
