import React, { useState, useEffect } from 'react';
import { UraVacantSiteRecord } from '../../api/ura-vacant-sites';
import { UraLandedSiteRecord } from '../../api/ura-landed-housing';

interface LiveUraRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulatePsf: (psf: number, siteName: string) => void;
}

export const LiveUraRegistryModal: React.FC<LiveUraRegistryModalProps> = ({
  isOpen,
  onClose,
  onSimulatePsf,
}) => {
  const [activeTab, setActiveTab] = useState<'vacant' | 'landed'>('vacant');
  const [vacantSites, setVacantSites] = useState<UraVacantSiteRecord[]>([]);
  const [landedSites, setLandedSites] = useState<UraLandedSiteRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [apiHealth, setApiHealth] = useState<string>('checking...');

  useEffect(() => {
    if (!isOpen) return;

    // Check API health
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setApiHealth('API Online • Isomer Gov Endpoint');
        } else {
          setApiHealth('Degraded');
        }
      })
      .catch(() => setApiHealth('Offline'));

    // Fetch initial data
    setLoading(true);
    const endpoint = activeTab === 'vacant' ? '/api/ura-vacant-sites?limit=60' : '/api/ura-landed-housing?limit=60';
    fetch(endpoint)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && res.data) {
          if (activeTab === 'vacant') {
            setVacantSites(res.data);
          } else {
            setLandedSites(res.data);
          }
        }
      })
      .catch((err) => console.error('Fetch error:', err))
      .finally(() => setLoading(false));
  }, [isOpen, activeTab]);

  if (!isOpen) return null;

  const currentList = activeTab === 'vacant' ? vacantSites : landedSites;
  const filteredList = currentList.filter((item) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    const loc = item.location.toLowerCase();
    const area = item.planningArea.toLowerCase();
    const dev = item.successfulTenderer.toLowerCase();
    return loc.includes(term) || area.includes(term) || dev.includes(term);
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff] flex flex-col max-h-[85vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#eff4ff] border-b border-[#dce9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[22px]">cloud_sync</span>
            <div>
              <h3 className="font-['Manrope'] font-bold text-[15px] sm:text-[16px] text-[#0b1c30]">
                Official URA Isomer Live Data Feed
              </h3>
              <span className="text-[11px] font-mono text-[#006c49] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006c49] animate-pulse"></span>
                {apiHealth}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={activeTab === 'vacant' ? '/api/ura-vacant-sites?raw=true' : '/api/ura-landed-housing?raw=true'}
              download
              className="px-2.5 py-1 text-[11px] font-bold rounded-md bg-white border border-[#dce9ff] text-[#0b1c30] hover:bg-[#dce9ff] flex items-center gap-1 transition"
              title="Download original government .xlsx file"
            >
              <span className="material-symbols-outlined text-[14px]">download</span>
              <span>Raw XLSX</span>
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#dce9ff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Controls & Search */}
        <div className="p-4 bg-[#f8f9ff] border-b border-[#e5eeff] flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('vacant')}
              className={`flex-1 py-2 rounded-xl text-[12px] font-bold font-['Manrope'] transition cursor-pointer ${
                activeTab === 'vacant'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-white border border-[#dce9ff] text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              URA Vacant Sites (443 Live)
            </button>
            <button
              onClick={() => setActiveTab('landed')}
              className={`flex-1 py-2 rounded-xl text-[12px] font-bold font-['Manrope'] transition cursor-pointer ${
                activeTab === 'landed'
                  ? 'bg-[#000000] text-white shadow-sm'
                  : 'bg-white border border-[#dce9ff] text-[#45464d] hover:text-[#0b1c30]'
              }`}
            >
              Landed Housing Sites (335 Live)
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#45464d] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by location, tenderer, or planning area (e.g. Bishan, Bedok, Hougang)..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-white border border-[#dce9ff] text-[13px] text-[#0b1c30] outline-none focus:border-[#006c49]"
            />
          </div>
        </div>

        {/* Records List */}
        <div className="p-4 flex flex-col gap-3 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-[#45464d]">
              <span className="material-symbols-outlined animate-spin text-[28px] text-[#006c49]">sync</span>
              <span className="text-[13px] font-medium">Fetching &amp; parsing live government .xlsx data...</span>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-12 text-center text-[#45464d] text-[13px]">
              No records matching &quot;{search}&quot;.
            </div>
          ) : (
            filteredList.map((item) => {
              const isVacant = 'indicativePsfPpr' in item;
              const psf = isVacant ? (item as UraVacantSiteRecord).indicativePsfPpr : (item as UraLandedSiteRecord).indicativePsfSiteArea;
              const gfa = isVacant ? (item as UraVacantSiteRecord).gfaSqft : null;

              return (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex flex-col gap-2 hover:border-[#006c49]/40 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#0b1c30] text-[10.5px] font-mono font-bold">
                          {item.planningArea || 'Singapore'}
                        </span>
                        <span className="text-[10px] text-[#76777d] font-mono">
                          Awarded: {item.awardDate || item.tenderClosingDate}
                        </span>
                      </div>
                      <h4 className="font-['Manrope'] font-bold text-[14.5px] text-[#0b1c30] mt-1">
                        {item.location}
                      </h4>
                      <span className="text-[11.5px] text-[#45464d]">
                        Tenderer: <strong className="text-[#0b1c30]">{item.successfulTenderer || 'N/A'}</strong>
                      </span>
                    </div>

                    {psf > 0 && (
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-[#45464d] uppercase block">
                          {isVacant ? 'PSF PPR' : 'PSF Land'}
                        </span>
                        <span className="font-['JetBrains_Mono'] text-[15px] font-extrabold text-[#006c49]">
                          S$ {psf.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff] text-[11px] text-[#45464d]">
                    <div className="flex items-center gap-3 font-mono">
                      <span>Area: {item.siteAreaSqm.toLocaleString()} m²</span>
                      {gfa && <span>GFA: {gfa.toLocaleString()} sf</span>}
                      <span>Bids: {item.bidsCount}</span>
                    </div>

                    {psf > 0 && (
                      <button
                        onClick={() => {
                          onSimulatePsf(Math.round(psf), item.location);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-[#000000] text-white font-bold text-[11px] hover:bg-[#213145] transition flex items-center gap-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[13px]">query_stats</span>
                        <span>Simulate PSF</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
