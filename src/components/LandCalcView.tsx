import React, { useState } from 'react';

export const LandCalcView: React.FC = () => {
  // Inputs
  const [siteAreaSqm, setSiteAreaSqm] = useState(25000);
  const [plotRatio, setPlotRatio] = useState(2.1);
  const [landCostPsfPpr, setLandCostPsfPpr] = useState(1220);
  const [constructionPsf, setConstructionPsf] = useState(380);
  const [financeLegalPsf, setFinanceLegalPsf] = useState(110);
  const [marketingCommPercent, setMarketingCommPercent] = useState(3.0);
  const [targetMargin, setTargetMargin] = useState(20);

  // Conversions
  const sqmToSqft = 10.7639;
  const siteAreaSqft = siteAreaSqm * sqmToSqft;
  const maxGfaSqft = siteAreaSqft * plotRatio;
  const totalLandCost = (maxGfaSqft * landCostPsfPpr) / 1000000; // in Millions

  // Construction & Development Costs
  const totalConstructionCost = (maxGfaSqft * constructionPsf) / 1000000;
  const totalFinanceLegal = (maxGfaSqft * financeLegalPsf) / 1000000;
  
  // Breakeven before marketing
  const hardBreakevenPsf = landCostPsfPpr + constructionPsf + financeLegalPsf;
  // Breakeven factoring marketing commission
  const fullBreakevenPsf = Math.round(hardBreakevenPsf / (1 - marketingCommPercent / 100));

  // Projected Launch Prices by margin
  const calcLaunchPsf = (margin: number) => {
    return Math.round(fullBreakevenPsf * (1 + margin / 100));
  };

  const targetLaunchPsf = calcLaunchPsf(targetMargin);
  const grossDevelopmentValue = (maxGfaSqft * targetLaunchPsf) / 1000000;
  const estimatedDeveloperProfit = grossDevelopmentValue - (totalLandCost + totalConstructionCost + totalFinanceLegal + (grossDevelopmentValue * marketingCommPercent / 100));

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fadeIn">
      {/* Title Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006c49] text-[22px]">calculate</span>
          <h2 className="font-['Manrope'] text-[22px] font-bold text-[#0b1c30]">
            GLS Residual &amp; Feasibility Calculator
          </h2>
        </div>
        <p className="font-['Hanken_Grotesk'] text-[13px] text-[#45464d]">
          Institutional land appraisal model for Singapore residential Government Land Sales.
        </p>
      </div>

      {/* Main Parameters Card */}
      <div className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-4">
        <h3 className="font-['Manrope'] text-[16px] font-bold text-[#0b1c30] flex items-center justify-between">
          <span>Site &amp; Planning Parameters</span>
          <span className="text-[11px] font-mono text-[#006c49] bg-[#006c49]/10 px-2 py-0.5 rounded-full font-bold">
            URA Master Plan Model
          </span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[12px] font-semibold text-[#45464d] block mb-1">
              Site Area (sqm)
            </label>
            <input
              type="number"
              value={siteAreaSqm}
              onChange={(e) => setSiteAreaSqm(Number(e.target.value) || 1000)}
              className="w-full h-11 px-3 bg-[#eff4ff] border border-[#dce9ff] rounded-xl font-['JetBrains_Mono'] text-[14px] font-bold text-[#0b1c30] outline-none focus:border-[#006c49]"
            />
            <span className="text-[11px] text-[#45464d] font-mono mt-1 block">
              = {Math.round(siteAreaSqft).toLocaleString()} sq ft
            </span>
          </div>

          <div>
            <label className="text-[12px] font-semibold text-[#45464d] block mb-1">
              Gross Plot Ratio (GPR)
            </label>
            <input
              type="number"
              step="0.1"
              value={plotRatio}
              onChange={(e) => setPlotRatio(Number(e.target.value) || 1.4)}
              className="w-full h-11 px-3 bg-[#eff4ff] border border-[#dce9ff] rounded-xl font-['JetBrains_Mono'] text-[14px] font-bold text-[#0b1c30] outline-none focus:border-[#006c49]"
            />
            <span className="text-[11px] text-[#006c49] font-mono mt-1 block font-bold">
              Max GFA: {Math.round(maxGfaSqft).toLocaleString()} sq ft
            </span>
          </div>
        </div>

        {/* Land Tender Cost Input */}
        <div className="p-4 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-bold text-[#0b1c30]">Land Bid Price PSF PPR</span>
            <span className="font-['JetBrains_Mono'] text-[17px] font-extrabold text-[#006c49]">
              S$ {landCostPsfPpr.toLocaleString()} PSF
            </span>
          </div>
          <input
            type="range"
            min="600"
            max="2200"
            step="10"
            value={landCostPsfPpr}
            onChange={(e) => setLandCostPsfPpr(Number(e.target.value))}
            className="w-full accent-[#000000] cursor-pointer"
          />
          <div className="flex justify-between items-center text-[12px] text-[#45464d]">
            <span>Total Land Consideration:</span>
            <span className="font-['JetBrains_Mono'] font-bold text-[#0b1c30]">
              S$ {totalLandCost.toFixed(2)} Million
            </span>
          </div>
        </div>
      </div>

      {/* Cost Waterfall Details */}
      <div className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-4">
        <h3 className="font-['Manrope'] text-[16px] font-bold text-[#0b1c30]">
          Development &amp; Overhead Waterfall
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
            <span className="text-[11px] text-[#45464d] uppercase font-bold block">
              Construction PSF
            </span>
            <div className="flex items-center mt-1">
              <span className="text-[12px] text-[#45464d] font-mono mr-1">S$</span>
              <input
                type="number"
                value={constructionPsf}
                onChange={(e) => setConstructionPsf(Number(e.target.value) || 300)}
                className="w-full bg-transparent font-['JetBrains_Mono'] text-[14px] font-bold text-[#0b1c30] outline-none"
              />
            </div>
            <span className="text-[10px] text-[#45464d] block mt-1">Piling, Structural, MEP</span>
          </div>

          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
            <span className="text-[11px] text-[#45464d] uppercase font-bold block">
              Finance &amp; Prelims PSF
            </span>
            <div className="flex items-center mt-1">
              <span className="text-[12px] text-[#45464d] font-mono mr-1">S$</span>
              <input
                type="number"
                value={financeLegalPsf}
                onChange={(e) => setFinanceLegalPsf(Number(e.target.value) || 80)}
                className="w-full bg-transparent font-['JetBrains_Mono'] text-[14px] font-bold text-[#0b1c30] outline-none"
              />
            </div>
            <span className="text-[10px] text-[#45464d] block mt-1">Interest, Legal, BCA</span>
          </div>

          <div className="p-3 rounded-xl bg-[#eff4ff] border border-[#dce9ff]">
            <span className="text-[11px] text-[#45464d] uppercase font-bold block">
              Agency &amp; Marketing
            </span>
            <div className="flex items-center mt-1">
              <input
                type="number"
                step="0.5"
                value={marketingCommPercent}
                onChange={(e) => setMarketingCommPercent(Number(e.target.value) || 2)}
                className="w-16 bg-transparent font-['JetBrains_Mono'] text-[14px] font-bold text-[#0b1c30] outline-none"
              />
              <span className="text-[12px] text-[#45464d] font-mono">% of GDV</span>
            </div>
            <span className="text-[10px] text-[#45464d] block mt-1">Showflat, Agent Comm</span>
          </div>
        </div>

        {/* Breakeven Summary Banner */}
        <div className="p-4 rounded-xl bg-[#0b1c30] text-white flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] uppercase tracking-wider text-[#dce9ff] font-bold">
              Net Developer Breakeven
            </span>
            <span className="text-[11px] text-gray-300">
              Land + Construction + Overheads + Comm
            </span>
          </div>
          <span className="font-['JetBrains_Mono'] text-[22px] font-extrabold text-[#6cf8bb]">
            S$ {fullBreakevenPsf.toLocaleString()} <span className="text-[12px] text-gray-300 font-normal">PSF</span>
          </span>
        </div>
      </div>

      {/* Sensitivity Margin Matrix */}
      <div className="rounded-2xl bg-white p-5 border border-[#e5eeff] shadow-sm flex flex-col gap-4">
        <h3 className="font-['Manrope'] text-[16px] font-bold text-[#0b1c30] flex items-center justify-between">
          <span>Target Profit Margin Sensitivity Matrix</span>
          <span className="text-[11px] font-bold text-[#006c49]">Select to Target</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[12, 15, 18, 20, 25].map((m) => {
            const launchPrice = calcLaunchPsf(m);
            const isSelected = targetMargin === m;
            return (
              <button
                key={m}
                onClick={() => setTargetMargin(m)}
                type="button"
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#006c49]/10 border-[#006c49] ring-2 ring-[#006c49]/20'
                    : 'bg-[#eff4ff] border-[#dce9ff] hover:border-[#45464d]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Hanken_Grotesk'] text-[11px] font-extrabold uppercase text-[#45464d]">
                    Margin
                  </span>
                  <span className={`text-[12px] font-mono font-bold ${isSelected ? 'text-[#006c49]' : 'text-[#0b1c30]'}`}>
                    +{m}%
                  </span>
                </div>
                <div className="font-['JetBrains_Mono'] text-[16px] font-extrabold text-[#0b1c30] mt-1.5">
                  S$ {launchPrice.toLocaleString()}
                </div>
                <span className="text-[10px] text-[#45464d] font-mono">PSF Average</span>
              </button>
            );
          })}
        </div>

        {/* Selected Margin GDV Summary */}
        <div className="p-3.5 rounded-xl bg-[#6cf8bb]/20 border border-[#006c49]/20 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] font-bold uppercase text-[#006c49]">
              Estimated GDV &amp; Profit at +{targetMargin}%
            </span>
            <span className="text-[13px] font-bold text-[#0b1c30]">
              GDV: S$ {grossDevelopmentValue.toFixed(2)}M
            </span>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-[#45464d] block font-mono">Est. Dev Profit:</span>
            <span className="font-['JetBrains_Mono'] text-[16px] font-extrabold text-[#006c49]">
              +S$ {estimatedDeveloperProfit.toFixed(1)}M
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
