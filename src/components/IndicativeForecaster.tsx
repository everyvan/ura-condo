import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface IndicativeForecasterProps {
  landCost: number;
  onLandCostChange: (cost: number) => void;
  overheadCost: number;
  onOverheadCostChange: (cost: number) => void;
  marginPercent: number;
  onMarginPercentChange: (margin: number) => void;
  onGeneratePitch: () => void;
  simulatedSiteName?: string | null;
  onResetSiteName?: () => void;
}

export const IndicativeForecaster: React.FC<IndicativeForecasterProps> = ({
  landCost,
  onLandCostChange,
  overheadCost,
  onOverheadCostChange,
  marginPercent,
  onMarginPercentChange,
  onGeneratePitch,
  simulatedSiteName,
  onResetSiteName,
}) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Calculations
  const breakeven = landCost + overheadCost;
  
  // High & low margin boundaries based on selected margin
  const lowMarginFactor = 1 + (marginPercent - 2) / 100;
  const highMarginFactor = 1 + (marginPercent + 5) / 100;

  const lowPrice = Math.round((breakeven * lowMarginFactor) / 10) * 10;
  const highPrice = Math.round((breakeven * highMarginFactor) / 10) * 10;
  const avgPrice = (lowPrice + highPrice) / 2;

  // Indicative quantums in Millions
  const q1br = ((avgPrice * 480) / 1000000).toFixed(2);
  const q2br = ((avgPrice * 680) / 1000000).toFixed(2);
  const q3br = ((avgPrice * 950) / 1000000).toFixed(2);
  const q4br = ((avgPrice * 1300) / 1000000).toFixed(2);

  const presets = [
    { label: '$950 (OCR)', value: 950 },
    { label: '$1,220 (RCR)', value: 1220 },
    { label: '$1,450 (Prime)', value: 1450 },
  ];

  const handleGenerateClick = () => {
    setIsGenerating(true);
    // Fire festive fintech celebratory confetti
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#006c49', '#6cf8bb', '#131b2e'],
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setIsGenerating(false);
      onGeneratePitch();
    }, 450);
  };

  return (
    <div
      id="forecaster-card"
      className="w-full rounded-2xl bg-white shadow-[0_2px_12px_rgba(11,28,48,0.06)] border border-[#e5eeff] p-4.5 sm:p-5 flex flex-col gap-4 relative overflow-hidden transition-all duration-300"
    >
      {/* Subtle Ambient Green Glaze Corner */}
      <div className="absolute -right-16 -top-16 w-44 h-44 bg-[#006c49]/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Header Info */}
      <div className="flex items-start justify-between relative z-10">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#006c49] text-[18px]">query_stats</span>
            <span className="font-['Hanken_Grotesk'] text-[11px] uppercase tracking-wider text-[#006c49] font-bold">
              Algorithm Tool
            </span>
          </div>
          <h2 className="font-['Manrope'] text-[20px] sm:text-[22px] font-bold text-[#0b1c30] tracking-tight leading-snug">
            Indicative Launch Price Forecaster
          </h2>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#45464d] font-['JetBrains_Mono'] text-[11px] font-semibold">
            GLS v2.4
          </span>
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            aria-label="Cost configuration"
            className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
              showAdvancedSettings ? 'bg-[#000000] text-white' : 'bg-[#eff4ff] text-[#45464d] hover:text-[#0b1c30]'
            }`}
            title="Adjust Construction & Margin parameters"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </button>
        </div>
      </div>

      {/* Simulated Site Banner if Active */}
      {simulatedSiteName && (
        <div className="px-3 py-1.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-1.5 text-[12px] font-['Hanken_Grotesk'] text-[#0b1c30]">
            <span className="material-symbols-outlined text-[16px] text-[#006c49]">check_circle</span>
            <span>
              Simulating site: <strong className="font-semibold text-[#006c49]">{simulatedSiteName}</strong>
            </span>
          </div>
          {onResetSiteName && (
            <button
              onClick={onResetSiteName}
              className="text-[11px] text-[#45464d] hover:text-[#ba1a1a] font-medium underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      )}

      {/* Advanced Tuning Drawer (Toggleable) */}
      {showAdvancedSettings && (
        <div className="p-3.5 rounded-xl bg-[#f8f9ff] border border-[#dce9ff] flex flex-col gap-3 text-[12px]">
          <div className="flex items-center justify-between font-semibold text-[#0b1c30]">
            <span>Model Parameters Calibration</span>
            <span className="text-[11px] text-[#006c49] font-normal">Singapore URA & BCA Framework</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#45464d] block mb-1">Build &amp; Overheads PSF</label>
              <div className="flex items-center gap-1 bg-white border border-[#c6c6cd] rounded-lg px-2 py-1">
                <span className="text-[#45464d] font-mono text-[11px]">S$</span>
                <input
                  type="number"
                  value={overheadCost}
                  onChange={(e) => onOverheadCostChange(Number(e.target.value) || 420)}
                  className="w-full font-['JetBrains_Mono'] font-bold text-[#0b1c30] outline-none text-[13px]"
                />
              </div>
            </div>

            <div>
              <label className="text-[#45464d] block mb-1">Developer Target Margin</label>
              <div className="flex items-center gap-1">
                {[15, 18, 20, 25].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onMarginPercentChange(m)}
                    className={`flex-1 py-1 rounded-md text-[11px] font-['JetBrains_Mono'] font-bold transition cursor-pointer ${
                      marginPercent === m
                        ? 'bg-[#006c49] text-white'
                        : 'bg-white border border-[#c6c6cd] text-[#45464d] hover:bg-[#eff4ff]'
                    }`}
                  >
                    +{m}%
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Land Cost PSF PPR Control Card */}
      <div className="flex flex-col gap-2.5 bg-[#eff4ff] p-3.5 sm:p-4 rounded-xl border border-[#dce9ff]">
        <div className="flex items-center justify-between">
          <span className="font-['Hanken_Grotesk'] text-[13px] text-[#45464d] font-semibold">
            Land Tender Cost
          </span>
          <span className="font-['JetBrains_Mono'] text-[16px] sm:text-[18px] text-[#000000] font-bold">
            S$ {landCost.toLocaleString()}{' '}
            <span className="text-[#45464d] text-[11px] font-normal">PSF PPR</span>
          </span>
        </div>

        {/* Quick Preset Chips */}
        <div className="flex items-center gap-2 pt-0.5">
          {presets.map((preset) => {
            const isActive = landCost === preset.value;
            return (
              <button
                key={preset.value}
                type="button"
                onClick={() => {
                  onLandCostChange(preset.value);
                  if (onResetSiteName) onResetSiteName();
                }}
                className={`px-3 py-1.5 rounded-lg font-['JetBrains_Mono'] text-[12px] font-bold shadow-sm transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#000000] text-white shadow-md'
                    : 'bg-white text-[#0b1c30] hover:bg-[#dce9ff] border border-[#dce9ff]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Tactile Range Slider */}
        <div className="pt-2">
          <input
            type="range"
            min="800"
            max="1800"
            step="10"
            value={landCost}
            onChange={(e) => {
              onLandCostChange(Number(e.target.value));
              if (onResetSiteName) onResetSiteName();
            }}
            className="w-full accent-[#000000] h-2 bg-[#dce9ff] rounded-lg cursor-pointer transition-all"
          />
          <div className="flex justify-between font-['JetBrains_Mono'] text-[11px] text-[#45464d] pt-1.5 font-medium">
            <span>$800</span>
            <span>$1,300</span>
            <span>$1,800 PSF PPR</span>
          </div>
        </div>
      </div>

      {/* Waterfall Cost & Breakeven Stack (2 Column Cards) */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
          <span className="font-['Hanken_Grotesk'] text-[12px] text-[#45464d]">
            Est. Build &amp; Finance
          </span>
          <span className="font-['JetBrains_Mono'] text-[14px] text-[#0b1c30] font-bold mt-0.5">
            +S$ {overheadCost}{' '}
            <span className="text-[10px] text-[#45464d] font-normal">PSF</span>
          </span>
          <span className="font-['Hanken_Grotesk'] text-[11px] text-[#45464d] mt-1 font-medium">
            Prelims, LTA/BCA Levy
          </span>
        </div>

        <div className="flex flex-col p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
          <span className="font-['Hanken_Grotesk'] text-[12px] text-[#45464d]">
            Dev Breakeven
          </span>
          <span className="font-['JetBrains_Mono'] text-[14px] text-[#0b1c30] font-extrabold mt-0.5">
            S$ {breakeven.toLocaleString()}{' '}
            <span className="text-[10px] text-[#45464d] font-normal">PSF</span>
          </span>
          <span className="font-['Hanken_Grotesk'] text-[11px] text-[#006c49] font-bold mt-1">
            Land + ${overheadCost} Overhead
          </span>
        </div>
      </div>

      {/* Projected Launch Price Hero Glaze Banner */}
      <div className="p-4 rounded-xl bg-[#006c49]/10 border border-[#006c49]/20 flex flex-col gap-1.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
            <span className="font-['Hanken_Grotesk'] text-[11px] uppercase tracking-wider text-[#006c49] font-extrabold">
              Projected Launch Price
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#6cf8bb]/30 text-[#006c49] font-['JetBrains_Mono'] text-[11px] font-bold border border-[#006c49]/20">
            +{marginPercent}% Developer Margin
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-['Manrope'] text-[24px] sm:text-[28px] text-[#006c49] font-extrabold tracking-tight">
            S$ {lowPrice.toLocaleString()} – S$ {highPrice.toLocaleString()}
          </span>
          <span className="font-['JetBrains_Mono'] text-[12px] text-[#006c49] font-semibold">
            PSF Avg
          </span>
        </div>
      </div>

      {/* Indicative Unit Quantums Breakdown */}
      <div className="flex flex-col gap-1.5">
        <span className="font-['Hanken_Grotesk'] text-[12px] text-[#45464d] font-semibold">
          Estimated Entry Quantums (Indicative Model)
        </span>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex flex-col items-center text-center">
            <span className="font-['Hanken_Grotesk'] text-[10.5px] text-[#45464d] uppercase font-bold tracking-tight">
              1-Bed (480 sf)
            </span>
            <span className="font-['JetBrains_Mono'] text-[13.5px] text-[#000000] font-extrabold mt-1">
              S$ {q1br}M+
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex flex-col items-center text-center">
            <span className="font-['Hanken_Grotesk'] text-[10.5px] text-[#45464d] uppercase font-bold tracking-tight">
              2-Bed (680 sf)
            </span>
            <span className="font-['JetBrains_Mono'] text-[13.5px] text-[#000000] font-extrabold mt-1">
              S$ {q2br}M+
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex flex-col items-center text-center">
            <span className="font-['Hanken_Grotesk'] text-[10.5px] text-[#45464d] uppercase font-bold tracking-tight">
              3-Bed (950 sf)
            </span>
            <span className="font-['JetBrains_Mono'] text-[13.5px] text-[#000000] font-extrabold mt-1">
              S$ {q3br}M+
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#45464d] font-mono">
            4-Bed (1,300 sf): ~S$ {q4br}M+
          </span>
        </div>
      </div>

      {/* Quick CTA Action: Generate 1-Page Agent Pitch PDF */}
      <button
        onClick={handleGenerateClick}
        disabled={isGenerating}
        type="button"
        id="pdf-download-btn"
        className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-[#000000] text-white font-['Manrope'] text-[15px] font-bold shadow-md hover:bg-[#213145] active:scale-[0.99] transition-all cursor-pointer"
      >
        {isGenerating ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[20px]">sync</span>
            <span>Compiling URA Data &amp; PDF...</span>
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">picture_as_pdf</span>
            <span>Generate 1-Page Agent Pitch PDF</span>
          </>
        )}
      </button>
    </div>
  );
};
