import React from 'react';
import { GLSSite } from '../types';

interface SiteDetailModalProps {
  site: GLSSite | null;
  onClose: () => void;
  onSimulate: (site: GLSSite) => void;
  isBookmarked: boolean;
  onToggleBookmark: (siteId: string) => void;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  onClose,
  onSimulate,
  isBookmarked,
  onToggleBookmark,
}) => {
  if (!site) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#eff4ff] border-b border-[#dce9ff]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#dce9ff] text-[#0b1c30] font-['JetBrains_Mono'] text-[11px] font-bold">
              {site.district}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#006c49]/10 text-[#006c49] font-['Hanken_Grotesk'] text-[11px] font-bold">
              {site.statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleBookmark(site.id)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer ${
                isBookmarked ? 'text-[#006c49] bg-[#006c49]/10' : 'text-[#45464d] hover:bg-[#dce9ff]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isBookmarked ? 'fill' : ''}`}>
                {isBookmarked ? 'bookmark' : 'bookmark_border'}
              </span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#dce9ff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
          <div>
            <h3 className="font-['Manrope'] text-[20px] font-extrabold text-[#0b1c30]">
              {site.name}
            </h3>
            <p className="text-[13px] text-[#45464d] mt-0.5">
              Location: {site.location} • Region: {site.region}
            </p>
          </div>

          {/* Developer Consortium Banner */}
          <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#dce9ff] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#000000] text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">corporate_fare</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10.5px] uppercase font-bold text-[#45464d]">
                Successful Tender Consortium
              </span>
              <span className="font-['Manrope'] text-[14px] font-bold text-[#0b1c30]">
                {site.developer}
              </span>
            </div>
          </div>

          {/* Planning Metrics Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
              <span className="text-[10.5px] text-[#45464d] font-bold uppercase block">
                Land Bid PSF PPR
              </span>
              <span className="font-['JetBrains_Mono'] text-[15px] font-bold text-[#006c49] mt-0.5 block">
                S$ {site.landBidPsf.toLocaleString()}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
              <span className="text-[10.5px] text-[#45464d] font-bold uppercase block">
                Dev Breakeven Est.
              </span>
              <span className="font-['JetBrains_Mono'] text-[15px] font-bold text-[#0b1c30] mt-0.5 block">
                S$ {site.breakevenPsf.toLocaleString()} PSF
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
              <span className="text-[10.5px] text-[#45464d] font-bold uppercase block">
                Site Area (sqm)
              </span>
              <span className="font-['JetBrains_Mono'] text-[13px] font-semibold text-[#0b1c30] mt-0.5 block">
                {site.siteAreaSqm.toLocaleString()} sqm
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
              <span className="text-[10.5px] text-[#45464d] font-bold uppercase block">
                Target Capacity
              </span>
              <span className="font-['JetBrains_Mono'] text-[13px] font-semibold text-[#0b1c30] mt-0.5 block">
                ~{site.units} Units (GPR {site.gpr})
              </span>
            </div>
          </div>

          {/* Location & Transport Proximity */}
          <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
            <div className="flex items-center gap-2 text-[13px] font-bold text-[#0b1c30]">
              <span className="material-symbols-outlined text-[#006c49] text-[18px]">train</span>
              <span>MRT Transit Proximity</span>
            </div>
            <p className="text-[12.5px] text-[#45464d]">{site.mrtProximity}</p>
          </div>

          {/* Schools within 1km */}
          {site.schoolsWithin1km && site.schoolsWithin1km.length > 0 && (
            <div className="flex flex-col gap-2 p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
              <div className="flex items-center gap-2 text-[13px] font-bold text-[#0b1c30]">
                <span className="material-symbols-outlined text-[#006c49] text-[18px]">school</span>
                <span>Schools within 1km (Priority Admission)</span>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {site.schoolsWithin1km.map((school) => (
                  <span
                    key={school}
                    className="px-2.5 py-1 rounded-md bg-white border border-[#dce9ff] text-[11px] font-medium text-[#0b1c30]"
                  >
                    {school}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                onSimulate(site);
                onClose();
              }}
              className="flex-1 h-12 bg-[#000000] text-white rounded-xl font-['Manrope'] font-bold text-[14px] flex items-center justify-center gap-1.5 hover:bg-[#213145] transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">query_stats</span>
              <span>Load in Forecaster</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
