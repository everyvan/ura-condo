import React from 'react';

interface BottomNavProps {
  currentTab: string;
  onTabChange: (tabId: string) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  savedCount,
}) => {
  const tabs = [
    { id: 'launches', label: 'Launches', icon: 'apartment' },
    { id: 'land-calc', label: 'Land Calc', icon: 'calculate' },
    { id: 'comparables', label: 'Comparables', icon: 'analytics' },
    { id: 'saved-reports', label: 'Saved Reports', icon: 'folder_special', badge: savedCount },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#f8f9ff]/95 backdrop-blur-xl shadow-[0_-2px_12px_rgba(11,28,48,0.06)] border-t border-[#e5eeff]">
      <div className="max-w-2xl mx-auto flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center min-w-[64px] min-h-[46px] gap-1 transition-all cursor-pointer relative ${
                isActive
                  ? 'text-[#006c49] font-bold scale-[1.02]'
                  : 'text-[#45464d] hover:text-[#0b1c30]'
              }`}
              type="button"
            >
              <div className="relative">
                <span className={`material-symbols-outlined text-[23px] ${isActive ? 'fill text-[#006c49]' : ''}`}>
                  {tab.icon}
                </span>
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 min-w-[15px] h-[15px] px-1 bg-[#006c49] text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="font-['Hanken_Grotesk'] text-[11px] font-bold tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
