import React, { useState } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  agentName: string;
  agencyName: string;
  agentCea: string;
  onSaveProfile: (name: string, agency: string, cea: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  agentName,
  agencyName,
  agentCea,
  onSaveProfile,
}) => {
  const [name, setName] = useState(agentName);
  const [agency, setAgency] = useState(agencyName);
  const [cea, setCea] = useState(agentCea);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(name, agency, cea);
    onClose();
  };

  const agencyOptions = [
    'PropNex Realty',
    'ERA Realty Network',
    'Huttons Asia',
    'OrangeTee & Tie',
    'Knight Frank Singapore',
    'SRI (Singapore Realtors Inc)',
    'Independent Property Advisory',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#eff4ff] border-b border-[#dce9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[22px]">badge</span>
            <h3 className="font-['Manrope'] font-bold text-[16px] text-[#0b1c30]">
              Advisor Profile Settings
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#dce9ff]"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 text-[#0b1c30]">
          <p className="text-[12.5px] text-[#45464d]">
            These details appear on your generated 1-Page Agent Pitch PDF sheets and WhatsApp advisory summaries.
          </p>

          <div>
            <label className="text-[12px] font-bold text-[#45464d] block mb-1">
              Your Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-11 px-3 bg-[#eff4ff] border border-[#dce9ff] rounded-xl text-[14px] text-[#0b1c30] font-semibold outline-none focus:border-[#006c49]"
            />
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#45464d] block mb-1">
              Real Estate Agency
            </label>
            <select
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              className="w-full h-11 px-3 bg-[#eff4ff] border border-[#dce9ff] rounded-xl text-[14px] text-[#0b1c30] font-semibold outline-none focus:border-[#006c49]"
            >
              {agencyOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[12px] font-bold text-[#45464d] block mb-1">
              CEA Registration Number
            </label>
            <input
              type="text"
              value={cea}
              onChange={(e) => setCea(e.target.value)}
              placeholder="e.g. R058921B"
              required
              className="w-full h-11 px-3 bg-[#eff4ff] border border-[#dce9ff] rounded-xl text-[14px] text-[#0b1c30] font-mono font-semibold outline-none focus:border-[#006c49]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[12px] font-bold text-[#45464d] hover:bg-[#eff4ff] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-[12px] font-bold bg-[#006c49] text-white rounded-xl shadow-sm hover:bg-[#005236] transition cursor-pointer"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
