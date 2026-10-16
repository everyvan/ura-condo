import React from 'react';
import { GLSSite } from '../types';

interface GLSCardProps {
  site: GLSSite;
  isBookmarked: boolean;
  onToggleBookmark: (siteId: string) => void;
  onSimulate: (site: GLSSite) => void;
  onOpenDetails: (site: GLSSite) => void;
}

export const GLSCard: React.FC<GLSCardProps> = ({
  site,
  isBookmarked,
  onToggleBookmark,
  onSimulate,
  onOpenDetails,
}) => {
  const getStatusBadge = () => {
    switch (site.status) {
      case 'preview':
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#6cf8bb] text-[#00714d] font-['Hanken_Grotesk'] text-[11px] font-bold">
            {site.statusLabel}
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#dce9ff] text-[#45464d] font-['Hanken_Grotesk'] text-[11px] font-bold">
            {site.statusLabel}
          </span>
        );
      case 'awarded':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-[#006c49]/10 text-[#006c49] font-['Hanken_Grotesk'] text-[11px] font-bold">
            {site.statusLabel}
          </span>
        );
    }
  };

  const getSubIcon = () => {
    if (site.status === 'preview') return 'schedule';
    if (site.status === 'upcoming') return 'architecture';
    return 'corporate_fare';
  };

  const getHighlightIcon = () => {
    if (site.id.includes('tembusu')) return 'verified';
    if (site.id.includes('lentor')) return 'trending_flat';
    return 'trending_up';
  };

  return (
    <article className="launch-item w-full rounded-2xl bg-white shadow-[0_1px_8px_rgba(11,28,48,0.05)] border border-[#e5eeff] p-4 sm:p-5 flex flex-col gap-3.5 transition-all hover:shadow-md">
      {/* Top District, Status & Bookmark */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#0b1c30] font-['JetBrains_Mono'] text-[11px] font-semibold">
              {site.district}
            </span>
            <span className="px-2 py-0.5 rounded bg-[#e5eeff] text-[#45464d] font-['Hanken_Grotesk'] text-[11px] font-semibold uppercase">
              {site.region}
            </span>
            {getStatusBadge()}
          </div>
          <h4
            onClick={() => onOpenDetails(site)}
            className="font-['Manrope'] text-[17px] sm:text-[18px] text-[#0b1c30] font-bold mt-1.5 hover:text-[#006c49] cursor-pointer transition-colors"
          >
            {site.name}
          </h4>
        </div>

        <button
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark site'}
          onClick={() => onToggleBookmark(site.id)}
          className={`w-9 h-9 flex items-center justify-center rounded-lg bg-[#eff4ff] active:scale-95 transition-all cursor-pointer ${
            isBookmarked ? 'text-[#006c49]' : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
          type="button"
        >
          <span className={`material-symbols-outlined text-[20px] ${isBookmarked ? 'fill text-[#006c49]' : ''}`}>
            {isBookmarked ? 'bookmark' : 'bookmark_border'}
          </span>
        </button>
      </div>

      {/* Developer Consortium Subtitle */}
      <div className="flex items-center gap-2 text-[#45464d] font-['Hanken_Grotesk'] text-[13px]">
        <span className="material-symbols-outlined text-[16px] text-[#45464d] shrink-0">
          {getSubIcon()}
        </span>
        <span className="truncate">
          {site.status === 'awarded' ? (
            <>
              Awarded to <strong className="text-[#0b1c30] font-semibold">{site.developer}</strong>
            </>
          ) : (
            site.tagline
          )}
        </span>
      </div>

      {/* 2x2 Financial Metric Grid */}
      <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
        <div className="flex flex-col">
          <span className="font-['Hanken_Grotesk'] text-[10.5px] text-[#45464d] uppercase font-bold tracking-tight">
            Land Bid Price
          </span>
          <span className="font-['JetBrains_Mono'] text-[13.5px] text-[#0b1c30] font-bold mt-0.5">
            S$ {site.landBidPsf.toLocaleString()}{' '}
            <span className="text-[10px] text-[#45464d] font-normal">PSF PPR</span>
          </span>
        </div>

        <div className="flex flex-col">
          <span className="font-['Hanken_Grotesk'] text-[10.5px] text-[#45464d] uppercase font-bold tracking-tight">
            {site.status === 'preview' ? 'Dev Breakeven' : 'Breakeven Est.'}
          </span>
          <span className="font-['JetBrains_Mono'] text-[13.5px] text-[#0b1c30] font-bold mt-0.5">
            S$ {site.breakevenPsf.toLocaleString()}{' '}
            <span className="text-[10px] text-[#45464d] font-normal">PSF</span>
          </span>
        </div>

        <div className="flex flex-col pt-1">
          <span className="font-['Hanken_Grotesk'] text-[10.5px] text-[#006c49] uppercase font-bold tracking-tight">
            Indicative Launch
          </span>
          <span className="font-['JetBrains_Mono'] text-[13.5px] text-[#006c49] font-extrabold mt-0.5">
            ~S$ {site.indicativeLaunchPsfLow.toLocaleString()}{' '}
            <span className="text-[10px] text-[#006c49]">PSF</span>
          </span>
        </div>

        <div className="flex flex-col pt-1">
          <span className="font-['Hanken_Grotesk'] text-[10.5px] text-[#45464d] uppercase font-bold tracking-tight">
            {site.status === 'preview' ? 'Site Target' : site.status === 'upcoming' ? 'Est. Completion' : 'Estimated Window'}
          </span>
          <span className="font-['JetBrains_Mono'] text-[13.5px] text-[#0b1c30] font-semibold mt-0.5">
            {site.status === 'preview' ? `${site.units} Residences` : site.status === 'upcoming' ? site.estCompletion : site.estimatedWindow}
          </span>
        </div>
      </div>

      {/* Card Footer: Proximity / Buffer & Simulate Button */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-1.5 font-['Hanken_Grotesk'] text-[12px] text-[#006c49] truncate max-w-[65%]">
          <span className="material-symbols-outlined text-[16px] text-[#006c49] shrink-0">
            {getHighlightIcon()}
          </span>
          <span className="font-semibold truncate">{site.marginBufferVsPeers}</span>
        </div>

        <button
          onClick={() => onSimulate(site)}
          type="button"
          className="font-['Hanken_Grotesk'] text-[12px] text-[#000000] uppercase font-extrabold flex items-center gap-1 hover:text-[#006c49] hover:underline cursor-pointer transition-colors shrink-0"
        >
          <span>Simulate</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </button>
      </div>
    </article>
  );
};
