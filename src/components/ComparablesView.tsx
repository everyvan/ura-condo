import React, { useState, useMemo } from 'react';
import { UraTransaction } from '../types';
import { INITIAL_URA_TRANSACTIONS } from '../data/uraCaveats';

export const ComparablesView: React.FC = () => {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [transactions] = useState<UraTransaction[]>(INITIAL_URA_TRANSACTIONS);

  const districts = ['all', 'D21', 'D15', 'D26', 'D10'];
  const types = ['all', 'New Sale', 'Resale', 'Sub Sale'];

  const filteredTx = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedDistrict !== 'all' && tx.district !== selectedDistrict) return false;
      if (selectedType !== 'all' && tx.type !== selectedType) return false;
      return true;
    });
  }, [transactions, selectedDistrict, selectedType]);

  const stats = useMemo(() => {
    if (filteredTx.length === 0) return { avgPsf: 0, maxPsf: 0, minPsf: 0, count: 0 };
    const psfs = filteredTx.map((t) => t.psf);
    const sum = psfs.reduce((a, b) => a + b, 0);
    return {
      avgPsf: Math.round(sum / psfs.length),
      maxPsf: Math.max(...psfs),
      minPsf: Math.min(...psfs),
      count: filteredTx.length,
    };
  }, [filteredTx]);

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#006c49] text-[22px]">analytics</span>
          <h2 className="font-['Manrope'] text-[22px] font-bold text-[#0b1c30]">
            URA Realis Comparables &amp; Caveats
          </h2>
        </div>
        <p className="font-['Hanken_Grotesk'] text-[13px] text-[#45464d]">
          Official Singapore caveat transactions feed to benchmark new launch pricing against actual transactions.
        </p>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex flex-col">
          <span className="text-[11px] font-bold text-[#45464d] uppercase font-['Hanken_Grotesk']">
            Avg Transacted
          </span>
          <span className="font-['JetBrains_Mono'] text-[16px] sm:text-[18px] font-extrabold text-[#006c49] mt-1">
            S$ {stats.avgPsf.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#45464d] font-mono">PSF (30-day)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex flex-col">
          <span className="text-[11px] font-bold text-[#45464d] uppercase font-['Hanken_Grotesk']">
            Top Benchmark
          </span>
          <span className="font-['JetBrains_Mono'] text-[16px] sm:text-[18px] font-extrabold text-[#0b1c30] mt-1">
            S$ {stats.maxPsf.toLocaleString()}
          </span>
          <span className="text-[10px] text-[#45464d] font-mono">PSF Peak</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex flex-col">
          <span className="text-[11px] font-bold text-[#45464d] uppercase font-['Hanken_Grotesk']">
            Verified Caveats
          </span>
          <span className="font-['JetBrains_Mono'] text-[16px] sm:text-[18px] font-extrabold text-[#0b1c30] mt-1">
            {stats.count}
          </span>
          <span className="text-[10px] text-[#006c49] font-mono font-bold">100% Lodged</span>
        </div>
      </div>

      {/* District & Type Filter Chips */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] text-[#45464d] font-bold uppercase mr-1">District:</span>
          {districts.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDistrict(d)}
              className={`px-3 py-1 rounded-full text-[11px] font-['JetBrains_Mono'] font-bold transition cursor-pointer ${
                selectedDistrict === d
                  ? 'bg-[#000000] text-white'
                  : 'bg-[#eff4ff] text-[#45464d] border border-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              {d === 'all' ? 'All Districts' : d}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] text-[#45464d] font-bold uppercase mr-1">Sale Type:</span>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1 rounded-full text-[11px] font-['Hanken_Grotesk'] font-bold transition cursor-pointer ${
                selectedType === t
                  ? 'bg-[#006c49] text-white'
                  : 'bg-white text-[#45464d] border border-[#dce9ff] hover:text-[#0b1c30]'
              }`}
            >
              {t === 'all' ? 'All Sales' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Records List */}
      <div className="flex flex-col gap-3">
        {filteredTx.map((tx) => (
          <div
            key={tx.id}
            className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex flex-col gap-2.5 transition-all hover:border-[#006c49]/40"
          >
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-['Manrope'] font-bold text-[15px] text-[#0b1c30]">
                    {tx.project}
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#dce9ff] text-[#0b1c30] text-[10px] font-mono font-bold">
                    {tx.district}
                  </span>
                </div>
                <span className="text-[12px] text-[#45464d]">{tx.street} • {tx.tenure}</span>
              </div>

              <span
                className={`px-2 py-0.5 rounded text-[10.5px] font-bold font-['Hanken_Grotesk'] ${
                  tx.type === 'New Sale'
                    ? 'bg-[#006c49]/10 text-[#006c49]'
                    : tx.type === 'Sub Sale'
                    ? 'bg-[#6cf8bb]/30 text-[#00714d]'
                    : 'bg-[#eff4ff] text-[#45464d]'
                }`}
              >
                {tx.type}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-[#eff4ff] border border-[#dce9ff] text-center">
              <div>
                <span className="text-[10px] text-[#45464d] block uppercase font-bold">Price PSF</span>
                <span className="font-['JetBrains_Mono'] text-[14px] font-extrabold text-[#006c49]">
                  S$ {tx.psf.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#45464d] block uppercase font-bold">Size &amp; Bed</span>
                <span className="font-['JetBrains_Mono'] text-[13px] font-bold text-[#0b1c30]">
                  {tx.areaSqft} sf ({tx.bedCount}BR)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#45464d] block uppercase font-bold">Total Quantum</span>
                <span className="font-['JetBrains_Mono'] text-[13.5px] font-bold text-[#0b1c30]">
                  S$ {(tx.totalPrice / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#45464d] pt-0.5">
              <span>Floor Level: {tx.floorLevel}</span>
              <span>Lodged Date: {tx.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
