import React from "react";

const AdminPageLayout = ({ title, subtitle, actions, children }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Actions (Create button, view toggles, etc.) */}
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {children}
    </div>
  );
};

export default AdminPageLayout;
