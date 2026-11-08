import React from 'react';
import { X, Bell, AlertTriangle, Calendar, Award } from 'lucide-react';
import { Announcement } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: Announcement[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  announcements,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
      <div className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-[32px] glass-panel p-6 border border-white/20 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E85A9E]/20 flex items-center justify-center text-[#E85A9E]">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-white font-medium text-lg tracking-tight">
                Vignan Institutional Notifications
              </h3>
              <p className="text-xs text-white/50">Official notices & wearable alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close notifications"
            className="w-10 h-10 rounded-full glass-button flex items-center justify-center text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Wearable Biometric Push Alert */}
        <div className="my-4 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-xs">
          <div className="flex items-center gap-2 text-amber-300 font-semibold mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Wearable Telemetry Recommendation</span>
          </div>
          <p className="text-white/80 leading-relaxed">
            Your Vignan Pulse Band recorded 135 active study minutes today with sustained cognitive focus. Hydrate and step away for 10 minutes before your afternoon lab.
          </p>
        </div>

        {/* Announcements List */}
        <div className="space-y-3">
          {announcements.map((anc) => (
            <div key={anc.id} className="glass-tile p-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/50">{anc.date}</span>
                {anc.isUrgent && (
                  <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-semibold border border-rose-500/30">
                    URGENT
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold text-white mt-1 leading-snug">
                {anc.title}
              </h4>
              <p className="text-xs text-white/70 mt-1 leading-relaxed">
                {anc.content}
              </p>
              <div className="text-[11px] text-white/40 mt-2">
                From: {anc.sender}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-white text-neutral-900 text-xs font-semibold hover:bg-neutral-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
