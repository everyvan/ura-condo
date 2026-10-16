import React, { useState, useMemo } from 'react';
import { GLSSite } from '../types';
import { IndicativeForecaster } from './IndicativeForecaster';
import { GLSCard } from './GLSCard';
import { CaveatBenchmarkCard } from './CaveatBenchmarkCard';

interface LaunchesViewProps {
  sites: GLSSite[];
  bookmarkedIds: Set<string>;
  onToggleBookmark: (siteId: string) => void;
  onOpenDetails: (site: GLSSite) => void;
  onGeneratePitch: () => void;
  landCost: number;
  onLandCostChange: (cost: number) => void;
  overheadCost: number;
  onOverheadCostChange: (cost: number) => void;
  marginPercent: number;
  onMarginPercentChange: (margin: number) => void;
  simulatedSiteName: string | null;
  onSetSimulatedSite: (site: GLSSite) => void;
  onResetSimulatedSite: () => void;
  filterOnlySaved?: boolean;
}

export const LaunchesView: React.FC<LaunchesViewProps> = ({
  sites,
  bookmarkedIds,
  onToggleBookmark,
  onOpenDetails,
  onGeneratePitch,
  landCost,
  onLandCostChange,
  overheadCost,
  onOverheadCostChange,
  marginPercent,
  onMarginPercentChange,
  simulatedSiteName,
  onSetSimulatedSite,
  onResetSimulatedSite,
  filterOnlySaved = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'awarded' | 'preview' | 'upcoming' | 'CCR' | 'RCR' | 'OCR'>('all');

  // Filtered sites
  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      // Bookmark check
      if (filterOnlySaved && !bookmarkedIds.has(site.id)) {
        return false;
      }

      // Status / Region filter
      if (activeFilter === 'awarded' && site.status !== 'awarded') return false;
      if (activeFilter === 'preview' && site.status !== 'preview') return false;
      if (activeFilter === 'upcoming' && site.status !== 'upcoming') return false;
      if (['CCR', 'RCR', 'OCR'].includes(activeFilter) && site.region !== activeFilter) return false;

      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = site.name.toLowerCase().includes(query);
        const matchesDistrict = site.district.toLowerCase().includes(query);
        const matchesDev = site.developer.toLowerCase().includes(query);
        const matchesLoc = site.location.toLowerCase().includes(query);
        return matchesName || matchesDistrict || matchesDev || matchesLoc;
      }

      return true;
    });
  }, [sites, activeFilter, searchTerm, filterOnlySaved, bookmarkedIds]);

  const handleSimulate = (site: GLSSite) => {
    onSetSimulatedSite(site);
    onLandCostChange(site.landBidPsf);
    // Smooth scroll back to forecaster widget
    const el = document.getElementById('forecaster-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 pb-6">
      {/* Search & Segment Filter Engine */}
      <div className="flex flex-col gap-3">
        {/* Live Search Bar */}
        <div className="relative flex items-center w-full">
          <span className="material-symbols-outlined absolute left-3.5 text-[#45464d] text-[20px] pointer-events-none">
            search
          </span>
          <input
            type="text"
            id="gls-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search GLS site (e.g. Pine Grove, D15, Lentor)..."
            className="w-full h-12 pl-11 pr-10 rounded-xl bg-[#eff4ff] text-[#0b1c30] placeholder:text-[#45464d] font-['Hanken_Grotesk'] text-[14px] shadow-sm outline-none border border-transparent transition-all duration-200 focus:bg-white focus:border-[#dce9ff] focus:shadow-md"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              aria-label="Clear Search"
              className="absolute right-3 w-6 h-6 flex items-center justify-center rounded-full bg-[#dce9ff] text-[#45464d] hover:bg-[#c6c6cd] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>

        {/* Filter Chips (Horizontal Scroll) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
          <button
            type="button"
            onClick={() => setActiveFilter('all')}
            className={`filter-chip shrink-0 px-3.5 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[11px] font-bold tracking-wide shadow-sm transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#000000] text-white'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] border border-[#dce9ff]'
            }`}
          >
            All GLS Sites
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('awarded')}
            className={`filter-chip shrink-0 px-3.5 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
              activeFilter === 'awarded'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] border border-[#dce9ff]'
            }`}
          >
            Awarded Land
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('preview')}
            className={`filter-chip shrink-0 px-3.5 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
              activeFilter === 'preview'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] border border-[#dce9ff]'
            }`}
          >
            Previewing Soon
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('upcoming')}
            className={`filter-chip shrink-0 px-3.5 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
              activeFilter === 'upcoming'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] border border-[#dce9ff]'
            }`}
          >
            Upcoming GLS
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('RCR')}
            className={`filter-chip shrink-0 px-3 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
              activeFilter === 'RCR'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] border border-[#dce9ff]'
            }`}
          >
            RCR
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('OCR')}
            className={`filter-chip shrink-0 px-3 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
              activeFilter === 'OCR'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] border border-[#dce9ff]'
            }`}
          >
            OCR
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('CCR')}
            className={`filter-chip shrink-0 px-3 py-1.5 rounded-full font-['Hanken_Grotesk'] text-[11px] font-bold tracking-wide transition-all cursor-pointer ${
              activeFilter === 'CCR'
                ? 'bg-[#000000] text-white shadow-sm'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30] border border-[#dce9ff]'
            }`}
          >
            CCR
          </button>
        </div>
      </div>

      {/* Hero Interactive Calculator: Land-to-Price Forecaster */}
      <IndicativeForecaster
        landCost={landCost}
        onLandCostChange={onLandCostChange}
        overheadCost={overheadCost}
        onOverheadCostChange={onOverheadCostChange}
        marginPercent={marginPercent}
        onMarginPercentChange={onMarginPercentChange}
        onGeneratePitch={onGeneratePitch}
        simulatedSiteName={simulatedSiteName}
        onResetSiteName={onResetSimulatedSite}
      />

      {/* Section Header: Featured Upcoming Launches */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <h3 className="font-['Manrope'] text-[20px] font-bold text-[#0b1c30]">
            Featured GLS Launches
          </h3>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[#dce9ff] text-[#45464d] font-['JetBrains_Mono'] text-[11px] font-bold">
            {filteredSites.length}
          </span>
        </div>
        <span className="font-['Hanken_Grotesk'] text-[11px] text-[#006c49] font-extrabold uppercase tracking-wider">
          H1 2025 Pipeline
        </span>
      </div>

      {/* GLS Pipeline Cards */}
      <div className="flex flex-col gap-3.5" id="launches-container">
        {filteredSites.length === 0 ? (
          <div className="w-full p-8 text-center bg-white rounded-2xl border border-[#e5eeff] flex flex-col items-center gap-2">
            <span className="material-symbols-outlined text-[32px] text-[#45464d]">search_off</span>
            <p className="font-['Manrope'] font-bold text-[#0b1c30]">No matching GLS sites found</p>
            <p className="text-[13px] text-[#45464d]">
              Try searching for a different district or reset your filter chips.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveFilter('all');
              }}
              className="mt-2 px-4 py-2 bg-[#000000] text-white text-[12px] font-bold rounded-lg cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredSites.map((site) => (
            <GLSCard
              key={site.id}
              site={site}
              isBookmarked={bookmarkedIds.has(site.id)}
              onToggleBookmark={onToggleBookmark}
              onSimulate={handleSimulate}
              onOpenDetails={onOpenDetails}
            />
          ))
        )}
      </div>

      {/* URA Benchmark Caveats Snapshot Card */}
      <CaveatBenchmarkCard
        siteName={simulatedSiteName ? `${simulatedSiteName} Indicative` : undefined}
        indicativePsf={landCost ? Math.round((landCost + overheadCost) * 1.2 / 10) * 10 : undefined}
      />

      {/* Regulatory Attribution & Singapore Open Data Disclaimer */}
      <footer className="pt-2 pb-4 flex flex-col gap-2 text-center text-[#45464d]">
        <div className="flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
          <span className="font-['Hanken_Grotesk'] text-[11px] uppercase tracking-wider font-bold text-[#0b1c30]">
            Government Land Sales (GLS) Registry
          </span>
        </div>
        <p className="font-['Hanken_Grotesk'] text-[12px] leading-relaxed px-2 text-[#45464d]">
          Contains information from Urban Redevelopment Authority (URA) and Singapore Land Authority (SLA) accessed under the Singapore Open Data Licence version 1.0. Forecaster output is indicative and should not be construed as financial or investment advice.
        </p>
      </footer>
    </div>
  );
};
