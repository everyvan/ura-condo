import React from 'react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#dce9ff] mt-12 sm:mt-16">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#eff4ff] border-b border-[#dce9ff]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#006c49] text-[20px]">notifications_active</span>
            <h3 className="font-['Manrope'] font-bold text-[16px] text-[#0b1c30]">
              URA &amp; GLS Live Alerts
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-[11px] font-bold text-[#006c49] hover:underline cursor-pointer"
            >
              Mark all read
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#45464d] hover:bg-[#dce9ff] cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-xl border transition-all ${
                item.read
                  ? 'bg-white border-[#e5eeff] opacity-80'
                  : 'bg-[#eff4ff] border-[#dce9ff] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-['Manrope'] font-bold text-[13.5px] text-[#0b1c30]">
                  {item.title}
                </span>
                <span className="text-[10px] font-mono text-[#45464d] shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-[12px] text-[#45464d] mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
