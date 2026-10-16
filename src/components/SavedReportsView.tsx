import React, { useState } from 'react';
import { GLSSite, SavedReport } from '../types';

interface SavedReportsViewProps {
  bookmarkedSites: GLSSite[];
  savedReports: SavedReport[];
  onRemoveBookmark: (siteId: string) => void;
  onOpenSiteDetails: (site: GLSSite) => void;
  onOpenPitchModal: (report?: SavedReport) => void;
  onDeleteReport: (reportId: string) => void;
  onSaveNewNote: (siteName: string, clientName: string, note: string) => void;
}

export const SavedReportsView: React.FC<SavedReportsViewProps> = ({
  bookmarkedSites,
  savedReports,
  onRemoveBookmark,
  onOpenSiteDetails,
  onOpenPitchModal,
  onDeleteReport,
  onSaveNewNote,
}) => {
  const [activeSection, setActiveSection] = useState<'sites' | 'pitches'>('sites');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newClient, setNewClient] = useState('');
  const [newSite, setNewSite] = useState(bookmarkedSites[0]?.name || 'Pine Grove (Parcel B)');
  const [newNote, setNewNote] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.trim()) return;
    onSaveNewNote(newSite, newClient, newNote);
    setNewClient('');
    setNewNote('');
    setShowAddNote(false);
  };

  return (
    <div className="flex flex-col gap-5 pb-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[22px]">folder_special</span>
            <h2 className="font-['Manrope'] text-[22px] font-bold text-[#0b1c30]">
              Saved GLS Portfolios &amp; Reports
            </h2>
          </div>
          <button
            onClick={() => setShowAddNote(true)}
            className="px-3 py-1.5 rounded-lg bg-[#000000] text-white text-[12px] font-bold flex items-center gap-1 hover:bg-[#213145] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Pitch Note</span>
          </button>
        </div>
        <p className="font-['Hanken_Grotesk'] text-[13px] text-[#45464d]">
          Manage bookmarked land parcels and tailored client presentation dossiers.
        </p>
      </div>

      {/* Sub tabs */}
      <div className="flex items-center border-b border-[#e5eeff] gap-4">
        <button
          onClick={() => setActiveSection('sites')}
          className={`pb-2.5 font-['Manrope'] text-[14px] font-bold transition-all relative cursor-pointer ${
            activeSection === 'sites'
              ? 'text-[#006c49] border-b-2 border-[#006c49]'
              : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          Bookmarked Sites ({bookmarkedSites.length})
        </button>
        <button
          onClick={() => setActiveSection('pitches')}
          className={`pb-2.5 font-['Manrope'] text-[14px] font-bold transition-all relative cursor-pointer ${
            activeSection === 'pitches'
              ? 'text-[#006c49] border-b-2 border-[#006c49]'
              : 'text-[#45464d] hover:text-[#0b1c30]'
          }`}
        >
          Client Pitches ({savedReports.length})
        </button>
      </div>

      {/* Add Pitch Note Modal/Form */}
      {showAddNote && (
        <form
          onSubmit={handleAddSubmit}
          className="p-4 rounded-2xl bg-white border border-[#dce9ff] shadow-md flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-['Manrope'] font-bold text-[#0b1c30] text-[15px]">
              Add Client Proposal Pitch
            </h4>
            <button
              type="button"
              onClick={() => setShowAddNote(false)}
              className="text-[#45464d] hover:text-[#0b1c30]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#45464d] block mb-1">Target GLS Site</label>
            <select
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              className="w-full h-10 px-3 bg-[#eff4ff] border border-[#dce9ff] rounded-lg text-[13px] text-[#0b1c30] font-medium"
            >
              {bookmarkedSites.length > 0 ? (
                bookmarkedSites.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.district})
                  </option>
                ))
              ) : (
                <option value="Pine Grove (Parcel B)">Pine Grove (Parcel B) (D21)</option>
              )}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#45464d] block mb-1">Client Name / Household</label>
            <input
              type="text"
              placeholder="e.g. Mr & Mrs Kenneth Tan (3-Bed Upgrader)"
              value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              required
              className="w-full h-10 px-3 bg-[#eff4ff] border border-[#dce9ff] rounded-lg text-[13px] text-[#0b1c30] outline-none"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#45464d] block mb-1">Strategy Notes &amp; Unit Target</label>
            <textarea
              rows={2}
              placeholder="e.g. Recommended target quantum ~S$ 2.15M for high-floor unblocked park view..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full p-2.5 bg-[#eff4ff] border border-[#dce9ff] rounded-lg text-[13px] text-[#0b1c30] outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddNote(false)}
              className="px-3 py-1.5 text-[12px] font-bold text-[#45464d] hover:bg-[#eff4ff] rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-[12px] font-bold bg-[#006c49] text-white rounded-lg shadow-sm"
            >
              Save Client Dossier
            </button>
          </div>
        </form>
      )}

      {/* Bookmarked Sites List */}
      {activeSection === 'sites' && (
        <div className="flex flex-col gap-3">
          {bookmarkedSites.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#e5eeff] flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-[#45464d]">bookmark_border</span>
              <p className="font-['Manrope'] font-bold text-[#0b1c30]">No sites bookmarked yet</p>
              <p className="text-[13px] text-[#45464d]">
                Tap the bookmark icon on any GLS site in the Launches feed to pin it here.
              </p>
            </div>
          ) : (
            bookmarkedSites.map((site) => (
              <div
                key={site.id}
                className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex items-center justify-between"
              >
                <div
                  onClick={() => onOpenSiteDetails(site)}
                  className="flex flex-col cursor-pointer flex-1 mr-2"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-[#dce9ff] text-[#0b1c30] font-mono text-[10.5px] font-semibold">
                      {site.district}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#006c49]/10 text-[#006c49] text-[10.5px] font-bold">
                      {site.statusLabel}
                    </span>
                  </div>
                  <h4 className="font-['Manrope'] font-bold text-[16px] text-[#0b1c30] mt-1">
                    {site.name}
                  </h4>
                  <div className="flex items-center gap-3 text-[12px] text-[#45464d] font-mono mt-1">
                    <span>Bid: S$ {site.landBidPsf} psf</span>
                    <span>Launch: ~S$ {site.indicativeLaunchPsfLow} psf</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onOpenPitchModal()}
                    className="px-2.5 py-1.5 bg-[#eff4ff] text-[#006c49] font-bold text-[12px] rounded-lg hover:bg-[#dce9ff] flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                    <span className="hidden sm:inline">Pitch</span>
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(site.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6]/40"
                    title="Remove from saved"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Client Pitches List */}
      {activeSection === 'pitches' && (
        <div className="flex flex-col gap-3">
          {savedReports.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#e5eeff] flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[32px] text-[#45464d]">description</span>
              <p className="font-['Manrope'] font-bold text-[#0b1c30]">No saved client pitches yet</p>
              <p className="text-[13px] text-[#45464d]">
                Generate a 1-page pitch from the Forecaster or click &quot;New Pitch Note&quot; above.
              </p>
            </div>
          ) : (
            savedReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-xl bg-white border border-[#e5eeff] shadow-sm flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-[#006c49] uppercase">
                      Client Target: {report.clientTarget || 'Valued Property Investor'}
                    </span>
                    <h4 className="font-['Manrope'] font-bold text-[16px] text-[#0b1c30]">
                      {report.siteName}
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#45464d] font-mono">{report.dateCreated}</span>
                </div>

                {report.notes && (
                  <p className="text-[12.5px] text-[#45464d] bg-[#eff4ff] p-2.5 rounded-lg border border-[#dce9ff]">
                    {report.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff]">
                  <div className="text-[12px] font-mono text-[#0b1c30]">
                    Projected: <strong className="text-[#006c49]">{report.projectedPsf}</strong>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenPitchModal(report)}
                      className="px-2.5 py-1 rounded-md bg-[#000000] text-white text-[11px] font-bold flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-[14px]">visibility</span>
                      <span>View Pitch</span>
                    </button>
                    <button
                      onClick={() => onDeleteReport(report.id)}
                      className="w-7 h-7 rounded-md flex items-center justify-center text-[#ba1a1a] hover:bg-[#ffdad6]"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
