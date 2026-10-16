import React from 'react';

interface HeaderProps {
  currentTab: string;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onToggleSaved: () => void;
  isFilterSaved: boolean;
  savedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  onToggleSaved,
  isFilterSaved,
  savedCount,
}) => {
  const getTabLabel = () => {
    switch (currentTab) {
      case 'land-calc':
        return 'LAND CALC';
      case 'comparables':
        return 'COMPARABLES';
      case 'saved-reports':
        return 'SAVED REPORTS';
      default:
        return 'LAUNCHES';
    }
  };

  return (
    <header className="fixed top-0 w-full z-40 bg-[#f8f9ff]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe transition-all border-b border-[#e5eeff]/80">
      <div className="max-w-2xl mx-auto h-16 px-4 flex items-center justify-between">
        {/* Left: Brand & Live URA Pill */}
        <div className="flex flex-col justify-center gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-['Manrope'] text-[17px] sm:text-[18px] text-[#0b1c30] tracking-tight font-extrabold flex items-center gap-1.5">
              PropLaunch SG
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#006c49]/10 text-[#006c49] font-['JetBrains_Mono'] text-[10.5px] sm:text-[11px] font-semibold border border-[#006c49]/15">
              <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span>
              URA &amp; GLS Live Data
            </span>
          </div>
          <span className="font-['Hanken_Grotesk'] text-[11px] uppercase tracking-wider text-[#45464d] font-bold">
            {getTabLabel()}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1">
          {/* Notifications Button */}
          <button
            aria-label="Notifications"
            onClick={onOpenNotifications}
            className="relative w-10 h-10 flex items-center justify-center rounded-lg text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff] active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            )}
          </button>

          {/* Bookmark Quick Toggle */}
          <button
            aria-label="Bookmarks and Saved Sites"
            onClick={onToggleSaved}
            className={`w-10 h-10 flex items-center justify-center rounded-lg active:scale-95 transition-all cursor-pointer ${
              isFilterSaved
                ? 'text-[#006c49] bg-[#006c49]/10 font-bold'
                : 'text-[#45464d] hover:text-[#0b1c30] hover:bg-[#eff4ff]'
            }`}
            title={isFilterSaved ? 'Show All Sites' : `Filter Bookmarked (${savedCount})`}
            type="button"
          >
            <span className={`material-symbols-outlined text-[22px] ${isFilterSaved ? 'fill text-[#006c49]' : ''}`}>
              bookmark
            </span>
            {savedCount > 0 && !isFilterSaved && (
              <span className="absolute bottom-1.5 right-1.5 min-w-[14px] h-[14px] px-0.5 text-[9px] font-bold rounded-full bg-[#006c49] text-white flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* Profile / Agent Settings Avatar */}
          <button
            onClick={onOpenProfile}
            aria-label="Agent Profile"
            className="w-8 h-8 ml-1 rounded-full bg-[#000000] text-white flex items-center justify-center shadow-sm hover:opacity-90 active:scale-95 transition cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
