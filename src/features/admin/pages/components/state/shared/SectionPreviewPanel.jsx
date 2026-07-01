import React from 'react';

const SectionPreviewPanel = ({ children, title }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-4 border border-slate-200 dark:border-slate-800">
      {title && <h5 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">{title}</h5>}
      {children}
    </div>
  );
};

export default SectionPreviewPanel;
