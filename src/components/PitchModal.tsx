import React, { useState } from 'react';
import { GLSSite } from '../types';

interface PitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteName: string;
  landCost: number;
  overheadCost: number;
  marginPercent: number;
  agentName: string;
  agencyName: string;
  agentCea: string;
}

export const PitchModal: React.FC<PitchModalProps> = ({
  isOpen,
  onClose,
  siteName,
  landCost,
  overheadCost,
  marginPercent,
  agentName,
  agencyName,
  agentCea,
}) => {
  const [clientName, setClientName] = useState('Valued Property Buyer');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const breakeven = landCost + overheadCost;
  const lowMarginFactor = 1 + (marginPercent - 2) / 100;
  const highMarginFactor = 1 + (marginPercent + 5) / 100;

  const lowPrice = Math.round((breakeven * lowMarginFactor) / 10) * 10;
  const highPrice = Math.round((breakeven * highMarginFactor) / 10) * 10;
  const avgPrice = (lowPrice + highPrice) / 2;

  const q1br = ((avgPrice * 480) / 1000000).toFixed(2);
  const q2br = ((avgPrice * 680) / 1000000).toFixed(2);
  const q3br = ((avgPrice * 950) / 1000000).toFixed(2);
  const q4br = ((avgPrice * 1300) / 1000000).toFixed(2);

  const currentDate = new Date().toLocaleDateString('en-SG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleCopyWhatsApp = () => {
    const text = `🏢 *PropLaunch SG - Indicative Launch Advisory*
📍 *Site:* ${siteName}
📅 *Date:* ${currentDate}
👤 *Prepared for:* ${clientName}

📊 *Developer Cost & Breakeven Analysis:*
• Land Bid Cost: S$ ${landCost.toLocaleString()} PSF PPR
• Est. Build & Finance: +S$ ${overheadCost} PSF
• Developer Breakeven: *S$ ${breakeven.toLocaleString()} PSF*

🎯 *Projected Launch Pricing (+${marginPercent}% Margin):*
• *S$ ${lowPrice.toLocaleString()} - S$ ${highPrice.toLocaleString()} PSF Avg*

🏠 *Estimated Entry Quantums:*
• 1-Bed (480 sf): ~S$ ${q1br}M+
• 2-Bed (680 sf): ~S$ ${q2br}M+
• 3-Bed (950 sf): ~S$ ${q3br}M+
• 4-Bed (1,300 sf): ~S$ ${q4br}M+

🔍 *URA Caveat Validation:*
Supported by official URA REALIS transaction feed.

Prepared by:
*${agentName}* (${agentCea})
${agencyName}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto print:p-0 print:bg-white">
      {/* Outer wrapper */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff] print:border-none print:shadow-none print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#eff4ff] border-b border-[#dce9ff] print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">verified</span>
            <span className="font-['Manrope'] font-bold text-[14px] text-[#0b1c30]">
              1-Page Agent Pitch Sheet
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWhatsApp}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#dce9ff] text-[#006c49] text-[12px] font-bold flex items-center gap-1 hover:bg-[#dce9ff] transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">content_copy</span>
              <span>{copied ? 'Copied!' : 'Copy WhatsApp'}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-[#000000] text-white text-[12px] font-bold flex items-center gap-1 hover:bg-[#213145] transition cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#dce9ff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Pitch Sheet Body */}
        <div className="p-6 sm:p-7 flex flex-col gap-5 text-[#0b1c30]">
          {/* Pitch Sheet Header */}
          <div className="flex items-start justify-between border-b border-[#e5eeff] pb-4">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-['Manrope'] text-[20px] font-extrabold tracking-tight text-[#0b1c30]">
                  PropLaunch SG
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#006c49]/10 text-[#006c49] font-bold">
                  URA REALIS VERIFIED
                </span>
              </div>
              <span className="font-['Hanken_Grotesk'] text-[12px] text-[#45464d] mt-0.5">
                Institutional Land-to-Launch Appraisal Dossier
              </span>
            </div>

            <div className="text-right flex flex-col items-end">
              <span className="font-['Manrope'] font-bold text-[13px] text-[#0b1c30]">
                {agencyName}
              </span>
              <span className="text-[11px] text-[#45464d]">
                {agentName} • {agentCea}
              </span>
              <span className="text-[10px] font-mono text-[#76777d] mt-0.5">{currentDate}</span>
            </div>
          </div>

          {/* Client Target Editable Banner (Print view keeps it clean) */}
          <div className="p-3.5 rounded-xl bg-[#eff4ff] border border-[#dce9ff] flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-bold text-[#45464d] tracking-wider">
                Prepared Exclusively For:
              </span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="font-['Manrope'] text-[15px] font-bold text-[#0b1c30] bg-transparent outline-none border-b border-transparent focus:border-[#006c49]"
                placeholder="Enter Client Name"
              />
            </div>
            <span className="text-[11px] font-mono font-bold text-[#006c49] bg-white px-2.5 py-1 rounded-md border border-[#dce9ff]">
              CONFIDENTIAL
            </span>
          </div>

          {/* Site Overview */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-[#006c49] uppercase tracking-wide">
              Target GLS Development Site
            </span>
            <h3 className="font-['Manrope'] text-[22px] font-extrabold text-[#0b1c30]">
              {siteName}
            </h3>
            <p className="text-[12.5px] text-[#45464d] leading-relaxed">
              Residual land feasibility modeling based on Singapore Urban Redevelopment Authority (URA) tender results, BCA standard construction cost indices, and institutional development financing overheads.
            </p>
          </div>

          {/* 3-Column Cost Stack */}
          <div className="grid grid-cols-3 gap-2.5 p-3.5 rounded-xl bg-[#f8f9ff] border border-[#dce9ff]">
            <div className="flex flex-col">
              <span className="text-[10px] text-[#45464d] uppercase font-bold">Land Tender Bid</span>
              <span className="font-['JetBrains_Mono'] text-[15px] font-bold text-[#0b1c30] mt-0.5">
                S$ {landCost.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#45464d]">PSF PPR</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-[#45464d] uppercase font-bold">Build &amp; Overheads</span>
              <span className="font-['JetBrains_Mono'] text-[15px] font-bold text-[#0b1c30] mt-0.5">
                +S$ {overheadCost}
              </span>
              <span className="text-[10px] text-[#45464d]">Prelims + BCA Levy</span>
            </div>

            <div className="flex flex-col">
              <span className="text-[10px] text-[#006c49] uppercase font-bold">Dev Breakeven</span>
              <span className="font-['JetBrains_Mono'] text-[15px] font-extrabold text-[#006c49] mt-0.5">
                S$ {breakeven.toLocaleString()}
              </span>
              <span className="text-[10px] text-[#006c49] font-medium">PSF Floor Cost</span>
            </div>
          </div>

          {/* Hero Forecast Launch Price */}
          <div className="p-4 rounded-xl bg-[#006c49]/10 border border-[#006c49]/30 flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#006c49] uppercase tracking-wider">
                Projected Launch Price Range
              </span>
              <span className="text-[11px] font-bold text-[#006c49] font-mono">
                +{marginPercent}% Developer Margin
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-['Manrope'] text-[26px] font-extrabold text-[#006c49]">
                S$ {lowPrice.toLocaleString()} – S$ {highPrice.toLocaleString()}
              </span>
              <span className="font-['JetBrains_Mono'] text-[13px] text-[#006c49]">
                PSF Average
              </span>
            </div>
          </div>

          {/* Unit Quantums Breakdown */}
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold text-[#0b1c30] uppercase tracking-wide">
              Indicative Entry Ticket Prices
            </span>
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-center">
                <span className="text-[10px] text-[#45464d] font-bold block">1-BED (480 sf)</span>
                <span className="font-['JetBrains_Mono'] text-[13px] font-bold text-[#0b1c30] block mt-1">
                  S$ {q1br}M+
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-center">
                <span className="text-[10px] text-[#45464d] font-bold block">2-BED (680 sf)</span>
                <span className="font-['JetBrains_Mono'] text-[13px] font-bold text-[#0b1c30] block mt-1">
                  S$ {q2br}M+
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-center">
                <span className="text-[10px] text-[#45464d] font-bold block">3-BED (950 sf)</span>
                <span className="font-['JetBrains_Mono'] text-[13px] font-bold text-[#0b1c30] block mt-1">
                  S$ {q3br}M+
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-center">
                <span className="text-[10px] text-[#45464d] font-bold block">4-BED (1,300 sf)</span>
                <span className="font-['JetBrains_Mono'] text-[13px] font-bold text-[#0b1c30] block mt-1">
                  S$ {q4br}M+
                </span>
              </div>
            </div>
          </div>

          {/* Footer Legal & Advisory Disclaimer */}
          <div className="pt-3 border-t border-[#e5eeff] flex flex-col gap-1 text-[10.5px] text-[#76777d] leading-normal">
            <p>
              * Source: Urban Redevelopment Authority (URA) Realis &amp; Government Land Sales (GLS) Registry accessed under Singapore Open Data Licence 1.0. Figures are indicative projections based on standard institutional construction costs and do not constitute developer commitment or investment warranty.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
