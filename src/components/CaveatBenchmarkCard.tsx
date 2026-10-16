import React, { useState } from 'react';

interface CaveatBenchmarkCardProps {
  districtName?: string;
  indicativePsf?: number;
  siteName?: string;
}

export const CaveatBenchmarkCard: React.FC<CaveatBenchmarkCardProps> = ({
  districtName = 'District 21 Clementi',
  indicativePsf = 2280,
  siteName = 'Pine Grove Parcel B Indicative',
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<'D21' | 'D15' | 'D26' | 'D10'>('D21');

  // Benchmark datasets
  const benchmarks = {
    D21: {
      title: 'District 21 Caveat Benchmark',
      subtitle: 'URA REALIS Transaction Feed',
      buffer: '+4.5% Buffer',
      benchmarkName: 'D21 Recent 99-yr Transacted Avg',
      benchmarkPsf: 2180,
      indicativeName: siteName || 'Pine Grove Parcel B Indicative',
      indicativePsf: indicativePsf || 2280,
      count: 148,
      guideline: 'Spread aligns with institutional tender guidelines.',
    },
    D15: {
      title: 'District 15 Caveat Benchmark',
      subtitle: 'URA REALIS Transaction Feed',
      buffer: '+1.2% Buffer',
      benchmarkName: 'D15 Recent 99-yr Transacted Avg',
      benchmarkPsf: 2420,
      indicativeName: 'Jalan Tembusu Indicative Launch',
      indicativePsf: 2450,
      count: 214,
      guideline: 'Strong East Coast demand absorbing RCR inventory.',
    },
    D26: {
      title: 'District 26 Caveat Benchmark',
      subtitle: 'URA REALIS Transaction Feed',
      buffer: '-1.4% Value Edge',
      benchmarkName: 'D26 Lentor Hills Transacted Avg',
      benchmarkPsf: 2095,
      indicativeName: 'Lentor Central Indicative',
      indicativePsf: 2040,
      count: 182,
      guideline: 'Attractive entry below recent high-floor caveats.',
    },
    D10: {
      title: 'District 10 Caveat Benchmark',
      subtitle: 'URA REALIS Transaction Feed',
      buffer: '+6.2% Buffer',
      benchmarkName: 'D10 Holland/Farrer Transacted Avg',
      benchmarkPsf: 2680,
      indicativeName: 'Holland Drive Indicative Launch',
      indicativePsf: 2850,
      count: 96,
      guideline: 'Prime core central region scarcity premium.',
    },
  };

  const active = benchmarks[selectedDistrict] || benchmarks.D21;
  const maxScale = Math.max(active.benchmarkPsf, active.indicativePsf) * 1.15;
  const benchmarkWidth = Math.round((active.benchmarkPsf / maxScale) * 100);
  const indicativeWidth = Math.round((active.indicativePsf / maxScale) * 100);

  return (
    <div className="w-full rounded-2xl bg-white shadow-[0_1px_8px_rgba(11,28,48,0.05)] border border-[#e5eeff] p-4.5 sm:p-5 flex flex-col gap-3.5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#006c49]/15 flex items-center justify-center text-[#006c49]">
            <span className="material-symbols-outlined text-[20px]">domain_verification</span>
          </div>
          <div className="flex flex-col">
            <h4 className="font-['Manrope'] text-[16px] sm:text-[17px] font-bold text-[#0b1c30]">
              {active.title}
            </h4>
            <span className="font-['Hanken_Grotesk'] text-[11px] text-[#45464d] font-medium">
              {active.subtitle}
            </span>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full bg-[#006c49]/10 text-[#006c49] font-['JetBrains_Mono'] text-[11px] font-bold flex items-center gap-0.5 border border-[#006c49]/15">
          <span className="material-symbols-outlined text-[14px]">arrow_upward</span>
          {active.buffer}
        </span>
      </div>

      {/* Quick District Switcher Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
        {(['D21', 'D15', 'D26', 'D10'] as const).map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDistrict(d)}
            className={`px-2.5 py-1 rounded-md font-['JetBrains_Mono'] transition cursor-pointer ${
              selectedDistrict === d
                ? 'bg-[#000000] text-white font-bold'
                : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30]'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Comparative Visual Bars */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Benchmark 1 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-['Hanken_Grotesk'] text-[12.5px]">
            <span className="text-[#45464d]">{active.benchmarkName}</span>
            <span className="font-['JetBrains_Mono'] text-[13px] font-bold text-[#0b1c30]">
              S$ {active.benchmarkPsf.toLocaleString()} PSF
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#dce9ff] overflow-hidden">
            <div
              className="h-full bg-[#45464d] rounded-full transition-all duration-500"
              style={{ width: `${benchmarkWidth}%` }}
            ></div>
          </div>
        </div>

        {/* Benchmark 2 */}
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between font-['Hanken_Grotesk'] text-[12.5px]">
            <span className="text-[#0b1c30] font-semibold">{active.indicativeName}</span>
            <span className="font-['JetBrains_Mono'] text-[13px] font-extrabold text-[#006c49]">
              S$ {active.indicativePsf.toLocaleString()} PSF
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#dce9ff] overflow-hidden">
            <div
              className="h-full bg-[#006c49] rounded-full transition-all duration-500"
              style={{ width: `${indicativeWidth}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Micro Context Callout */}
      <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-start gap-2.5">
        <span className="material-symbols-outlined text-[#006c49] text-[18px] shrink-0 mt-0.5">
          info
        </span>
        <p className="font-['Hanken_Grotesk'] text-[12px] leading-relaxed text-[#45464d]">
          Caveat data reflects <strong className="text-[#0b1c30] font-semibold">{active.count} registered transactions</strong> over the trailing 90 days. {active.guideline}
        </p>
      </div>
    </div>
  );
};
