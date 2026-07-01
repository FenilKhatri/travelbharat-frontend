import React from "react";
import { FiSave, FiTrash2 } from "react-icons/fi";
import CustomDropdown from "../../../../../components/ui/CustomDropdown";

const SystemSettings = ({ 
  settingsLoading, 
  settingsData, 
  deleteSettingMutation, 
  newSetting, 
  setNewSetting, 
  saveSettingMutation 
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Settings List */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 sm:p-8 space-y-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Active Configurations</h3>
          
          {settingsLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-16 bg-slate-100 dark:bg-slate-850 rounded-xl" />
              ))}
            </div>
          ) : settingsData?.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-semibold">
              No system variables found.
            </div>
          ) : (
            <div className="space-y-4">
              {settingsData?.map((setting) => (
                <div 
                  key={setting._id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100 dark:border-slate-800/40 rounded-xl gap-3 hover:shadow-xs transition"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] uppercase font-black bg-[#E85D04]/10 text-[#E85D04] px-2 py-0.5 rounded-sm tracking-wide">
                      {setting.category}
                    </span>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-1">{setting.key}</h5>
                    <p className="text-xs text-slate-400 font-semibold truncate max-w-[300px] mt-0.5">{setting.description || "No description"}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0 justify-between sm:justify-end">
                    <span className="font-bold text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg max-w-[200px] truncate">
                      {setting.value}
                    </span>
                    <button
                      onClick={() => deleteSettingMutation.mutate(setting._id)}
                      className="p-2 text-slate-450 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upsert Setting form */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-[#0A121F] border border-slate-200/80 dark:border-slate-800/40 rounded-2xl shadow-sm p-6 space-y-5">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Save configuration</h3>
          
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              saveSettingMutation.mutate(newSetting);
            }} 
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Key</label>
              <input
                type="text"
                required
                value={newSetting.key}
                onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                placeholder="e.g. SITE_LOGO"
                className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Value</label>
              <input
                type="text"
                required
                value={newSetting.value}
                onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                placeholder="e.g. TravelBharat"
                className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Category</label>
              <CustomDropdown
                value={newSetting.category}
                onChange={(val) => setNewSetting({ ...newSetting, category: val })}
                options={[
                  { value: "general", label: "General" },
                  { value: "social", label: "Social Media" },
                  { value: "contact", label: "Contact Details" },
                  { value: "seo", label: "SEO Configurations" },
                ]}
                placeholder="Select Category"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wider">Description</label>
              <textarea
                rows={2}
                value={newSetting.description}
                onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                placeholder="Describe variable usage..."
                className="w-full px-4 py-2 border border-slate-350 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#E85D04]/20 focus:border-[#E85D04]"
              />
            </div>

            <button
              type="submit"
              disabled={saveSettingMutation.isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E85D04] hover:bg-[#D05203] text-white font-bold rounded-xl text-sm transition cursor-pointer"
            >
              <FiSave size={16} />
              <span>Save Parameter</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
